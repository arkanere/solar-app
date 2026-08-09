-- Drop the referrer feature entirely (2026-08-09).
--
-- The feature never worked end to end. business-app let a business create
-- referrers and copy a share link, but that link pointed at
-- `/{country}/solar-panel-installer/{slug}/referrer/{ref}`, a route main-app has
-- never had in either country and produces no rewrite for. Nothing anywhere read
-- a referrer back out of a submitted lead, so even a working URL would not have
-- attributed anything. Rather than design the missing half (see the deleted
-- item 1 in next-steps.md), the whole feature is removed.
--
-- Deleted in the same commit as this file:
--   business-app  routes/(layout-1)/[business_slug]/referral/ (both files)
--                 routes/api/addReferrer/, routes/api/deleteReferrer/
--                 lib/components/AddReferrer.svelte
--                 the Sidebar entry, the dashboard's referrersCount query,
--                 the Referrer types in lib/types/api.ts and the
--                 referrersCount field on SetupProgress
--   validation    addReferrerSchema, AddReferrerInput, and the `inMobile`
--                 primitive, which had no other caller
--   db            svReferrers in schema.ts and its relations
--   tests         createReferrer, the sv_referrers entry in the TRUNCATE list,
--                 and the five /referral cases in pageCountry.test.ts
--
-- main-app had no referrer code at all — its only matches were `rel="noopener
-- noreferrer"` attributes.
--
-- This also closes what next-steps.md tracked as item 6: sv_referrers_slug_key
-- was UNIQUE on slug alone across all businesses, so two businesses could not
-- both have a referrer slugged "ravi", and sv_referrers_business_id_slug_idx
-- duplicated the unique constraint beside it. Both go with the table.
--
-- DESTRUCTIVE and irreversible. Take a backup first:
--   pg_dump "$POSTGRES_URL_NON_POOLING" -t sv_referrers > sv_referrers-archive.sql
--
-- Verified on live before writing this migration:
--   - 5 rows;
--   - no inbound foreign keys and no views or matviews reference the table;
--   - exactly one trigger, sv_referrers_updated_at_trigger, running
--     sv_referrers_set_updated_at, which no other trigger uses and no other
--     function body mentions — so the function is dropped here too rather than
--     left behind as an orphan;
--   - sv_referrers_id_seq is OWNED BY sv_referrers.id, so DROP TABLE takes it.
--
-- Nothing replayed by scripts/apply-test-migrations.mjs touches sv_referrers, so
-- unlike 056 and 058 this drop needs no to_regclass(...) guard anywhere: 040 and
-- 057 are the only migrations that mention referrers and neither is on that
-- list. The test baseline is generated from packages/db/src/schema, which no
-- longer declares the table, so regenerate it after applying this:
--   npm run pull -w @solar/db && node scripts/generate-test-baseline.mjs
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 059-drop-referrers.sql

BEGIN;

DROP TABLE IF EXISTS sv_referrers;

DROP FUNCTION IF EXISTS sv_referrers_set_updated_at();

COMMIT;
