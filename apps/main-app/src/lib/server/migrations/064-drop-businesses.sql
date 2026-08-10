-- Drop the `businesses` projection (2026-08-10).
--
-- ** NOT YET APPLIED. ** Step 2b, and the last of the collapse. Run this only
-- after 063 has been deployed and has been quiet — see the gate below. Once it
-- runs, `business_profiles` + `business_accounts` are the whole story for a
-- business, and `leads` is the only projection left anywhere.
--
-- 062 archived businesses_1. 063 gave business_profiles the country-neutral
-- column names and moved all ~329 reads of `businesses` onto it, which is what
-- makes this a drop of something unread rather than a drop of the table every
-- public installer page depends on. Splitting the two is the entire reason
-- there is a 064: a rename is reversible from its rollback script, a dropped
-- table is not reversible by reverting code.
--
-- ** THE GATE — check before running, not after. ** 063's deploy is what makes
-- this safe, so confirm it actually landed and that nothing still reads the
-- table:
--
--   SELECT seq_scan, idx_scan, n_tup_ins, n_tup_upd
--     FROM pg_stat_user_tables WHERE relname = 'businesses';
--
-- Note the numbers, wait, and read them again. They must be FLAT. Any movement
-- means a reader or a writer is still live — most likely an instance running
-- pre-063 code, or an ISR page that has not revalidated. `businesses` pages are
-- ISR with a 1296000s (15 day) expiration, so a cached response proves nothing
-- either way; it is the counters that matter. n_tup_ins/n_tup_upd advancing
-- means some path is still calling sv_sync_business, which this file drops.
--
-- Verified on live as of 063:
--   - 6708 rows, 1:1 with business_profiles on (country_code, source_id) <->
--     (country_code, business_id), 0 value drift on every column;
--   - no inbound foreign keys, no triggers, no views;
--   - businesses_id_seq is OWNED BY businesses.id, and unlike businesses_1's it
--     is genuinely disposable — nothing mints from it. `businesses.id` was a
--     second surrogate key that no code ever read: every read aliased
--     `source_id AS id` (unifiedRead.ts:109,137 before 063). DROP TABLE takes
--     the sequence, which is correct here.
--
-- Code side, to change in the same commit as applying this:
--   business-app  lib/server/unifiedSync.ts    syncBusinessToUnified deleted
--                 lib/server/writeTargets.ts   the projection-vs-store preamble
--                                              now describes `leads` only
--                 api/addBranch, api/deleteBranch, api/deleteAccount,
--                 api/updateBusinessDetails, api/claimLead   sync calls removed
--   main-app      lib/server/unifiedSync.ts    same
--                 api/submitBusiness           sync call removed
--
-- After this, business-app's unifiedSync.ts holds only syncLeadToUnified, and
-- main-app's only syncLeadToUnified — worth collapsing the module into
-- lib/server/leads.ts at that point rather than keeping a barrel for one
-- function, but that is tidying and does not belong in this commit.
--
-- The three places a code grep of src/ misses (see next-steps.md):
--   - replayed migrations: 043 creates `businesses`, and 047/055/061/063 all
--     CREATE OR REPLACE sv_sync_business with a body that INSERTs into it.
--     Bodies are not name-resolved at CREATE time, so they survive; 043 is not
--     on the replay list. This file goes at the END of POST_BASELINE_MIGRATIONS,
--     after 063, so the test database ends where production does. The baseline
--     stops creating `businesses` once regenerated, so no rewind is needed —
--     unlike 061/062/063, nothing here is a rename.
--   - fixtures.ts: `businesses` leaves the TRUNCATE list, and both
--     createBusiness/createUsBusiness drop their sv_sync_business call — after
--     which they insert two rows and call nothing, which is the point.
--   - function bodies: sv_sync_business only, dropped below. sv_sync_lead is
--     untouched and still needed.
--
-- DESTRUCTIVE and irreversible — there is no rollback script, deliberately.
-- `businesses` is fully derivable from business_profiles, so the honest
-- "rollback" is to re-run 043's CREATE TABLE and re-project, not to restore a
-- dump. Take one anyway before running:
--   pg_dump "$POSTGRES_URL_NON_POOLING" -t businesses > businesses-archive.sql
--
-- Regenerate the baseline after applying:
--   npm run pull -w @solar/db && node scripts/generate-test-baseline.mjs
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 064-drop-businesses.sql

BEGIN;

DROP FUNCTION IF EXISTS sv_sync_business(character, integer);

DROP TABLE IF EXISTS businesses;

COMMIT;

-- After committing:
--
--   SELECT to_regclass('businesses');                                  -- NULL
--   SELECT proname FROM pg_proc WHERE proname LIKE 'sv_sync%';         -- sv_sync_lead only
--   SELECT count(*) FROM business_profiles;                            -- 6708, untouched
