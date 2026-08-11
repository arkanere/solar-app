-- business_accounts.is_active (2026-08-11).
--
-- ** NOT YET APPLIED. **
--
-- Step one of separating the two flags that have both been called `isvisible`
-- since 062 split the table. They are different questions:
--
--   business_accounts.isvisible   can this business log in?
--   business_profiles.isvisible   is this location listed publicly?
--
-- Sharing a name is why three endpoints carry a comment explaining which half
-- they mean (deleteAccount, deleteBranch, and TokenManager's two slug lookups),
-- and why deleteBranch has a paragraph warning that the obvious second write
-- would lock the parent out. This renames the account half to `is_active` so
-- the question each one answers is readable at the call site.
--
-- Additive on purpose, exactly as 075 was: this file adds and backfills the new
-- column and leaves `isvisible` in place, so it is safe to apply on its own and
-- every existing query keeps working. 080 drops the old column after the code
-- deploy.
--
-- ** The backfill is COALESCE(isvisible, false), not COALESCE(isvisible, true).
-- ** The column is nullable today with no default, and NULL has always meant
-- *not* active at every reader: TokenManager.ts:75 tests `!business.isvisible`,
-- which is true for NULL, and the two slug lookups filter
-- `eq(businessAccounts.isvisible, true)`, which excludes NULL. Defaulting NULL
-- to true would hand a login to every account that cannot currently sign in.
--
-- Measure before applying — this is the one number that decides whether the
-- backfill silently changes anyone's access:
--
--   SELECT isvisible, count(*) FROM business_accounts GROUP BY isvisible;
--
-- Whatever the NULL count is, those rows are already locked out, so mapping
-- them to is_active = false preserves behaviour rather than changing it. The
-- query is here so the number is recorded, not because a value would change the
-- migration.
--
-- The new column takes DEFAULT true because that is what a freshly created
-- account should be, and submitBusiness passes the value explicitly anyway.
--
-- ** Apply BEFORE the code deploy. ** Between this and the deploy, the old code
-- still writes `isvisible` only, so `is_active` goes stale for any account
-- hidden in that window; after the deploy the reverse is true until 080. Both
-- windows are one deploy long and neither loses data — the loser column is
-- dropped rather than read.
--
-- The three places a code grep of src/ misses (see next-steps.md):
--   - replayed migrations: not on POST_BASELINE_MIGRATIONS and does not need to
--     be. The column is declared in packages/db/src/schema, so the generated
--     baseline carries it. 047 and 055 do INSERT INTO business_accounts
--     (... isvisible ...) inside sv_sync_account, but that body is plpgsql —
--     column names in it are resolved at call time, not at CREATE FUNCTION —
--     and 062, replayed after both, drops the function outright.
--   - fixtures.ts: createBusiness and createUsBusiness insert accounts and are
--     switched to is_active in the same commit.
--   - function bodies: sv_sync_account was the only one that wrote this table
--     and 062 dropped it. Nothing live names the column.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 077-account-is-active.sql

BEGIN;

ALTER TABLE business_accounts
	ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- NULL is inactive. See the header — this is the whole reason the file has one.
UPDATE business_accounts
   SET is_active = COALESCE(isvisible, FALSE);

COMMIT;

-- After committing, the new column agrees with the old one everywhere, with
-- NULL folded to false:
--
--   SELECT count(*) FROM business_accounts
--    WHERE is_active IS DISTINCT FROM COALESCE(isvisible, FALSE);
--   -- 0
--
--   SELECT is_active, count(*) FROM business_accounts GROUP BY is_active;
--   -- should match the isvisible grouping above, with the NULL bucket having
--   -- moved into `false`.
