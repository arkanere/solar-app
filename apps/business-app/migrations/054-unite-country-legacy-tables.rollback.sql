-- Rollback for 054-unite-country-legacy-tables.sql.
--
-- 054 is additive: it copies the US rows into the IN legacy tables and adds a
-- country_code discriminator, but does not drop us_* and does not repoint the
-- sv_sync_* 'us' arms (that is 055). So undoing it is just removing the copied
-- rows and the new columns -- the us_* tables are still the source of truth and
-- have not been touched.
--
-- Safe to run only while 055 has NOT been applied. Once the sync functions read
-- the united tables, deleting the country_code = 'us' rows would empty the US
-- side of the unified projection.
--
-- Run manually: psql $POSTGRES_URL_NON_POOLING < 054-...rollback.sql

BEGIN;

-- Restore sv_sync_in_split to its pre-054 form: no country_code column, so it
-- neither reads nor writes one.
CREATE OR REPLACE FUNCTION sv_sync_in_split(p_source_id INTEGER)
RETURNS void AS $$
BEGIN
  INSERT INTO in_business_profiles (
    business_id, slug, businessname, email, phonenumber, whatsapp,
    description, website, instagram_id, google_maps_link, address, pluscode,
    services, brands, gstn, state, district, city, pincode, rscore, tag, notes,
    businessfilled, tier3, isvisible, created_at
  )
  SELECT
    b.id, b.slug, b.businessname, b.email, b.phonenumber, b.whatsapp,
    b.description, b.website, b.instagram_id, b.google_maps_link, b.address,
    b.pluscode, b.services, b.brands, b.gstn, b.state, b.district, b.city,
    b.pincode, b.rscore, b.tag, b.notes, b.businessfilled, b.tier3,
    b.isvisible, b.created_at
  FROM businesses_1 b WHERE b.id = p_source_id
  ON CONFLICT (business_id) DO UPDATE SET
    slug             = EXCLUDED.slug,
    businessname     = EXCLUDED.businessname,
    email            = EXCLUDED.email,
    phonenumber      = EXCLUDED.phonenumber,
    whatsapp         = EXCLUDED.whatsapp,
    description      = EXCLUDED.description,
    website          = EXCLUDED.website,
    instagram_id     = EXCLUDED.instagram_id,
    google_maps_link = EXCLUDED.google_maps_link,
    address          = EXCLUDED.address,
    pluscode         = EXCLUDED.pluscode,
    services         = EXCLUDED.services,
    brands           = EXCLUDED.brands,
    gstn             = EXCLUDED.gstn,
    state            = EXCLUDED.state,
    district         = EXCLUDED.district,
    city             = EXCLUDED.city,
    pincode          = EXCLUDED.pincode,
    rscore           = EXCLUDED.rscore,
    tag              = EXCLUDED.tag,
    notes            = EXCLUDED.notes,
    businessfilled   = EXCLUDED.businessfilled,
    tier3            = EXCLUDED.tier3,
    isvisible        = EXCLUDED.isvisible;
END;
$$ LANGUAGE plpgsql;

-- Remove the copied rows. Keyed on country_code where the table has one, and
-- on membership of the us_* source table where it does not -- which is why 054
-- leaves us_* in place.
DELETE FROM in_business_profiles WHERE country_code = 'us';
DELETE FROM leaddata            WHERE country_code = 'us';
DELETE FROM businesses_1        WHERE country_code = 'us';
DELETE FROM branches WHERE id IN (SELECT id FROM us_branches);
DELETE FROM projects WHERE id IN (SELECT id FROM us_projects);

DROP INDEX IF EXISTS businesses_1_country_slug_idx;
DROP INDEX IF EXISTS leaddata_country_idx;
DROP INDEX IF EXISTS in_business_profiles_country_idx;

ALTER TABLE businesses_1         DROP COLUMN IF EXISTS country_code;
ALTER TABLE in_business_profiles DROP COLUMN IF EXISTS country_code;
ALTER TABLE leaddata             DROP COLUMN IF EXISTS country_code;

COMMIT;
