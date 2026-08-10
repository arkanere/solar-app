-- Rollback for 062-archive-businesses-1.sql.
--
-- ** REVERT THE CODE FIRST, THEN RUN THIS. ** The order is not cosmetic. Once
-- 062's code changes are deployed, auth writes land in business_accounts and
-- businesses_1_archive stops receiving them. Recreating sv_sync_account and
-- running it forward would then project the archive's stale credentials over
-- the live ones — silently expiring every magic link and reset token minted
-- since the cutover, and reverting any password changed in that window.
--
-- So: deploy the reverted code, confirm no writer is touching business_accounts
-- directly any more, and only then run this file. If the archive has already
-- been dropped after its quiet period, this rollback is not available at all —
-- restore from the pg_dump 062's header asks for.
--
-- What this does NOT restore: rows written to business_profiles or
-- business_accounts through the new direct-write path while 062 was live. Those
-- rows are real and correct; they simply have no businesses_1_archive
-- counterpart, so the archive is missing every business signed up in the
-- window. Backfill it from the split tables before relying on it as a source:
--
--   INSERT INTO businesses_1 (id, country_code, businessname, login_email, ...)
--   SELECT p.business_id, p.country_code, p.businessname, a.login_email, ...
--   FROM business_profiles p
--   JOIN business_accounts a
--     ON a.country_code = p.country_code AND a.source_id = p.business_id
--   WHERE NOT EXISTS (SELECT 1 FROM businesses_1 b WHERE b.id = p.business_id);
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 062-archive-businesses-1.rollback.sql

BEGIN;

ALTER TABLE businesses_1_archive RENAME TO businesses_1;

-- Hand the sequence back. business_profiles.business_id loses its default, which
-- is what forces the minting sites back onto businesses_1's serial.

ALTER TABLE business_profiles ALTER COLUMN business_id DROP DEFAULT;

ALTER SEQUENCE businesses_1_id_seq OWNED BY businesses_1.id;

-- The sequence may have advanced past businesses_1's max id while 062 was live
-- (every signup in the window drew from it). That is harmless — ids stay unique
-- either way — and it must NOT be reset backwards, or the next businesses_1
-- insert collides with a business_profiles row written in the window.

-- ------------------------------------------------------- the projections ----
-- Bodies restored verbatim from live as they stood before 062 (050 as rewritten
-- by 054 for the split functions, 055 for the account one).

CREATE OR REPLACE FUNCTION sv_sync_account(p_country character, p_source_id integer)
RETURNS void AS $function$
BEGIN
  INSERT INTO business_accounts (
    country_code, source_id, login_email, login_password, magic_link_token,
    magic_link_token_expires_at, reset_token, reset_token_expires,
    isvisible, last_login
  )
  SELECT
    b.country_code, b.id, b.login_email, b.login_password, b.magic_link_token,
    b.magic_link_token_expires_at, b.reset_token, b.reset_token_expires,
    b.isvisible, b.last_login
  FROM businesses_1 b
  WHERE b.id = p_source_id AND b.country_code = p_country
  ON CONFLICT (country_code, source_id) DO UPDATE SET
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
$function$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sv_sync_in_split(p_source_id integer)
RETURNS void AS $function$
BEGIN
  INSERT INTO business_profiles (
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
$function$ LANGUAGE plpgsql;

-- Restored for fidelity with the pre-062 database, though it has been an orphan
-- since 054 inlined the profile upsert into sv_sync_in_split — nothing in the
-- database or in any app calls it (next-steps.md item 5).

CREATE OR REPLACE FUNCTION sv_sync_in_business_profile(p_source_id integer)
RETURNS void AS $function$
BEGIN
  INSERT INTO business_profiles (
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
$function$ LANGUAGE plpgsql;

-- sync_unified_account_in/us are NOT recreated. 062 dropped them because their
-- bodies call sv_sync_account, but their triggers went with 051 and nothing has
-- been able to reach them since. Restoring dead code would only re-hide them.

COMMIT;
