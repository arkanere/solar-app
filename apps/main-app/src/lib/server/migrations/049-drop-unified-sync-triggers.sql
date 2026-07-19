-- Phase 2.4, step 1: drop the unified-table sync triggers (043/045/046).
--
-- Every writer now projects its own writes via explicit sv_sync_* calls
-- (main-app, business-app, user-app on the refactor branch; admin-app on
-- solar-app-internal main), so the triggers are redundant. The sv_sync_lead/
-- business/account FUNCTIONS are NOT dropped — they are what the apps call.
--
-- The 039/040 triggers (businesses_1 -> in_business_profiles /
-- in_business_accounts) are deliberately KEPT: business-app IN writes still
-- target businesses_1 and rely on them to keep the split tables fresh
-- (admin-app reads in_business_profiles; sv_sync_business('in') sources from
-- it). They drop in a later migration once business-app IN writes are
-- repointed at the split tables.
--
-- !! DO NOT APPLY until PR #2 (refactor/country-scalable-architecture) is
-- !! merged AND deployed for main-app, business-app, and user-app, and the
-- !! admin-app deploy (solar-app-internal main) is live. Production code
-- !! without the sv_sync_* calls depends on these triggers.
--
-- Before and after applying, run check-unified-drift.sql; after applying,
-- exercise one lead write and one business edit per country and re-run it.
-- Run manually: psql $POSTGRES_URL < 049-drop-unified-sync-triggers.sql

BEGIN;

-- 045: leads
DROP TRIGGER IF EXISTS leaddata_unified_sync ON leaddata;
DROP TRIGGER IF EXISTS us_leaddata_unified_sync ON us_leaddata;

-- 043: businesses
DROP TRIGGER IF EXISTS in_business_profiles_unified_sync ON in_business_profiles;
DROP TRIGGER IF EXISTS us_businesses_unified_sync ON us_businesses;

-- 046: business_accounts
DROP TRIGGER IF EXISTS businesses_1_unified_account_sync ON businesses_1;
DROP TRIGGER IF EXISTS us_businesses_unified_account_sync ON us_businesses;

COMMIT;

-- Rollback (recreates the thin wrappers; the sv_sync_* functions still exist):
--   CREATE TRIGGER leaddata_unified_sync AFTER INSERT OR UPDATE ON leaddata
--     FOR EACH ROW EXECUTE FUNCTION sync_unified_lead_in();
--   CREATE TRIGGER us_leaddata_unified_sync AFTER INSERT OR UPDATE ON us_leaddata
--     FOR EACH ROW EXECUTE FUNCTION sync_unified_lead_us();
--   CREATE TRIGGER in_business_profiles_unified_sync AFTER INSERT OR UPDATE ON in_business_profiles
--     FOR EACH ROW EXECUTE FUNCTION sync_unified_business_in();
--   CREATE TRIGGER us_businesses_unified_sync AFTER INSERT OR UPDATE ON us_businesses
--     FOR EACH ROW EXECUTE FUNCTION sync_unified_business_us();
--   CREATE TRIGGER businesses_1_unified_account_sync AFTER INSERT OR UPDATE ON businesses_1
--     FOR EACH ROW EXECUTE FUNCTION sync_unified_account_in();
--   CREATE TRIGGER us_businesses_unified_account_sync AFTER INSERT OR UPDATE ON us_businesses
--     FOR EACH ROW EXECUTE FUNCTION sync_unified_account_us();
