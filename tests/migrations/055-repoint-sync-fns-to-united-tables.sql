-- Phase 7 slice: repoint the sv_sync_* 'us' arms at the united legacy tables.
--
-- 054 copied the US rows into businesses_1 / in_business_profiles / leaddata /
-- branches / projects under a country_code discriminator, with the IN column
-- renames applied (ein->gstn, county->district, zipcode->pincode/pin_code), and
-- generated US in_business_profiles rows. It deliberately left the sv_sync_*
-- functions branching on p_country so the copy could be verified first. It was,
-- on live 2026-08-05: 12 businesses / 4 leads / 1 branch / 0 projects copied,
-- zero id collisions, ids unchanged, unified counts unmoved at 6707 / 1220.
--
-- This migration collapses each function's two arms into one. Because 054 wrote
-- the US rows in the IN shape, the IN arm's SELECT is already correct for every
-- country -- the only thing that changes is the source predicate, which becomes
-- a country_code filter instead of a different table.
--
-- Verified on live before writing, for the 12 US businesses and 4 US leads:
--   leaddata.state, .qualification_score, .bill_* ........ all NULL
--   in_business_profiles.brands ......................... all NULL
-- so the IN-shaped SELECT projects exactly what the old US arm projected by
-- omitting those columns. The collapse is therefore value-preserving.
--
-- ONE INTENDED CHANGE IN THE PROJECTION. leaddata.reference_uuid defaults to
-- gen_random_uuid(), so the 4 US leads copied by 054 received one. The old 'us'
-- arm omitted reference_uuid, leaving unified leads.reference_uuid NULL for US;
-- the united arm carries it. After this migration those 4 rows flip NULL -> a
-- UUID. That is the correct end state -- reference_uuid is the platform-wide
-- lead identifier and US rows were only missing one because the write layer had
-- not caught up -- but it IS a value change, so it is called out rather than
-- discovered later.
--
-- p_country is unchanged in the signature, so no app code changes with this
-- migration. An unrecognised p_country now matches no rows instead of falling
-- through an IF with no ELSE: same no-op result.
--
-- The us_* tables are still not dropped. After this runs they have no reader in
-- the sync path, but main-app and the external admin-app may still read them
-- directly; dropping them is a later migration, once every reader is confirmed
-- off.
--
-- Run manually: psql $POSTGRES_URL_NON_POOLING < 055-repoint-sync-fns-to-united-tables.sql

BEGIN;

-- ------------------------------------------------------------- accounts ----
-- Both arms already read the same column set off a businesses table; only the
-- table differed. One table now, filtered by country.

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

-- ----------------------------------------------------------- businesses ----
-- Sources from in_business_profiles for every country now: 054 generated the US
-- profile rows, so sv_sync_business no longer needs a separate us_businesses
-- arm. The renamed columns (gstn/district/pincode) already hold the US values.

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
$function$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------- leads ----
-- The IN column set is the platform-wide set. For US rows state,
-- qualification_score and bill_* are NULL (verified on live), so those columns
-- project exactly as the old 'us' arm left them. reference_uuid is the one
-- deliberate change -- see the header.

CREATE OR REPLACE FUNCTION sv_sync_lead(p_country character, p_source_id integer)
RETURNS void AS $function$
BEGIN
  INSERT INTO leads (
    country_code, source_id, name, phone, email, postal_code, type, comment,
    urlparams, level1, level2, category, stage, status, claim_count,
    original_id, business_id, email_invite_count, sv_comment_for_businesses,
    svnotes, business_notes, marketing_consent, reference_uuid,
    qualification_score, bill_url, bill_cloudinary_public_id, bill_format,
    bill_uploaded_at, isvisible, created_at
  )
  SELECT
    l.country_code, l.id, l.name, l.phone, l.email, l.pin_code, l.type,
    l.comment, l.urlparams, l.state, l.district, l.category,
    l.stage, l.status, l.claim_count, l.original_id, l.business_id,
    l.email_invite_count, l.sv_comment_for_businesses, l.svnotes,
    l.business_notes, l.marketing_consent, l.reference_uuid,
    l.qualification_score, l.bill_url, l.bill_cloudinary_public_id,
    l.bill_format, l.bill_uploaded_at, l.isvisible, l.created_at
  FROM leaddata l
  WHERE l.id = p_source_id AND l.country_code = p_country
  ON CONFLICT (country_code, source_id) DO UPDATE SET
    name                      = EXCLUDED.name,
    phone                     = EXCLUDED.phone,
    email                     = EXCLUDED.email,
    postal_code               = EXCLUDED.postal_code,
    type                      = EXCLUDED.type,
    comment                   = EXCLUDED.comment,
    urlparams                 = EXCLUDED.urlparams,
    level1                    = EXCLUDED.level1,
    level2                    = EXCLUDED.level2,
    category                  = EXCLUDED.category,
    stage                     = EXCLUDED.stage,
    status                    = EXCLUDED.status,
    claim_count               = EXCLUDED.claim_count,
    original_id               = EXCLUDED.original_id,
    business_id               = EXCLUDED.business_id,
    email_invite_count        = EXCLUDED.email_invite_count,
    sv_comment_for_businesses = EXCLUDED.sv_comment_for_businesses,
    svnotes                   = EXCLUDED.svnotes,
    business_notes            = EXCLUDED.business_notes,
    marketing_consent         = EXCLUDED.marketing_consent,
    reference_uuid            = EXCLUDED.reference_uuid,
    qualification_score       = EXCLUDED.qualification_score,
    bill_url                  = EXCLUDED.bill_url,
    bill_cloudinary_public_id = EXCLUDED.bill_cloudinary_public_id,
    bill_format               = EXCLUDED.bill_format,
    bill_uploaded_at          = EXCLUDED.bill_uploaded_at,
    isvisible                 = EXCLUDED.isvisible,
    created_at                = EXCLUDED.created_at;
END;
$function$ LANGUAGE plpgsql;

COMMIT;

-- After this runs, resync the 12 US businesses and 4 US leads so the unified
-- projection reflects the united source. Counts must not move (6707 / 1220):
--
--   SELECT sv_sync_business('us', id), sv_sync_account('us', id)
--   FROM businesses_1 WHERE country_code = 'us';
--   SELECT sv_sync_lead('us', id) FROM leaddata WHERE country_code = 'us';
