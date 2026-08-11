-- Drop business_accounts.isvisible (2026-08-11).
--
-- ** NOT YET APPLIED. **
--
-- ** MUST FOLLOW THE CODE DEPLOY, NOT PRECEDE IT. **
--
-- The second half of 077. That file added `is_active` and backfilled it; the
-- code now reads and writes `is_active` everywhere, so the old column is dead
-- weight whose only remaining effect is to be confusable with
-- business_profiles.isvisible, which is a different question and keeps its name.
--
-- Between 077 and the deploy the old code wrote `isvisible` only, so re-run
-- 077's agreement check immediately before this one — it is the whole reason
-- the two files are separate:
--
--   SELECT count(*) FROM business_accounts
--    WHERE is_active IS DISTINCT FROM COALESCE(isvisible, FALSE);
--   -- Every row here changed its visibility in the window between 077 and the
--   -- deploy, and the `isvisible` value is the newer one. If it is not 0, fold
--   -- them forward before dropping the column:
--   --
--   --   UPDATE business_accounts SET is_active = COALESCE(isvisible, FALSE)
--   --    WHERE is_active IS DISTINCT FROM COALESCE(isvisible, FALSE);
--   --
--   -- Do that as a separate statement and check the count again, rather than
--   -- adding it below: if it is not 0 that is worth seeing, not automating.
--
-- There is no archive table. Unlike 076's credentials and 078's relationships,
-- this column holds one boolean that `is_active` already carries, verified by
-- the query above at the moment of the drop.
--
-- ** Order matters, in this direction only. ** Nothing deployed reads
-- `isvisible` on this table after the code change, and `is_active` exists from
-- 077 onward, so this is the least dangerous file in the sequence. It still goes
-- after the deploy: a running old build filters
-- `eq(businessAccounts.isvisible, true)` on the login path, so dropping the
-- column early fails every sign-in.
--
-- The three places a code grep of src/ misses (see next-steps.md):
--   - replayed migrations: not on POST_BASELINE_MIGRATIONS and does not need to
--     be. Nothing on that list references business_accounts.isvisible outside a
--     plpgsql body, and 062 — replayed after all of them — drops the one
--     function (sv_sync_account) those bodies belong to. Once
--     packages/db/src/schema declares `is_active` instead, the regenerated
--     baseline creates only the new column and there is nothing to drop.
--   - fixtures.ts: switched to is_active by 077's commit.
--   - function bodies: none. sv_sync_account was the only writer and 062 dropped
--     it.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 080-drop-account-isvisible.sql

BEGIN;

ALTER TABLE business_accounts
	DROP COLUMN IF EXISTS isvisible;

COMMIT;

-- After committing, one flag per question:
--
--   SELECT count(*) FROM information_schema.columns
--    WHERE table_name = 'business_accounts' AND column_name = 'isvisible';
--   -- 0
--
--   SELECT is_active, count(*) FROM business_accounts GROUP BY is_active;
--   -- totals 6506, the account count 076 left behind
--
--   SELECT count(*) FROM information_schema.columns
--    WHERE column_name = 'isvisible'
--      AND table_name IN ('business_accounts', 'business_profiles');
--   -- 1, and it is business_profiles' — the per-location listing flag
