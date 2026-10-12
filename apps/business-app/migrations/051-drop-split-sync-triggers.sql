-- Phase 2.4, step 2: drop the 039/040 businesses_1 -> split-table triggers.
--
-- Every businesses_1 writer now projects its own writes into
-- in_business_profiles / in_business_accounts: business-app calls
-- sv_sync_in_split() after each businesses_1 write (deployed), and main-app /
-- admin-app write the split tables first-class with businesses_1 as the
-- trailing dual-write. The sv_sync_in_* FUNCTIONS (050) are kept — they are
-- what the apps call.
--
-- After this, businesses_1 is write-only shadow state: nothing is derived
-- from it by trigger any more. (sv_sync_account('in') still READS it as the
-- account-column source; that repoints to in_business_accounts when
-- businesses_1 is frozen.)
-- Run manually: psql $POSTGRES_URL < 051-drop-split-sync-triggers.sql

BEGIN;

DROP TRIGGER IF EXISTS businesses_1_profile_sync ON businesses_1;
DROP TRIGGER IF EXISTS businesses_1_account_sync ON businesses_1;

COMMIT;

-- Rollback (functions still exist):
--   CREATE TRIGGER businesses_1_profile_sync AFTER INSERT OR UPDATE ON businesses_1
--     FOR EACH ROW EXECUTE FUNCTION sync_business_profile();
--   CREATE TRIGGER businesses_1_account_sync AFTER INSERT OR UPDATE OF
--     login_email, login_password, magic_link_token, magic_link_token_expires_at,
--     reset_token, reset_token_expires, isvisible, last_login
--   ON businesses_1 FOR EACH ROW EXECUTE FUNCTION sync_business_account();
