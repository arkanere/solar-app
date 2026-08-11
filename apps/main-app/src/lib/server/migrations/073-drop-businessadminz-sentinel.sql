-- Replace the businessadminz@solar.com sentinel with NULL (2026-08-11).
--
-- ** NOT YET APPLIED. **
--
-- `business_accounts.login_email` is nullable, and NULL already means "we have
-- no address for this business" — claimLead checks for it by name ("There is
-- nothing to send to without one"). But 5885 of the 6709 accounts do not say
-- NULL; they say `businessadminz@solar.com`, a sentinel seeded onto every
-- scraped business that came in without a contact address. Same meaning, spelled
-- as data that looks real.
--
-- The cost of that spelling is that it looks like a deliverable address, so
-- every query that mails businesses had to name the string to avoid sending
-- 5885 copies of each mail to it. Four did. A fifth that forgot would not fail —
-- it would send. This migration makes the column say what it means, so the
-- queries can ask `login_email IS NOT NULL` and be right by construction.
--
-- Verified on live before writing this migration:
--   - 5885 rows carry it, every one created 2026-07-18, i.e. a single seeding
--     run, not something that accumulates;
--   - none has ever logged in (last_login IS NULL on all 5885);
--   - none has a visible profile (0 rows where business_profiles.isvisible),
--     which is why the four `<> 'businessadminz@solar.com'` predicates were
--     already redundant with the `isvisible = true` those queries also carry —
--     removing them changes no result set today;
--   - 5883 of them share the login_password `businessadminzpassword`, in
--     plaintext. That is not a live credential: PasswordManager verifies with
--     bcrypt.compare(), which returns false against a value that is not a bcrypt
--     hash, so these accounts cannot authenticate. It is cleared below anyway —
--     a shared plaintext string sitting in an auth column is worth removing on
--     sight, and it is part of the same seed. The other 2 rows hold real bcrypt
--     hashes and are left alone.
--
-- Note the wider problem this sits inside and does NOT fix: 6472 of 6709 rows
-- have a login_password that is not a bcrypt hash. This file only touches the
-- 5883 that are part of this sentinel seed. The rest need their own pass.
--
-- The three places a code grep of src/ misses (see next-steps.md):
--   - replayed migrations: not on POST_BASELINE_MIGRATIONS and must not be. It
--     is a data fix against production rows; the test database is built empty and
--     no fixture writes this address.
--   - fixtures.ts: creates accounts with a per-slug login_email, never the
--     sentinel. Nothing to change.
--   - function bodies: none read business_accounts (062 and 067 took the last of
--     the sv_sync_* family).
--
-- Deploy order: run this BEFORE the admin-app deploy, or alongside it. The four
-- queries move from naming the sentinel to `login_email IS NOT NULL`, which is
-- weaker while the sentinel is still in the data — it would admit those rows.
-- Nothing reaches them either way, because all 5885 profiles are invisible and
-- every one of those queries also filters `isvisible = true`; running this first
-- simply means never depending on that.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 073-drop-businessadminz-sentinel.sql

BEGIN;

UPDATE business_accounts
   SET login_email = NULL,
       login_password = CASE
         WHEN login_password = 'businessadminzpassword' THEN NULL
         ELSE login_password
       END,
       updated_at = NOW()
 WHERE login_email = 'businessadminz@solar.com';

COMMIT;

-- After committing, the sentinel should be gone and the row count should match
-- the 5885 that carried it:
--
--   SELECT count(*) FROM business_accounts WHERE login_email = 'businessadminz@solar.com';
--   -- 0
--   SELECT count(*) FROM business_accounts WHERE login_password = 'businessadminzpassword';
--   -- 0
--   SELECT count(*) FROM business_accounts WHERE login_email IS NULL;
--   -- 5885 + whatever was already NULL (0 at the time of writing)
