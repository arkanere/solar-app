-- Country-scalable architecture, phase 4: lead sync triggers (old -> new).
--
-- Discovery after 044: main-app is NOT the only lead writer. The IN lead
-- forms on main-app post to user-app (user.solarvipani.com/in/api/submitLead),
-- which inserts into leaddata directly, and business-app updates pipeline
-- columns (stage, claim_count, svnotes, ...) on both old tables. App-level
-- dual-writes in main-app alone can therefore never keep the unified leads
-- table complete.
--
-- Instead, the same one-directional sync-trigger pattern as 043/039:
-- every INSERT or UPDATE on leaddata / us_leaddata upserts into leads keyed
-- by (country_code, source_id). All writers are covered automatically and
-- no old-table schema changes. main-app's unified submitLead writes the
-- old country table once and reads the trigger-synced leads row back in
-- the same transaction (triggers fire synchronously).
--
-- There is no trigger on leads itself, so the sync cannot loop. Remove
-- these triggers when the last writer has migrated to leads.
-- Run manually: psql $POSTGRES_URL < 045-leads-sync.sql

BEGIN;

CREATE OR REPLACE FUNCTION sync_unified_lead_in() RETURNS trigger AS $$
BEGIN
  INSERT INTO leads (
    country_code, source_id, name, phone, email, postal_code, type, comment,
    urlparams, level1, level2, category, stage, status, claim_count,
    original_id, business_id, email_invite_count, sv_comment_for_businesses,
    svnotes, business_notes, marketing_consent, reference_uuid,
    qualification_score, bill_url, bill_cloudinary_public_id, bill_format,
    bill_uploaded_at, isvisible, created_at
  )
  VALUES (
    'in', NEW.id, NEW.name, NEW.phone, NEW.email, NEW.pin_code, NEW.type,
    NEW.comment, NEW.urlparams, NEW.state, NEW.district, NEW.category,
    NEW.stage, NEW.status, NEW.claim_count, NEW.original_id, NEW.business_id,
    NEW.email_invite_count, NEW.sv_comment_for_businesses, NEW.svnotes,
    NEW.business_notes, NEW.marketing_consent, NEW.reference_uuid,
    NEW.qualification_score, NEW.bill_url, NEW.bill_cloudinary_public_id,
    NEW.bill_format, NEW.bill_uploaded_at, NEW.isvisible, NEW.created_at
  )
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
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leaddata_unified_sync ON leaddata;
CREATE TRIGGER leaddata_unified_sync
AFTER INSERT OR UPDATE ON leaddata
FOR EACH ROW EXECUTE FUNCTION sync_unified_lead_in();

CREATE OR REPLACE FUNCTION sync_unified_lead_us() RETURNS trigger AS $$
BEGIN
  INSERT INTO leads (
    country_code, source_id, name, phone, email, postal_code, type, comment,
    urlparams, level2, category, stage, status, claim_count, original_id,
    business_id, email_invite_count, sv_comment_for_businesses, svnotes,
    marketing_consent, isvisible, created_at
  )
  VALUES (
    'us', NEW.id, NEW.name, NEW.phone, NEW.email, NEW.zipcode, NEW.type,
    NEW.comment, NEW.urlparams, NEW.county, NEW.category, NEW.stage,
    NEW.status, NEW.claim_count, NEW.original_id, NEW.business_id,
    NEW.email_invite_count, NEW.sv_comment_for_businesses, NEW.svnotes,
    NEW.marketing_consent, NEW.isvisible, NEW.created_at
  )
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
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS us_leaddata_unified_sync ON us_leaddata;
CREATE TRIGGER us_leaddata_unified_sync
AFTER INSERT OR UPDATE ON us_leaddata
FOR EACH ROW EXECUTE FUNCTION sync_unified_lead_us();

COMMIT;
