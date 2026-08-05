-- Rollback for 053-legal-acceptances-country.sql.
--
-- Restores legal_acceptances to its pre-053 shape: the IN-only FK to
-- businesses_1(id), the 3-column index, and no country_code.
--
-- Safe only while every row is still country_code='in'. If /us acceptances
-- have been recorded since 053 ran, this will fail on the businesses_1 FK —
-- which is the correct outcome: those rows have no home in the old shape, and
-- silently dropping them would lose real compliance records. Check first:
--
--   SELECT country_code, count(*) FROM legal_acceptances GROUP BY 1;
--
-- Run manually: psql $POSTGRES_URL < 053-legal-acceptances-country.rollback.sql

BEGIN;

ALTER TABLE legal_acceptances
  DROP CONSTRAINT IF EXISTS legal_acceptances_business_fkey;

ALTER TABLE legal_acceptances
  DROP CONSTRAINT IF EXISTS legal_acceptances_country_code_fkey;

ALTER TABLE legal_acceptances
  ADD CONSTRAINT legal_acceptances_business_id_fkey
  FOREIGN KEY (business_id) REFERENCES businesses_1 (id);

DROP INDEX IF EXISTS legal_acceptances_business_policy_idx;
CREATE INDEX IF NOT EXISTS legal_acceptances_business_policy_idx
  ON legal_acceptances (business_id, policy_id, accepted_at DESC);

ALTER TABLE legal_acceptances
  DROP COLUMN IF EXISTS country_code;

COMMIT;
