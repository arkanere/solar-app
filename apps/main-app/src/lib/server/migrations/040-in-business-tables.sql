-- Business account / profile separation, phase 2 (India).
-- 1. business_profiles -> in_business_profiles: regions will never share
--    tables (IN and US differ structurally), so the table is renamed to the
--    in_* convention (in_user, in_referrers, ...) and the region column is
--    dropped. us gets its own tables when /us migrates.
-- 2. New in_business_accounts: the account-side counterpart. Holds only
--    credentials/auth state, mirrored 1:1 from businesses_1 by a sync
--    trigger. Column names match businesses_1 so reads are a drop-in switch.
--    business-app READS auth state from here; auth WRITES (token minting,
--    password reset, delete, admin-app operations) keep hitting businesses_1
--    and the trigger propagates them, so main-app/admin-app stay untouched.
-- Run manually: psql $POSTGRES_URL < 040-in-business-tables.sql

BEGIN;

-- 1. Rename the profile table and drop the region machinery.
ALTER TABLE business_profiles RENAME TO in_business_profiles;
ALTER TABLE in_business_profiles DROP COLUMN region CASCADE; -- drops the region check, UNIQUE(region,business_id), and the (region,slug) index
ALTER TABLE in_business_profiles ADD CONSTRAINT in_business_profiles_business_id_key UNIQUE (business_id);
CREATE INDEX IF NOT EXISTS in_business_profiles_slug_idx ON in_business_profiles (slug);

CREATE OR REPLACE FUNCTION sync_business_profile() RETURNS trigger AS $$
BEGIN
  INSERT INTO in_business_profiles (
    business_id, slug, businessname, email, phonenumber, whatsapp,
    description, website, instagram_id, google_maps_link, address, pluscode,
    services, brands, gstn, state, district, city, pincode, rscore, tag,
    notes, businessfilled, tier3, isvisible
  )
  VALUES (
    NEW.id, NEW.slug, NEW.businessname, NEW.email, NEW.phonenumber,
    NEW.whatsapp, NEW.description, NEW.website, NEW.instagram_id,
    NEW.google_maps_link, NEW.address, NEW.pluscode, NEW.services, NEW.brands,
    NEW.gstn, NEW.state, NEW.district, NEW.city, NEW.pincode, NEW.rscore,
    NEW.tag, NEW.notes, NEW.businessfilled, NEW.tier3, NEW.isvisible
  )
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
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Account table. isvisible mirrors businesses_1 because auth gates on it
--    today; renaming the flag would invite divergence during the transition.
CREATE TABLE IF NOT EXISTS in_business_accounts (
  id                          SERIAL PRIMARY KEY,
  business_id                 INTEGER NOT NULL UNIQUE, -- businesses_1.id
  login_email                 VARCHAR(255),
  login_password              VARCHAR(255),
  magic_link_token            TEXT,
  magic_link_token_expires_at TIMESTAMPTZ,
  reset_token                 VARCHAR(255),
  reset_token_expires         TIMESTAMP,
  isvisible                   BOOLEAN,
  last_login                  TIMESTAMP,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS in_business_accounts_login_email_idx
  ON in_business_accounts (login_email);
CREATE INDEX IF NOT EXISTS in_business_accounts_magic_token_idx
  ON in_business_accounts (magic_link_token);

INSERT INTO in_business_accounts (
  business_id, login_email, login_password, magic_link_token,
  magic_link_token_expires_at, reset_token, reset_token_expires,
  isvisible, last_login
)
SELECT
  b.id, b.login_email, b.login_password, b.magic_link_token,
  b.magic_link_token_expires_at, b.reset_token, b.reset_token_expires,
  b.isvisible, b.last_login
FROM businesses_1 b
ON CONFLICT (business_id) DO NOTHING;

CREATE OR REPLACE FUNCTION sync_business_account() RETURNS trigger AS $$
BEGIN
  INSERT INTO in_business_accounts (
    business_id, login_email, login_password, magic_link_token,
    magic_link_token_expires_at, reset_token, reset_token_expires,
    isvisible, last_login
  )
  VALUES (
    NEW.id, NEW.login_email, NEW.login_password, NEW.magic_link_token,
    NEW.magic_link_token_expires_at, NEW.reset_token, NEW.reset_token_expires,
    NEW.isvisible, NEW.last_login
  )
  ON CONFLICT (business_id) DO UPDATE SET
    login_email                 = EXCLUDED.login_email,
    login_password              = EXCLUDED.login_password,
    magic_link_token            = EXCLUDED.magic_link_token,
    magic_link_token_expires_at = EXCLUDED.magic_link_token_expires_at,
    reset_token                 = EXCLUDED.reset_token,
    reset_token_expires         = EXCLUDED.reset_token_expires,
    isvisible                   = EXCLUDED.isvisible,
    last_login                  = EXCLUDED.last_login,
    updated_at                  = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS businesses_1_account_sync ON businesses_1;
CREATE TRIGGER businesses_1_account_sync
AFTER INSERT OR UPDATE OF
  login_email, login_password, magic_link_token, magic_link_token_expires_at,
  reset_token, reset_token_expires, isvisible, last_login
ON businesses_1
FOR EACH ROW EXECUTE FUNCTION sync_business_account();

COMMIT;
