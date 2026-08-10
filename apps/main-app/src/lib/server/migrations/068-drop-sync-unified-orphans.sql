-- Drop the last four sync_unified_* trigger functions (2026-08-10).
--
-- Housekeeping, not a behaviour change. These are 043's and 045's trigger
-- functions, and they have been unreachable since 051 dropped the last of the
-- triggers that called them. 062 dropped the two account_* siblings, but only
-- incidentally — their bodies called sv_sync_account, which 062 was removing —
-- and left these four alone because they touched nothing that file cared about
-- (next-steps.md item 4).
--
-- They are now dead twice over. Each body is a two-line PERFORM of a function
-- that no longer exists:
--
--   sync_unified_lead_in()      PERFORM sv_sync_lead('in', NEW.id)       <- 067
--   sync_unified_lead_us()      PERFORM sv_sync_lead('us', NEW.id)       <- 067
--   sync_unified_business_in()  PERFORM sv_sync_business('in', NEW.business_id)  <- 064
--   sync_unified_business_us()  PERFORM sv_sync_business('us', NEW.id)   <- 064
--
-- A plpgsql body is not name-resolved until it runs, which is the only reason
-- they have survived this long without erroring: nothing has run them since 051.
--
-- Verified on live before writing this migration:
--   - exactly these four remain; pg_proc has no other sync_unified_* and no
--     sv_sync_* at all (067 took the last one);
--   - no trigger anywhere references them. The only two non-internal triggers on
--     live are blogs_search_update and blogs_updated_at on
--     personal_website_blogs, unrelated to any of this;
--   - no function body, view or default expression mentions them.
--
-- Code side: nothing, in either repo. A grep of solar-app-internal with no
-- language filter (the standing rule — its route code is .js) finds one hit, and
-- it is a comment in admin-app/src/lib/server/unifiedRead.js describing the
-- collapse. No call site exists.
--
-- The three places a code grep of src/ misses (see next-steps.md):
--   - replayed migrations: 047 is on the list and CREATE OR REPLACEs all six
--     sync_unified_* functions, so the test database really does have these four
--     — this is not a no-op there. It is exactly 064's and 067's situation, and
--     it takes the same treatment: this file goes on POST_BASELINE_MIGRATIONS,
--     last, so the replay ends where production does. 043 and 045, which
--     originally created them alongside their triggers, are deliberately not
--     replayed at all.
--   - fixtures.ts: nothing. It has never named a sync_unified_* function; the
--     fixtures called the sv_sync_* ones directly, and those calls went with
--     062/064/067.
--   - function bodies: none. Checked on live, and the four bodies here reference
--     only the already-dropped sv_sync_* pair.
--
-- No to_regclass guard needed and no rewind: DROP FUNCTION IF EXISTS is already
-- self-skipping, and nothing here is a rename.
--
-- No rollback script. These are recoverable verbatim from 047 (lines 110-123 and
-- 216-228) if they were ever wanted again, but they call functions that no
-- longer exist, so recreating them would produce four more orphans rather than
-- restore anything.
--
-- The baseline does not need regenerating: functions are not part of it (it is
-- generated from packages/db/src/schema, which declares tables only), which is
-- precisely why 047 is replayed on top.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 068-drop-sync-unified-orphans.sql

BEGIN;

DROP FUNCTION IF EXISTS sync_unified_lead_in();
DROP FUNCTION IF EXISTS sync_unified_lead_us();
DROP FUNCTION IF EXISTS sync_unified_business_in();
DROP FUNCTION IF EXISTS sync_unified_business_us();

COMMIT;

-- After committing, no sync_* or sv_sync_* function should remain:
--
--   SELECT proname FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
--    WHERE n.nspname = 'public' AND (proname LIKE 'sync_unified%' OR proname LIKE 'sv_sync%');
--   -- 0 rows. sv_slugify() is a different name and stays.
