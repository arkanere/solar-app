-- Drop in_business_accounts and its sync function (2026-08-09).
--
-- The table is a dead branch of the projection chain. 040 created it as the
-- account-side counterpart of in_business_profiles, and 050 wrapped 040's
-- trigger body in sv_sync_in_business_account(id), called from sv_sync_in_split.
-- 054 then rewrote sv_sync_in_split to inline the profile upsert and dropped the
-- account call, so nothing has written the table through the sync chain since.
--
-- Meanwhile the unified projection never depended on it: sv_sync_account reads
-- businesses_1 directly (047, repointed by 055), not this table. The plan in
-- docs/country-scalable-architecture.md step 6 was to repoint sv_sync_account
-- here once businesses_1 froze; that freeze never happened, 054/055 instead
-- united both countries on businesses_1 + in_business_profiles, and unified
-- business_accounts now fills the role this table was meant to grow into.
--
-- Verified on live before writing this migration:
--   - 6696 rows, against 6708 in businesses_1 — already drifting, with nothing
--     reading it to notice;
--   - no inbound foreign keys, no triggers, no views or matviews reference it;
--   - sv_sync_in_business_account is the only function body that mentions it,
--     and no other function calls that function — it is dropped here rather
--     than left as an orphan;
--   - in_business_accounts_id_seq is OWNED BY the table, so DROP TABLE takes it.
--
-- Code side, deleted in the same commit as this file:
--   main-app     the `if (country === 'in')` insert block in
--                routes/[country=country]/api/submitBusiness/+server.ts — the
--                only writer anywhere in the monorepo — and its import
--   db           inBusinessAccounts in schema.ts
--   migrations   the split_accounts_in scope in check-unified-drift.sql, which
--                diffed businesses_1 against this table
--   tests        the entry in fixtures.ts's TRUNCATE list
--
-- No reader existed in any app: business-app's auth layer goes to unified
-- business_accounts throughout (resolveCountry, passwordReset, LoginTracker),
-- and user-app has no reference. solar-app-internal's admin-app declares the
-- table in its generated schema.ts but its schema barrel does not import it, so
-- the drop does not reach that repo either — only its next pull does.
--
-- The three places a code grep of src/ misses (see next-steps.md):
--   - replayed migrations: 050 is on apply-test-migrations.mjs's list and both
--     creates sv_sync_in_business_account and has sv_sync_in_split call it. That
--     is fine without a to_regclass guard — a plpgsql body is not name-resolved
--     at CREATE time, and 054, replayed after it, replaces sv_sync_in_split with
--     the version that does not call it. The orphan function is recreated in the
--     test database and never invoked, exactly as on live before this migration.
--   - fixtures.ts TRUNCATE list: updated in this commit.
--   - function bodies: only sv_sync_in_business_account, dropped below.
--
-- DESTRUCTIVE and irreversible. Take a backup first:
--   pg_dump "$POSTGRES_URL_NON_POOLING" -t in_business_accounts > in_business_accounts-archive.sql
--
-- The test baseline is generated from packages/db/src/schema, so regenerate it
-- after applying this:
--   npm run pull -w @solar/db && node scripts/generate-test-baseline.mjs
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 060-drop-in-business-accounts.sql

BEGIN;

DROP TABLE IF EXISTS in_business_accounts;

DROP FUNCTION IF EXISTS sv_sync_in_business_account(INTEGER);

COMMIT;
