-- Business profile / account separation, phase 1 (India).
-- businesses_1 currently holds both login credentials and the public listing
-- profile. This migration creates business_profiles as the profile home;
-- businesses_1 stays untouched and remains the auth/account table plus the
-- legacy source for main-app and admin-app until they migrate.
--
-- A sync trigger mirrors every profile-column write on businesses_1 into
-- business_profiles, so admin-app edits, legacy main-app writes, and
-- deleteAccount's isvisible flip all propagate automatically. business-app
-- dual-writes the other direction (new table first, businesses_1 second)
-- until the other apps migrate. There is no trigger on business_profiles,
-- so the sync cannot loop.
--
-- Column types copied verbatim from live businesses_1 (verified 2026-07-10).
-- slug is intentionally NOT unique: live data has duplicate and NULL slugs
-- (e.g. 124 rows with slug 'incorrect'); lookups use an ordinary index.
-- The region column lets this one table also serve us_businesses later.
-- Run manually: psql $POSTGRES_URL < 039-business-profiles.sql

BEGIN;

CREATE TABLE IF NOT EXISTS business_profiles (
  id               SERIAL PRIMARY KEY,
  region           TEXT NOT NULL CHECK (region IN ('in', 'us')),
  business_id      INTEGER NOT NULL,  -- businesses_1.id (in) / us_businesses.id (us); no FK, table is polymorphic
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
  gstn             VARCHAR(50),
  state            VARCHAR(100),
  district         VARCHAR(100),
  city             VARCHAR(100),
  pincode          CHAR(6),
  rscore           INTEGER,
  tag              VARCHAR(255),
  notes            TEXT,
  businessfilled   BOOLEAN,
  tier3            BOOLEAN,
  isvisible        BOOLEAN,           -- listing visibility (mirrors businesses_1 during transition)
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (region, business_id)
);

CREATE INDEX IF NOT EXISTS business_profiles_slug_idx
  ON business_profiles (region, slug);

-- Backfill every India row, branches included (branch rows are listings too).
INSERT INTO business_profiles (
  region, business_id, slug, businessname, email, phonenumber, whatsapp,
  description, website, instagram_id, google_maps_link, address, pluscode,
  services, brands, gstn, state, district, city, pincode, rscore, tag, notes,
  businessfilled, tier3, isvisible
)
SELECT
  'in', b.id, b.slug, b.businessname, b.email, b.phonenumber, b.whatsapp,
  b.description, b.website, b.instagram_id, b.google_maps_link, b.address,
  b.pluscode, b.services, b.brands, b.gstn, b.state, b.district, b.city,
  b.pincode, b.rscore, b.tag, b.notes, b.businessfilled, b.tier3, b.isvisible
FROM businesses_1 b
ON CONFLICT (region, business_id) DO NOTHING;

-- Mirror profile-column writes on businesses_1 into business_profiles.
CREATE OR REPLACE FUNCTION sync_business_profile() RETURNS trigger AS $$
BEGIN
  INSERT INTO business_profiles (
    region, business_id, slug, businessname, email, phonenumber, whatsapp,
    description, website, instagram_id, google_maps_link, address, pluscode,
    services, brands, gstn, state, district, city, pincode, rscore, tag,
    notes, businessfilled, tier3, isvisible
  )
  VALUES (
    'in', NEW.id, NEW.slug, NEW.businessname, NEW.email, NEW.phonenumber,
    NEW.whatsapp, NEW.description, NEW.website, NEW.instagram_id,
    NEW.google_maps_link, NEW.address, NEW.pluscode, NEW.services, NEW.brands,
    NEW.gstn, NEW.state, NEW.district, NEW.city, NEW.pincode, NEW.rscore,
    NEW.tag, NEW.notes, NEW.businessfilled, NEW.tier3, NEW.isvisible
  )
  ON CONFLICT (region, business_id) DO UPDATE SET
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
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS businesses_1_profile_sync ON businesses_1;
CREATE TRIGGER businesses_1_profile_sync
AFTER INSERT OR UPDATE OF
  slug, businessname, email, phonenumber, whatsapp, description, website,
  instagram_id, google_maps_link, address, pluscode, services, brands, gstn,
  state, district, city, pincode, rscore, tag, notes, businessfilled, tier3,
  isvisible
ON businesses_1
FOR EACH ROW EXECUTE FUNCTION sync_business_profile();

COMMIT;
