-- Clear the seeded plaintext login_password (2026-08-11).
--
-- ** NOT YET APPLIED. **
--
-- After 073 there are exactly 589 rows left in business_accounts whose
-- login_password is not a bcrypt hash, and every one of them holds the same
-- literal string: `businessadminzpassword`. It is the other half of the seed 073
-- dealt with — 073 keyed its WHERE on the sentinel *address*, so it cleared the
-- 5883 copies sitting beside that address and left these, which sit beside real
-- ones. This finishes the job from the other side, keyed on the password value.
--
-- These are live businesses, not seed rows. Measured on live:
--   - 589 rows, across 448 distinct real login_email addresses;
--   - 441 have a visible profile;
--   - 152 have actually logged in.
-- Which is why this is its own migration rather than a widened 073, and why it
-- clears the column rather than touching identity.
--
-- ** It is not a live credential, and clearing it is not a lockout. **
-- PasswordManager.validatePassword() is the only reader
-- (apps/business-app/src/lib/auth/business/PasswordManager.ts:50) and verifies
-- with bcrypt.compare(), which returns false for anything that is not a valid
-- bcrypt hash. So no one can sign in with this string today, and no one loses a
-- working sign-in when it goes. The 152 who have logged in did so by magic link,
-- which is unaffected. What changes is only the message: a NULL sends
-- validatePassword down its "Password authentication not available. Please use
-- magic link." branch instead of "Invalid credentials", which is the truthful
-- one. Anybody wanting a real password gets one through /reset-password, which
-- writes a proper hash.
--
-- NULL is an established state for this column, not a new one: deleteAccount
-- already sets `login_password = NULL` on the accounts it deactivates.
--
-- Worth knowing, and the reason not to leave this alone: the string has been
-- *spreading*. addBranch (+server.ts:171) and claimLead (+server.ts:315) both
-- copy the main account's login_password onto a newly created branch account, so
-- every branch opened under one of these 589 businesses inherited the plaintext
-- too. After this runs they inherit NULL, and the spread stops.
--
-- Deliberately NOT done here: deleting the 6065 accounts whose profile is
-- invisible. That was considered and rejected — those rows are the onboarding
-- pipeline. admin-app's verification flow UPDATEs business_accounts to set the
-- real login_email and isvisible (allbusinesses/[id]/edit/+page.server.js:136),
-- and it is an UPDATE, not an upsert; no code in that repo can INSERT an account
-- row at all. Deleting them would make every scraped business unverifiable,
-- silently (0 rows updated) and then loudly at the welcome mail.
--
-- The three places a code grep of src/ misses (see next-steps.md):
--   - replayed migrations: not on POST_BASELINE_MIGRATIONS and must not be. It
--     is a data fix against production rows; fixtures write their own passwords.
--   - fixtures.ts: createBusiness takes loginPassword and the suite passes real
--     bcrypt hashes (or null). It has never written this string.
--   - function bodies: none read business_accounts (062 and 067 took the last of
--     the sv_sync_* family).
--
-- No rollback script, and none is wanted: restoring a shared plaintext string to
-- an auth column is not a state to be able to get back to. The recovery path for
-- any individual business is /reset-password.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 074-clear-seeded-plaintext-passwords.sql

BEGIN;

UPDATE business_accounts
   SET login_password = NULL,
       updated_at = NOW()
 WHERE login_password = 'businessadminzpassword';

COMMIT;

-- After committing, every surviving password should be a bcrypt hash:
--
--   SELECT count(*) FROM business_accounts WHERE login_password = 'businessadminzpassword';
--   -- 0
--   SELECT count(*) FROM business_accounts
--    WHERE login_password IS NOT NULL AND login_password NOT LIKE '$2%';
--   -- 0
