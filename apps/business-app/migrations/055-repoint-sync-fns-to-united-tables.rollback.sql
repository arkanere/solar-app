-- Rollback for 055-repoint-sync-fns-to-united-tables.sql.
--
-- Restores sv_sync_account / _business / _lead to their pre-055 two-arm form,
-- reading us_businesses / us_leaddata for the 'us' arm. These bodies are the
-- verbatim pg_get_functiondef output taken from live on 2026-08-05, before 055
-- was written.
--
-- This is safe because 054 never dropped the us_* tables and nothing writes to
-- the united US rows yet -- the app's write path is still entirely IN-bound
-- (see next-steps.md, "the blocker E uncovered"). Once step A's app changes
-- land and US writes go to businesses_1/leaddata, rolling back to here would
-- strand those writes: the sync would resume reading us_*, which the app would
-- no longer be updating. Roll 055 back only while the app write path is still
-- IN-only.
--
-- Rolling this back does NOT restore leads.reference_uuid to NULL for the 4 US
-- rows; the old 'us' arm simply stops maintaining the column, leaving the value
-- 054 generated in place. Clear it by hand if that matters:
--   UPDATE leads SET reference_uuid = NULL WHERE country_code = 'us';
--
-- Run manually: psql $POSTGRES_URL_NON_POOLING < 055-...rollback.sql

BEGIN;

CREATE OR REPLACE FUNCTION sv_sync_account(p_country character, p_source_id integer)
RETURNS void AS $function$
BEGIN
  IF p_country = 'in' THEN
    INSERT INTO business_accounts (
      country_code, source_id, login_email, login_password, magic_link_token,
      magic_link_token_expires_at, reset_token, reset_token_expires,
      isvisible, last_login
    )
    SELECT
      'in', b.id, b.login_email, b.login_password, b.magic_link_token,
      b.magic_link_token_expires_at, b.reset_token, b.reset_token_expires,
      b.isvisible, b.last_login
    FROM businesses_1 b WHERE b.id = p_source_id
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
  ELSIF p_country = 'us' THEN
    INSERT INTO business_accounts (
      country_code, source_id, login_email, login_password, magic_link_token,
      magic_link_token_expires_at, reset_token, reset_token_expires,
      isvisible, last_login
    )
    SELECT
      'us', b.id, b.login_email, b.login_password, b.magic_link_token,
      b.magic_link_token_expires_at, b.reset_token, b.reset_token_expires,
      b.isvisible, b.last_login
    FROM us_businesses b WHERE b.id = p_source_id
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
  END IF;
END;
$function$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sv_sync_business(p_country character, p_source_id integer)
RETURNS void AS $function$
BEGIN
  IF p_country = 'in' THEN
    INSERT INTO businesses (
      country_code, source_id, slug, businessname, email, phonenumber, whatsapp,
      description, website, instagram_id, google_maps_link, address, pluscode,
      services, brands, tax_id, level1, level2, city, postal_code, rscore, tag,
      notes, businessfilled, tier3, isvisible
    )
    SELECT
      'in', p.business_id, p.slug, p.businessname, p.email,
      p.phonenumber, p.whatsapp, p.description, p.website,
      p.instagram_id, p.google_maps_link, p.address, p.pluscode,
      p.services, p.brands, p.gstn, p.state, p.district, p.city,
      p.pincode, p.rscore, p.tag, p.notes, p.businessfilled,
      p.tier3, p.isvisible
    FROM in_business_profiles p WHERE p.business_id = p_source_id
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
  ELSIF p_country = 'us' THEN
    INSERT INTO businesses (
      country_code, source_id, slug, businessname, email, phonenumber, whatsapp,
      description, website, instagram_id, google_maps_link, address, pluscode,
      services, brands, tax_id, level1, level2, city, postal_code, rscore, tag,
      notes, businessfilled, tier3, isvisible
    )
    SELECT
      'us', b.id, b.slug, b.businessname, b.email, b.phonenumber,
      b.whatsapp, b.description, b.website, b.instagram_id,
      b.google_maps_link, b.address, b.pluscode, b.services, NULL,
      b.ein, b.state, b.county, b.city, b.zipcode, b.rscore,
      b.tag, b.notes, b.businessfilled, b.tier3, b.isvisible
    FROM us_businesses b WHERE b.id = p_source_id
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
  END IF;
END;
$function$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sv_sync_lead(p_country character, p_source_id integer)
RETURNS void AS $function$
BEGIN
  IF p_country = 'in' THEN
    INSERT INTO leads (
      country_code, source_id, name, phone, email, postal_code, type, comment,
      urlparams, level1, level2, category, stage, status, claim_count,
      original_id, business_id, email_invite_count, sv_comment_for_businesses,
      svnotes, business_notes, marketing_consent, reference_uuid,
      qualification_score, bill_url, bill_cloudinary_public_id, bill_format,
      bill_uploaded_at, isvisible, created_at
    )
    SELECT
      'in', l.id, l.name, l.phone, l.email, l.pin_code, l.type,
      l.comment, l.urlparams, l.state, l.district, l.category,
      l.stage, l.status, l.claim_count, l.original_id, l.business_id,
      l.email_invite_count, l.sv_comment_for_businesses, l.svnotes,
      l.business_notes, l.marketing_consent, l.reference_uuid,
      l.qualification_score, l.bill_url, l.bill_cloudinary_public_id,
      l.bill_format, l.bill_uploaded_at, l.isvisible, l.created_at
    FROM leaddata l WHERE l.id = p_source_id
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
  ELSIF p_country = 'us' THEN
    INSERT INTO leads (
      country_code, source_id, name, phone, email, postal_code, type, comment,
      urlparams, level2, category, stage, status, claim_count, original_id,
      business_id, email_invite_count, sv_comment_for_businesses, svnotes,
      marketing_consent, isvisible, created_at
    )
    SELECT
      'us', l.id, l.name, l.phone, l.email, l.zipcode, l.type,
      l.comment, l.urlparams, l.county, l.category, l.stage,
      l.status, l.claim_count, l.original_id, l.business_id,
      l.email_invite_count, l.sv_comment_for_businesses, l.svnotes,
      l.marketing_consent, l.isvisible, l.created_at
    FROM us_leaddata l WHERE l.id = p_source_id
    ON CONFLICT (country_code, source_id) DO UPDATE SET
      name                      = EXCLUDED.name,
      phone                     = EXCLUDED.phone,
      email                     = EXCLUDED.email,
      postal_code               = EXCLUDED.postal_code,
      type                      = EXCLUDED.type,
      comment                   = EXCLUDED.comment,
      urlparams                 = EXCLUDED.urlparams,
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
      marketing_consent         = EXCLUDED.marketing_consent,
      isvisible                 = EXCLUDED.isvisible,
      created_at                = EXCLUDED.created_at;
  END IF;
END;
$function$ LANGUAGE plpgsql;

COMMIT;
