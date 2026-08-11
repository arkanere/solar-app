-- Drop the `branches` table (2026-08-11).
--
-- ** NOT YET APPLIED. **
--
-- ** MUST FOLLOW THE CODE DEPLOY, NOT PRECEDE IT. **
--
-- 075 added business_profiles.account_business_id, which states the same
-- main-to-branch edge this table stores: a main names itself, a branch names its
-- main. 075 deliberately kept `branches` alive as the store for `isactive`,
-- because that flag had nowhere else to live. This file removes the table once
-- that is no longer true.
--
-- `isactive` folds into business_profiles.isvisible. The two have always been
-- written together — addBranch sets both, deleteBranch sets both false in the
-- same request (deleteBranch/+server.ts:58 and :73) — so the flag is a duplicate
-- rather than an independent fact. After the fold, "this branch is deactivated"
-- is business_profiles.isvisible = false, which is the same column that already
-- decides whether the location is listed. That is the whole point: a branch has
-- no login of its own (076 deleted those rows), so listing state is the only
-- state it has.
--
-- The reconcile below is not decoration. If any row has isactive = false while
-- its profile has isvisible <> false, dropping the table without it would
-- silently *reactivate* that branch — it would reappear in the branch list, in
-- the CRM's business-id set, and in the public listing. Measure first:
--
--   SELECT count(*) FROM branches br JOIN business_profiles p
--     ON p.business_id = br.branch_id
--    WHERE br.isactive IS DISTINCT FROM FALSE AND p.isvisible IS DISTINCT FROM TRUE;
--   -- branches live but profile hidden: these stay hidden, no action
--
--   SELECT count(*) FROM branches br JOIN business_profiles p
--     ON p.business_id = br.branch_id
--    WHERE br.isactive IS DISTINCT FROM TRUE AND p.isvisible IS DISTINCT FROM FALSE;
--   -- branches dead but profile visible: these are what the UPDATE below fixes.
--   -- If this is 0 the UPDATE is a no-op and the fold was already total.
--
-- 075 verified the rest of the shape on live and none of it has changed: 203
-- rows, 203 distinct branch_id, no branch that is also a main, no dangling id,
-- no pair spanning two countries, and account_business_id backfilled from this
-- table for every one of them. So the edge is fully represented already and this
-- drop loses no relationship.
--
-- The archive table is not optional, for the same reason 076's was: this is
-- irreversible and the rows are the only record of which locations were ever
-- branches of which main. `account_business_id` carries the edge forward, but
-- not `created_at` or the isactive history. Drop branches_archive_078 by hand
-- once a branch list has been sanity-checked in production.
--
-- ** Order matters, in this direction only. ** A deployed reader that still
-- selects FROM branches gets a missing-table error the moment this runs, so the
-- branch list, the CRM lead scoping, addBranch, deleteBranch and the two
-- ownership checks would all 500. Reading through account_business_id works
-- whether or not this has run — that is why the code goes first.
--
-- The three places a code grep of src/ misses (see next-steps.md):
--   - replayed migrations: not on POST_BASELINE_MIGRATIONS and must not be. No
--     file on that list names `branches` — 055's only mention is in a comment —
--     so once packages/db/src/schema stops declaring the table the regenerated
--     baseline simply stops creating it, and there is nothing left to drop.
--     scripts/apply-test-migrations.mjs's header lists `branches` among the
--     tables that predate the migrations convention; that line is corrected in
--     the same commit.
--   - fixtures.ts: createBranch inserted the branches row and repointed
--     account_business_id. It now only repoints account_business_id and sets
--     isvisible. Updated in the same commit.
--   - function bodies: none read or write `branches`. 062/064/067 took the last
--     of the sv_sync_* family and none of them ever touched it.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 078-drop-branches.sql

BEGIN;

CREATE TABLE IF NOT EXISTS branches_archive_078 AS
SELECT * FROM branches;

-- Fold isactive into isvisible. A deactivated branch must stay deactivated when
-- the only remaining flag is the profile's.
UPDATE business_profiles p
   SET isvisible = FALSE,
       updated_at = NOW()
  FROM branches br
 WHERE br.branch_id = p.business_id
   AND br.isactive IS DISTINCT FROM TRUE
   AND p.isvisible IS DISTINCT FROM FALSE;

DROP TABLE branches;

COMMIT;

-- After committing, every relationship the table held is still readable through
-- account_business_id, and no branch changed visibility except the ones the fold
-- was for:
--
--   SELECT count(*) FROM branches_archive_078;
--   -- 203, matching what 075 measured
--
--   SELECT count(*) FROM business_profiles WHERE account_business_id <> business_id;
--   -- 203, the same set, now stated only by the column
--
--   SELECT count(*) FROM business_profiles p JOIN branches_archive_078 br
--     ON br.branch_id = p.business_id
--    WHERE br.isactive IS DISTINCT FROM TRUE AND p.isvisible IS DISTINCT FROM FALSE;
--   -- 0  <- the fold is total: no branch the old table called dead is visible
--
--   SELECT to_regclass('public.branches');
--   -- NULL
