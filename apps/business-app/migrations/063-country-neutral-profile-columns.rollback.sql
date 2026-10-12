-- Rollback for 063-country-neutral-profile-columns.sql.
--
-- Safe to run at any point while `businesses` still exists — 063 drops no data
-- and this reverses it exactly. Unlike 062's rollback there is no ordering trap:
-- the projection is live in both directions and neither vocabulary is stale.
--
-- Revert the code in the same deploy. Code that reads business_profiles.level2
-- fails against a column named district again, the same way it would have
-- before 063.
--
-- The one thing that can fail here is the postal_code narrowing, and it fails
-- LOUDLY rather than truncating: if any value has grown past 6 characters since
-- 063 — a real US ZIP+4, which is the whole reason the column was widened —
-- `TYPE char(6)` errors with "value too long". That is the correct behaviour;
-- decide what those rows should hold rather than letting the cast round them
-- off. To find them first:
--
--   SELECT business_id, country_code, postal_code
--     FROM business_profiles WHERE length(postal_code) > 6;
--
-- Note char(6) re-pads on the way back, so values shorter than 6 regain their
-- trailing blanks. That is the pre-063 state, not a new defect.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 063-country-neutral-profile-columns.rollback.sql

BEGIN;

ALTER TABLE business_profiles
  ALTER COLUMN postal_code TYPE char(6);

ALTER TABLE business_profiles RENAME COLUMN tax_id      TO gstn;
ALTER TABLE business_profiles RENAME COLUMN level1      TO state;
ALTER TABLE business_profiles RENAME COLUMN level2      TO district;
ALTER TABLE business_profiles RENAME COLUMN postal_code TO pincode;

DROP INDEX IF EXISTS business_profiles_geo_idx;
DROP INDEX IF EXISTS business_profiles_country_slug_idx;

CREATE INDEX IF NOT EXISTS business_profiles_country_idx
  ON business_profiles USING btree (country_code);

CREATE INDEX IF NOT EXISTS business_profiles_slug_idx
  ON business_profiles USING btree (slug);

ALTER TABLE business_profiles
  DROP CONSTRAINT IF EXISTS business_profiles_country_code_fkey;

-- sv_sync_business back onto the old source column names. Target columns in
-- `businesses` never moved.

CREATE OR REPLACE FUNCTION sv_sync_business(p_country character, p_source_id integer)
RETURNS void AS $function$
BEGIN
  INSERT INTO businesses (
    country_code, source_id, slug, businessname, email, phonenumber, whatsapp,
    description, website, instagram_id, google_maps_link, address, pluscode,
    services, brands, tax_id, level1, level2, city, postal_code, rscore, tag,
    notes, businessfilled, tier3, isvisible
  )
  SELECT
    p.country_code, p.business_id, p.slug, p.businessname, p.email,
    p.phonenumber, p.whatsapp, p.description, p.website,
    p.instagram_id, p.google_maps_link, p.address, p.pluscode,
    p.services, p.brands, p.gstn, p.state, p.district, p.city,
    p.pincode, p.rscore, p.tag, p.notes, p.businessfilled,
    p.tier3, p.isvisible
  FROM business_profiles p
  WHERE p.business_id = p_source_id AND p.country_code = p_country
  ON CONFLICT (country_code, source_id) DO UPDATE SET
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
    tax_id           = EXCLUDED.tax_id,
    level1           = EXCLUDED.level1,
    level2           = EXCLUDED.level2,
    city             = EXCLUDED.city,
    postal_code      = EXCLUDED.postal_code,
    rscore           = EXCLUDED.rscore,
    tag              = EXCLUDED.tag,
    notes            = EXCLUDED.notes,
    businessfilled   = EXCLUDED.businessfilled,
    tier3            = EXCLUDED.tier3,
    isvisible        = EXCLUDED.isvisible,
    updated_at       = NOW();
END;
$function$ LANGUAGE plpgsql;

COMMIT;
