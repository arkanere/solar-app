-- Drop the six legacy us_* tables (2026-08-09). Since 054 united the legacy
-- tables and 055 repointed the sync functions, the US half of every read and
-- write goes through businesses_1/leaddata and the unified projections; 694faea
-- shipped the app side, so code and DB have agreed for both countries since.
-- 760f868 removed the last three source references (business-listing's
-- us_businesses read, TokenManager's us_branches read, and the dead
-- US_LEAD_RETURNING export).
--
-- DESTRUCTIVE and irreversible. Take a backup first:
--   pg_dump "$POSTGRES_URL_NON_POOLING" \
--     -t us_businesses -t us_leaddata -t us_branches \
--     -t us_projects -t us_leaddata_claimrequests -t us_locations \
--     > us-tables-archive.sql
--
-- Verified on live before writing this migration:
--   - no inbound foreign keys, no views/matviews, no functions, no triggers
--     reference any of these tables;
--   - us_businesses (12 rows) matches unified businesses country_code='us'
--     field-for-field on every column business-listing selects;
--   - us_leaddata (4 rows) is present in leaddata and leads, 4/4;
--   - us_branches (1 row: main 6748 -> branch 6794) is already in branches;
--   - us_locations (31,314 rows) is fully covered by geo_locations: 31,253
--     distinct (state, county, city) triples, zero unmatched. The 61-row gap is
--     duplicates that geo_locations' UNIQUE constraint collapses;
--   - us_projects and us_leaddata_claimrequests are empty.
--
-- us_locations defaults its id from locations_id_seq, which is OWNED BY
-- locations.id, so dropping this table does not take the sequence with it and
-- the IN `locations` table is unaffected.
--
-- The external admin-app was confirmed off these tables before running.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 056-drop-us-tables.sql

BEGIN;

DROP TABLE IF EXISTS us_leaddata_claimrequests;
DROP TABLE IF EXISTS us_projects;
DROP TABLE IF EXISTS us_locations;
DROP TABLE IF EXISTS us_leaddata;
DROP TABLE IF EXISTS us_branches;
DROP TABLE IF EXISTS us_businesses;

COMMIT;
