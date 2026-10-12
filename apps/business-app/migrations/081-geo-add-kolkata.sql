-- Add the Kolkata district to geo_locations (2026-09-08).
--
-- ** APPLIED to live 2026-09-08. ** BEGIN, INSERT 0 1, COMMIT. Verified after:
-- one row (West Bengal | Kolkata | Kolkata | west-bengal | kolkata | kolkata),
-- West Bengal 22 -> 23 districts, IN rows 8392 -> 8393 — the three counts this
-- file predicted. The masterlist sync's dry run then went 27 unresolved -> 0.
--
-- geo_locations has 784 Indian districts and Kolkata is not one of them. It is
-- the ONLY district of pincode_mapping's 736 that is missing, and it carries 73
-- pincodes — the largest such gap by a distance, not an edge case. West Bengal
-- has 23 districts; the table holds 22.
--
-- The hole is inherited, not introduced: 042 copied geo_locations out of the old
-- `locations` table (8,395 IN rows), so Kolkata was already absent there, and 058
-- dropped `locations` before anyone noticed.
--
-- Found while reconciling the PM Surya Ghar masterlist against the app's district
-- vocabulary (automation-scripts/sync_masterlist_empanelled). That pass resolves
-- 27,712 of 27,739 empanelled vendors to a canonical district; the 27 it cannot
-- resolve are all in Kolkata, and no amount of spelling normalisation fixes a
-- district that is not in the table. See
-- admin-app-internal/admin-app-nextjs/spec/02-decisions/0008-district-reconciliation.md.
--
-- ** One row, because Kolkata district is coextensive with the city. ** That is
-- the existing convention for a metropolitan district, not an invention here:
--
--   Maharashtra | Mumbai     | Mumbai     | maharashtra | mumbai     | mumbai
--   Chandigarh  | Chandigarh | Chandigarh | chandigarh  | chandigarh | chandigarh
--
-- Nine Indian districts already have exactly one city row. Slugs come from
-- sv_slugify (042), so they are byte-identical to what the sitemap would have
-- generated: 'west-bengal' / 'kolkata' / 'kolkata'.
--
-- ** This creates a public page. ** geo_locations drives /in/solar/{state}/{city}
-- and the installer directory, so /in/solar/west-bengal/kolkata starts resolving
-- and enters the sitemap on the next build. That is the intended outcome — the
-- page was missing for the same reason the district was.
--
-- Reversible: DELETE the row. Nothing references geo_locations by id.
--
-- Run manually: psql $POSTGRES_URL < 081-geo-add-kolkata.sql

BEGIN;

INSERT INTO geo_locations (country_code, level1, level2, city,
                           level1_slug, level2_slug, city_slug)
SELECT 'in', 'West Bengal', 'Kolkata', 'Kolkata',
       sv_slugify('West Bengal'), sv_slugify('Kolkata'), sv_slugify('Kolkata')
ON CONFLICT (country_code, level1_slug, level2_slug, city_slug) DO NOTHING;

COMMIT;

-- Verify after:
--
--   SELECT level1, level2, city, level1_slug, level2_slug, city_slug
--     FROM geo_locations WHERE country_code = 'in' AND level2 = 'Kolkata';
--   -- expect exactly 1 row: West Bengal | Kolkata | Kolkata | west-bengal | kolkata | kolkata
--
--   SELECT count(DISTINCT level2) FROM geo_locations
--    WHERE country_code = 'in' AND level1 = 'West Bengal';
--   -- expect 23, was 22
--
--   SELECT count(*) FROM geo_locations WHERE country_code = 'in';
--   -- expect 8393, was 8392
--
-- Then re-run the masterlist sync's dry run; its `still_unresolved` count should
-- fall from 27 to 0, and district_aliases.csv's Kolkata row (checked in unmapped,
-- with a note) can be deleted:
--
--   python3 automation-scripts/sync_masterlist_empanelled/sync_masterlist.py
