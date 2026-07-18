-- Country-scalable architecture, phase 3: unified leads table.
--
-- One table for all countries, superset of leaddata (IN) and us_leaddata
-- (US) so the later business-app migration is a drop-in read switch.
-- Geography is generic: level1 = state (IN only today), level2 =
-- district (IN) / county (US); postal_code = pin_code (IN) / zipcode (US).
-- IN-only columns (reference_uuid, business_notes, qualification_score,
-- bill_*) are nullable and simply unused for other countries.
--
-- Old tables are NOT touched. Coexistence: main-app's unified submitLead
-- endpoint dual-inserts (this table first, then the old country table in
-- the same transaction) so business-app keeps seeing new leads in
-- leaddata / us_leaddata until it migrates. Pipeline edits business-app
-- makes on old rows (stage, claim_count, svnotes, ...) do NOT flow back
-- here — main-app never reads lead pipeline state, and this table's
-- pipeline columns become authoritative only at business-app cutover
-- (re-copy at that point).
--
-- Column types verified against live leaddata / us_leaddata 2026-07-18
-- (1144 + 3 rows). Both old tables share leaddata_id_seq, so source_id is
-- globally unique, but the key stays (country_code, source_id) for safety.
-- Run manually: psql $POSTGRES_URL < 044-leads.sql

BEGIN;

CREATE TABLE IF NOT EXISTS leads (
  id                        SERIAL PRIMARY KEY,
  country_code              CHAR(2) NOT NULL REFERENCES countries(code),
  source_id                 INTEGER,           -- leaddata.id / us_leaddata.id; NULL never expected (dual-insert records it)
  name                      VARCHAR(255) NOT NULL,
  phone                     VARCHAR(16) NOT NULL,
  email                     VARCHAR(255),
  postal_code               VARCHAR(10),       -- pin_code (IN) / zipcode (US)
  type                      VARCHAR(510),
  comment                   TEXT,
  urlparams                 VARCHAR(255),
  level1                    VARCHAR(100),      -- state
  level2                    VARCHAR(255),      -- district (IN) / county (US)
  category                  SMALLINT,
  stage                     SMALLINT DEFAULT 0,
  status                    BOOLEAN DEFAULT true,
  claim_count               SMALLINT DEFAULT 0 CHECK (claim_count >= 0 AND claim_count <= 5),
  original_id               SMALLINT,
  business_id               SMALLINT,
  email_invite_count        INTEGER DEFAULT 0,
  sv_comment_for_businesses TEXT,
  svnotes                   TEXT,
  business_notes            TEXT,
  marketing_consent         BOOLEAN NOT NULL DEFAULT false,
  reference_uuid            UUID DEFAULT gen_random_uuid(),
  qualification_score       INTEGER,
  bill_url                  TEXT,
  bill_cloudinary_public_id TEXT,
  bill_format               TEXT,
  bill_uploaded_at          TIMESTAMPTZ,
  isvisible                 BOOLEAN DEFAULT true,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (country_code, source_id)
);

CREATE INDEX IF NOT EXISTS leads_created_idx
  ON leads (country_code, created_at DESC);

-- Backfill India.
INSERT INTO leads (
  country_code, source_id, name, phone, email, postal_code, type, comment,
  urlparams, level1, level2, category, stage, status, claim_count,
  original_id, business_id, email_invite_count, sv_comment_for_businesses,
  svnotes, business_notes, marketing_consent, reference_uuid,
  qualification_score, bill_url, bill_cloudinary_public_id, bill_format,
  bill_uploaded_at, isvisible, created_at
)
SELECT
  'in', l.id, l.name, l.phone, l.email, l.pin_code, l.type, l.comment,
  l.urlparams, l.state, l.district, l.category, l.stage, l.status,
  l.claim_count, l.original_id, l.business_id, l.email_invite_count,
  l.sv_comment_for_businesses, l.svnotes, l.business_notes,
  l.marketing_consent, l.reference_uuid, l.qualification_score, l.bill_url,
  l.bill_cloudinary_public_id, l.bill_format, l.bill_uploaded_at,
  l.isvisible, l.created_at
FROM leaddata l
ON CONFLICT (country_code, source_id) DO NOTHING;

-- Backfill US.
INSERT INTO leads (
  country_code, source_id, name, phone, email, postal_code, type, comment,
  urlparams, level2, category, stage, status, claim_count, original_id,
  business_id, email_invite_count, sv_comment_for_businesses, svnotes,
  marketing_consent, isvisible, created_at
)
SELECT
  'us', u.id, u.name, u.phone, u.email, u.zipcode, u.type, u.comment,
  u.urlparams, u.county, u.category, u.stage, u.status, u.claim_count,
  u.original_id, u.business_id, u.email_invite_count,
  u.sv_comment_for_businesses, u.svnotes, u.marketing_consent, u.isvisible,
  u.created_at
FROM us_leaddata u
ON CONFLICT (country_code, source_id) DO NOTHING;

COMMIT;

-- Post-copy check (expected: in = count(leaddata), us = count(us_leaddata)):
-- SELECT country_code, count(*) FROM leads GROUP BY country_code;
