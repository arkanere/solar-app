-- Phase 2.4 prep: extract the 039/040 businesses_1 -> split-table sync logic
-- (in_business_profiles / in_business_accounts) into plain SQL functions
-- callable by id, and turn the trigger functions into thin wrappers — the
-- same move 047 made for the unified-table triggers.
--
-- Why: business-app IN writes still target businesses_1 and depend on the
-- 039/040 triggers to keep the split tables fresh (admin-app reads them;
-- sv_sync_business('in') sources from in_business_profiles). Once business-app
-- calls sv_sync_in_split() explicitly after each businesses_1 write, the
-- 039/040 triggers can drop with the same playbook as 049. App call and
-- trigger run the same functions, so double execution is idempotent.
--
-- No copies, no schema changes; pure CREATE OR REPLACE. Idempotent.
-- Run manually: psql $POSTGRES_URL < 050-split-sync-functions.sql

BEGIN;

-- businesses_1 -> in_business_profiles (039's sync_business_profile body).
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

-- businesses_1 -> in_business_accounts (040's sync_business_account body).
CREATE OR REPLACE FUNCTION sv_sync_in_business_account(p_source_id INTEGER)
RETURNS void AS $$
BEGIN
  INSERT INTO in_business_accounts (
    business_id, login_email, login_password, magic_link_token,
    magic_link_token_expires_at, reset_token, reset_token_expires,
    isvisible, last_login
  )
  SELECT
    b.id, b.login_email, b.login_password, b.magic_link_token,
    b.magic_link_token_expires_at, b.reset_token, b.reset_token_expires,
    b.isvisible, b.last_login
  FROM businesses_1 b WHERE b.id = p_source_id
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
END;
$$ LANGUAGE plpgsql;

-- One call for app code: project a businesses_1 row into both split tables.
CREATE OR REPLACE FUNCTION sv_sync_in_split(p_source_id INTEGER)
RETURNS void AS $$
BEGIN
  PERFORM sv_sync_in_business_profile(p_source_id);
  PERFORM sv_sync_in_business_account(p_source_id);
END;
$$ LANGUAGE plpgsql;

-- Thin trigger wrappers (trigger definitions themselves are unchanged; the
-- 040 account trigger keeps its UPDATE OF column list).
CREATE OR REPLACE FUNCTION sync_business_profile() RETURNS trigger AS $$
BEGIN
  PERFORM sv_sync_in_business_profile(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sync_business_account() RETURNS trigger AS $$
BEGIN
  PERFORM sv_sync_in_business_account(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMIT;

-- Smoke check (values unchanged, updated_at bumps):
--   SELECT sv_sync_in_split((SELECT id FROM businesses_1 LIMIT 1));
