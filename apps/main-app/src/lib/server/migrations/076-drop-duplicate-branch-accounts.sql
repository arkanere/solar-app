-- Delete the branch account rows (2026-08-11).
--
-- ** APPLIED to live 2026-08-11, on explicit instruction, WITHOUT waiting to
-- confirm the code deploy had landed. ** SELECT 203 archived, UPDATE 4
-- last_logins folded into their mains, DELETE 203. Afterwards: 6506 accounts
-- (6709 - 203), 0 branch accounts left, 203 rows in the archive table, and 0
-- profiles cut off from a login — the check that matters. business_profiles is
-- unchanged at 6709, so the end state is 6506 accounts across 6709 locations,
-- with 68 businesses holding more than one.
--
-- The ordering note below stands and was not satisfied. If any production build
-- still joins `a.source_id = b.business_id`, branch-slug logins, magic links,
-- password resets and the admin edit page fail for the 203 branch locations
-- until the deploy lands. Nothing is lost either way — the rows are in
-- business_accounts_archive_076 — but that is the window to watch.
--
-- ** MUST FOLLOW THE CODE DEPLOY, NOT PRECEDE IT. **
--
-- Step three, after 075 added business_profiles.account_business_id and the code
-- switched every account lookup onto it. This deletes what that made redundant:
-- the account rows belonging to branch profiles, which exist only as copies of
-- their main's credentials.
--
-- After this, business_accounts is one row per business and business_profiles is
-- one row per location — which is the shape the whole sequence was for.
--
-- ** Order matters, in this direction only. ** A deployed reader that still
-- joins `a.source_id = b.business_id` finds nothing for a branch once these rows
-- are gone, so branch-slug logins, magic links and password resets would all
-- fail. Reading through account_business_id works whether or not this has run —
-- that is why the code goes first and this follows, rather than shipping
-- together.
--
-- Measured on live before writing this migration:
--   - 203 accounts belong to a branch profile;
--   - all 203 carry their main's login_email verbatim, so no address is lost;
--   - 197 carry its password too. The other 6 are stale copies from before their
--     main last changed its password — deleting those is a fix, not a loss: they
--     are credentials that no longer match the business they belong to;
--   - 4 carry a last_login, most recently 2026-08-08. Those timestamps are the
--     one thing here that is not a duplicate, and they are folded into the main's
--     row below rather than dropped;
--   - 0 have a reset_token outstanding;
--   - 0 are referenced by legal_acceptances, the only FK into this table, so
--     nothing blocks the delete.
--
-- The backup table is not optional. This is the only irreversible step in the
-- sequence and the rows carry credentials, so they are copied first and can be
-- restored with a plain INSERT ... SELECT. Drop business_accounts_archive_076
-- by hand once a branch login has been sanity-checked in production.
--
-- The three places a code grep of src/ misses (see next-steps.md):
--   - replayed migrations: not on POST_BASELINE_MIGRATIONS and must not be. It
--     is a data fix against production rows; the test database is built empty
--     and its fixtures already create no branch accounts.
--   - fixtures.ts: createBranch inserts the branches row and repoints
--     account_business_id, and never made an account for the branch. Nothing to
--     change.
--   - function bodies: none read business_accounts (062 and 067 took the last of
--     the sv_sync_* family).
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 076-drop-duplicate-branch-accounts.sql

BEGIN;

CREATE TABLE IF NOT EXISTS business_accounts_archive_076 AS
SELECT a.*
  FROM business_accounts a
  JOIN business_profiles p ON p.business_id = a.source_id
 WHERE p.account_business_id <> p.business_id;

-- Keep the only non-duplicate fact these rows hold. A branch's last_login is a
-- real sign-in by the business, so the main should show the latest of its own
-- and its branches' rather than losing them.
UPDATE business_accounts m
   SET last_login = GREATEST(m.last_login, sub.branch_last_login),
       updated_at = NOW()
  FROM (
	SELECT p.account_business_id AS main_id, MAX(a.last_login) AS branch_last_login
	  FROM business_accounts a
	  JOIN business_profiles p ON p.business_id = a.source_id
	 WHERE p.account_business_id <> p.business_id
	   AND a.last_login IS NOT NULL
	 GROUP BY p.account_business_id
  ) sub
 WHERE m.source_id = sub.main_id;

DELETE FROM business_accounts a
 USING business_profiles p
 WHERE p.business_id = a.source_id
   AND p.account_business_id <> p.business_id;

COMMIT;

-- After committing, every account belongs to a profile that owns it, and every
-- profile still resolves to exactly one account:
--
--   SELECT count(*) FROM business_accounts a JOIN business_profiles p
--     ON p.business_id = a.source_id WHERE p.account_business_id <> p.business_id;
--   -- 0
--   SELECT count(*) FROM business_accounts;
--   -- 6506 (6709 - 203)
--   SELECT count(*) FROM business_profiles p
--    WHERE NOT EXISTS (SELECT 1 FROM business_accounts a WHERE a.source_id = p.account_business_id);
--   -- 0  <- the important one: no location has been cut off from its login
