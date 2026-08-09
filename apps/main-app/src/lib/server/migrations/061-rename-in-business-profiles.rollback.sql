-- Rollback for 061: business_profiles -> in_business_profiles.
--
-- Reverses the rename and puts the three function bodies back on the old name.
-- The bodies below are 054's (sv_sync_in_split), 055's (sv_sync_business) and
-- 050's (sv_sync_in_business_profile) verbatim, which is what they were before
-- 061 touched them.
--
-- The code side does not roll back with this: the drizzle export and its 28
-- call sites move to `businessProfiles` in the same commit as 061, so reverting
-- the database alone leaves the apps pointing at a table that no longer exists.
-- Revert the commit too.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 061-rename-in-business-profiles.rollback.sql

BEGIN;

ALTER TABLE business_profiles RENAME TO in_business_profiles;

ALTER INDEX business_profiles_slug_idx RENAME TO in_business_profiles_slug_idx;
ALTER INDEX business_profiles_country_idx RENAME TO in_business_profiles_country_idx;
ALTER TABLE in_business_profiles
  RENAME CONSTRAINT business_profiles_business_id_key TO in_business_profiles_business_id_key;

CREATE OR REPLACE FUNCTION sv_sync_in_split(p_source_id INTEGER)
RETURNS void AS $$
BEGIN
  INSERT INTO in_business_profiles (
    business_id, country_code, slug, businessname, email, phonenumber, whatsapp,
    description, website, instagram_id, google_maps_link, address, pluscode,
    services, brands, gstn, state, district, city, pincode, rscore, tag, notes,
    businessfilled, tier3, isvisible, created_at
  )
  SELECT
    b.id, b.country_code, b.slug, b.businessname, b.email, b.phonenumber,
    b.whatsapp, b.description, b.website, b.instagram_id, b.google_maps_link,
    b.address, b.pluscode, b.services, b.brands, b.gstn, b.state, b.district,
    b.city, b.pincode, b.rscore, b.tag, b.notes, b.businessfilled, b.tier3,
    b.isvisible, b.created_at
  FROM businesses_1 b WHERE b.id = p_source_id
  ON CONFLICT (business_id) DO UPDATE SET
    country_code     = EXCLUDED.country_code,
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

CREATE OR REPLACE FUNCTION sv_sync_business(p_country CHARACTER, p_source_id INTEGER)
RETURNS void AS $$
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
  FROM in_business_profiles p
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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sv_sync_in_business_profile(p_source_id INTEGER)
RETURNS void AS $$
BEGIN
  INSERT INTO in_business_profiles (
    business_id, slug, businessname, email, phonenumber, whatsapp,
    description, website, instagram_id, google_maps_link, address, pluscode,
    services, brands, gstn, state, district, city, pincode, rscore, tag,
    notes, businessfilled, tier3, isvisible
  )
  SELECT
    b.id, b.slug, b.businessname, b.email, b.phonenumber,
    b.whatsapp, b.description, b.website, b.instagram_id,
    b.google_maps_link, b.address, b.pluscode, b.services, b.brands,
    b.gstn, b.state, b.district, b.city, b.pincode, b.rscore,
    b.tag, b.notes, b.businessfilled, b.tier3, b.isvisible
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
    isvisible        = EXCLUDED.isvisible,
    updated_at       = NOW();
END;
$$ LANGUAGE plpgsql;

COMMIT;
