-- Drop the IN-only `locations` table (2026-08-09). Its US twin went with 056;
-- this one survived because that sweep only covered `us_*`. 042 copied its rows
-- into `geo_locations` two weeks earlier, and business-app's branch dropdowns
-- moved there with d418a08 / 0a8351a.
--
-- main-app was the last reader — four of them, ported in the commit that adds
-- this file: lib/server/queries.ts (getDistrictsWithInstallerCounts and
-- getTopDistricts), partners/+page.server.ts, partners/join/[district_slug] and
-- the district/[district_slug] redirect shim. All four now read geo_locations
-- filtered to country_code = 'in', and the two that matched a district by
-- LOWER(REPLACE(district,' ','-')) are exact `level2_slug` lookups, which the
-- geo_locations_level2_idx index serves.
--
-- DESTRUCTIVE and irreversible. Take a backup first:
--   pg_dump "$POSTGRES_URL_NON_POOLING" -t locations > locations-archive.sql
--
-- Verified on live before writing this migration:
--   - no inbound foreign keys, no views/matviews, no functions and no triggers
--     reference the table;
--   - `locations` (8,395 rows) is fully covered by geo_locations' 8,392 IN
--     rows. Both sides yield the same 784 distinct (state, district) pairs and
--     the same 784 distinct district slugs. The 3-row gap is the duplicate
--     groups 042's header predicted, and they are true duplicates — the same
--     city spelled with a space and with a hyphen, which sv_slugify collapses:
--       Madhya Pradesh / Narmadapuram  — "Seoni Malwa"   + "Seoni-Malwa"
--       Punjab         / Tarn Taran    — "Tarn Taran"    + "Tarn-Taran"
--       Rajasthan      / Neem Ka Thana — "Neem Ka Thana" + "Neem-Ka-Thana"
--     The only consequence is the partners page's "cities served" stat, which
--     goes 8046 -> 8043 because it counts DISTINCT city and those three pairs
--     collapse to one each. That is a correction, not a regression.
--
-- `locations_id_seq` is OWNED BY locations.id, so DROP TABLE takes it too. That
-- is safe now: 056 dropped us_locations, which was the only other table
-- defaulting from it, and geo_locations has its own geo_locations_id_seq.
--
-- 042 is replayed against the test baseline (scripts/apply-test-migrations.mjs)
-- and copies rows out of this table, so its IN arm gets the same
-- to_regclass(...) guard its US arm already carries — otherwise the baseline
-- stops creating `locations` and every test dies in global setup.
--
-- Confirm the external admin-app is off this table before running.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 058-drop-locations.sql

BEGIN;

DROP TABLE IF EXISTS locations;

COMMIT;
