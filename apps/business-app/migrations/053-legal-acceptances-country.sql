-- Make legal_acceptances country-aware.
--
-- Found 2026-08-05 while writing a regression test for the /us/api/claimLead
-- email bug. legal_acceptances.business_id referenced businesses_1(id) — the
-- **IN** table — so the whole /us compliance path was dead:
--
--   * /us/api/compliance/acceptPolicy failed with a FK violation for any US
--     business, so no US business could ever record an acceptance;
--   * checkLeadDataPolicy() therefore always returned compliant:false, and
--   * /us/api/claimLead returned 403 compliance_required on every request,
--     before it ever reached the email code the bug was originally about.
--
-- Fix: key acceptances the same way every other unified table is keyed —
-- (country_code, source_id) — and point the FK at business_accounts, the
-- country-agnostic table business-app's auth layer already reads.
--
-- Safe to run against live: every existing row is an IN business (US could
-- never have inserted one), so the backfill is unambiguous.
--
-- Run manually: psql $POSTGRES_URL < 053-legal-acceptances-country.sql

BEGIN;

ALTER TABLE legal_acceptances
  ADD COLUMN IF NOT EXISTS country_code CHAR(2);

-- Every pre-existing row is IN, by construction: the old FK to businesses_1
-- made a US row impossible.
UPDATE legal_acceptances SET country_code = 'in' WHERE country_code IS NULL;

ALTER TABLE legal_acceptances
  ALTER COLUMN country_code SET NOT NULL;

ALTER TABLE legal_acceptances
  ADD CONSTRAINT legal_acceptances_country_code_fkey
  FOREIGN KEY (country_code) REFERENCES countries(code);

-- Drop the IN-only FK and repoint at the unified accounts table. business_id
-- keeps its name and meaning (businesses_1.id for 'in', us_businesses.id for
-- 'us') — that is exactly business_accounts.source_id.
ALTER TABLE legal_acceptances
  DROP CONSTRAINT IF EXISTS legal_acceptances_business_id_fkey;

ALTER TABLE legal_acceptances
  ADD CONSTRAINT legal_acceptances_business_fkey
  FOREIGN KEY (country_code, business_id)
  REFERENCES business_accounts (country_code, source_id);

-- The lookup is always (country, business, policy, newest first).
DROP INDEX IF EXISTS legal_acceptances_business_policy_idx;
CREATE INDEX IF NOT EXISTS legal_acceptances_business_policy_idx
  ON legal_acceptances (country_code, business_id, policy_id, accepted_at DESC);

COMMIT;
