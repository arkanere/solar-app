-- Country-scalable architecture, phase 2: unified businesses table.
--
-- One profile table for all countries, keyed by (country_code, source_id)
-- where source_id is businesses_1.id (in) / us_businesses.id (us). Profile
-- only — no login/auth columns; auth stays in in_business_accounts /
-- us_businesses until business-app migrates. Geography is generic:
-- level1 = state, level2 = district (IN) / county (US); tax_id = gstn (IN) /
-- ein (US); postal_code = pincode (IN) / zipcode (US).
--
-- Old tables are NOT touched. business-app and admin-app keep writing
-- businesses_1 / us_businesses; one-directional sync triggers (old -> new)
-- keep this table current, mirroring the 039 sync_business_profile pattern:
-- IN syncs from in_business_profiles (itself trigger-fed from businesses_1,
-- so the chain is businesses_1 -> in_business_profiles -> businesses), US
-- syncs from us_businesses directly. main-app phase 1 only READS this
-- table, so no write-back is needed and the sync cannot loop.
--
-- Column types verified against live us_businesses 2026-07-18 (32 columns;
-- copy projects out the 8 auth/login columns). IN copy uses
-- in_business_profiles — already the clean profile projection.
-- Following 039's precedent, slug is NOT unique (live data has duplicate
-- and NULL slugs, e.g. 124 rows 'incorrect'); lookups use an ordinary
-- index and filter on isvisible.
-- Run manually: psql $POSTGRES_URL < 043-businesses.sql

BEGIN;

CREATE TABLE IF NOT EXISTS businesses (
  id               SERIAL PRIMARY KEY,
  country_code     CHAR(2) NOT NULL REFERENCES countries(code),
  source_id        INTEGER NOT NULL,  -- businesses_1.id (in) / us_businesses.id (us)
  slug             VARCHAR(255),
  businessname     VARCHAR(255),
  email            VARCHAR(255),      -- public contact email, NOT login_email
  phonenumber      VARCHAR(20),
  whatsapp         VARCHAR(20),
  description      VARCHAR(256),
  website          VARCHAR(255),
  instagram_id     VARCHAR(255),
  google_maps_link VARCHAR(255),
  address          TEXT,
  pluscode         VARCHAR(255),
  services         INTEGER[],
  brands           INTEGER[],
  tax_id           VARCHAR(50),       -- gstn (IN) / ein (US)
  level1           VARCHAR(100),      -- state
  level2           VARCHAR(100),      -- district (IN) / county (US)
  city             VARCHAR(100),
  postal_code      VARCHAR(10),       -- pincode (IN) / zipcode (US)
  rscore           INTEGER,
  tag              VARCHAR(255),
  notes            TEXT,
  businessfilled   BOOLEAN,
  tier3            BOOLEAN,
  isvisible        BOOLEAN,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (country_code, source_id)
);

CREATE INDEX IF NOT EXISTS businesses_slug_idx
  ON businesses (country_code, slug);
CREATE INDEX IF NOT EXISTS businesses_geo_idx
  ON businesses (country_code, level2, isvisible);

-- Backfill India from the profile projection.
INSERT INTO businesses (
  country_code, source_id, slug, businessname, email, phonenumber, whatsapp,
  description, website, instagram_id, google_maps_link, address, pluscode,
  services, brands, tax_id, level1, level2, city, postal_code, rscore, tag,
  notes, businessfilled, tier3, isvisible
)
SELECT
  'in', p.business_id, p.slug, p.businessname, p.email, p.phonenumber,
  p.whatsapp, p.description, p.website, p.instagram_id, p.google_maps_link,
  p.address, p.pluscode, p.services, p.brands, p.gstn, p.state, p.district,
  p.city, p.pincode, p.rscore, p.tag, p.notes, p.businessfilled, p.tier3,
  p.isvisible
FROM in_business_profiles p
ON CONFLICT (country_code, source_id) DO NOTHING;

-- Backfill US, projecting out the auth/login columns.
INSERT INTO businesses (
  country_code, source_id, slug, businessname, email, phonenumber, whatsapp,
  description, website, instagram_id, google_maps_link, address, pluscode,
  services, brands, tax_id, level1, level2, city, postal_code, rscore, tag,
  notes, businessfilled, tier3, isvisible
)
SELECT
  'us', u.id, u.slug, u.businessname, u.email, u.phonenumber, u.whatsapp,
  u.description, u.website, u.instagram_id, u.google_maps_link, u.address,
  u.pluscode, u.services, NULL, u.ein, u.state, u.county, u.city, u.zipcode,
  u.rscore, u.tag, u.notes, u.businessfilled, u.tier3, u.isvisible
FROM us_businesses u
ON CONFLICT (country_code, source_id) DO NOTHING;

-- Sync trigger: in_business_profiles -> businesses.
CREATE OR REPLACE FUNCTION sync_unified_business_in() RETURNS trigger AS $$
BEGIN
  INSERT INTO businesses (
    country_code, source_id, slug, businessname, email, phonenumber, whatsapp,
    description, website, instagram_id, google_maps_link, address, pluscode,
    services, brands, tax_id, level1, level2, city, postal_code, rscore, tag,
    notes, businessfilled, tier3, isvisible
  )
  VALUES (
    'in', NEW.business_id, NEW.slug, NEW.businessname, NEW.email,
    NEW.phonenumber, NEW.whatsapp, NEW.description, NEW.website,
    NEW.instagram_id, NEW.google_maps_link, NEW.address, NEW.pluscode,
    NEW.services, NEW.brands, NEW.gstn, NEW.state, NEW.district, NEW.city,
    NEW.pincode, NEW.rscore, NEW.tag, NEW.notes, NEW.businessfilled,
    NEW.tier3, NEW.isvisible
  )
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
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS in_business_profiles_unified_sync ON in_business_profiles;
CREATE TRIGGER in_business_profiles_unified_sync
AFTER INSERT OR UPDATE ON in_business_profiles
FOR EACH ROW EXECUTE FUNCTION sync_unified_business_in();

-- Sync trigger: us_businesses -> businesses (profile columns only).
CREATE OR REPLACE FUNCTION sync_unified_business_us() RETURNS trigger AS $$
BEGIN
  INSERT INTO businesses (
    country_code, source_id, slug, businessname, email, phonenumber, whatsapp,
    description, website, instagram_id, google_maps_link, address, pluscode,
    services, brands, tax_id, level1, level2, city, postal_code, rscore, tag,
    notes, businessfilled, tier3, isvisible
  )
  VALUES (
    'us', NEW.id, NEW.slug, NEW.businessname, NEW.email, NEW.phonenumber,
    NEW.whatsapp, NEW.description, NEW.website, NEW.instagram_id,
    NEW.google_maps_link, NEW.address, NEW.pluscode, NEW.services, NULL,
    NEW.ein, NEW.state, NEW.county, NEW.city, NEW.zipcode, NEW.rscore,
    NEW.tag, NEW.notes, NEW.businessfilled, NEW.tier3, NEW.isvisible
  )
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
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS us_businesses_unified_sync ON us_businesses;
CREATE TRIGGER us_businesses_unified_sync
AFTER INSERT OR UPDATE OF
  slug, businessname, email, phonenumber, whatsapp, description, website,
  instagram_id, google_maps_link, address, pluscode, services, ein, state,
  county, city, zipcode, rscore, tag, notes, businessfilled, tier3, isvisible
ON us_businesses
FOR EACH ROW EXECUTE FUNCTION sync_unified_business_us();

COMMIT;

-- Post-copy check (expected: in = count(in_business_profiles),
-- us = count(us_businesses)):
-- SELECT country_code, count(*) FROM businesses GROUP BY country_code;
