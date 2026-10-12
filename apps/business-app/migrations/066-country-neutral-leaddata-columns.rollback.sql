-- Rollback for 066-country-neutral-leaddata-columns.sql.
--
-- Safe to run at any point while `leads` still exists — 066 drops no data and
-- this reverses it exactly. Once 067 has run there is nothing to roll back to
-- and this file is meaningless: sv_sync_lead below would be recreated writing a
-- table that no longer exists.
--
-- Revert the code in the same deploy. Code that reads leaddata.level2 fails
-- against a column named district again, the same way it would have before 066.
--
-- Two statements can fail, and both fail LOUDLY rather than silently rounding:
--
--   postal_code -> varchar(6). Errors with "value too long" if anything has
--   grown past 6 since 066 — a real US ZIP+4, which is why it was widened.
--   That is correct: decide what those rows should hold. Find them first with
--     SELECT id, country_code, postal_code FROM leaddata WHERE length(postal_code) > 6;
--
--   business_id / original_id -> smallint. Errors with "smallint out of range"
--   if any value has passed 32767 since 066. If that has happened, the widening
--   is load-bearing and this rollback must not be run — revert the code and
--   leave the columns integer, which no pre-066 code can tell apart.
--     SELECT id, business_id, original_id FROM leaddata
--      WHERE business_id > 32767 OR original_id > 32767;
--
-- created_at goes back to naive UTC, which is exactly what it held before 066
-- (the database's TimeZone is GMT). No value moves.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 066-country-neutral-leaddata-columns.rollback.sql

BEGIN;

DROP INDEX leaddata_country_created_idx;
CREATE INDEX leaddata_country_idx ON leaddata USING btree (country_code);

ALTER TABLE leaddata DROP CONSTRAINT leaddata_country_code_fkey;

ALTER TABLE leaddata ALTER COLUMN email_invite_count TYPE smallint;
ALTER TABLE leaddata ALTER COLUMN original_id        TYPE smallint;
ALTER TABLE leaddata ALTER COLUMN business_id        TYPE smallint;

ALTER TABLE leaddata
  ALTER COLUMN created_at TYPE timestamp USING created_at AT TIME ZONE 'UTC';

ALTER TABLE leaddata ALTER COLUMN postal_code TYPE varchar(6);

ALTER TABLE leaddata RENAME COLUMN postal_code TO pin_code;
ALTER TABLE leaddata RENAME COLUMN level2      TO district;
ALTER TABLE leaddata RENAME COLUMN level1      TO state;

-- sv_sync_lead back onto the old source names — 055's body verbatim.
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
