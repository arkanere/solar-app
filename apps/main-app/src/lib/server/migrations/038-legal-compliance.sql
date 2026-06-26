-- Legal compliance module (PII compliance plan, item 8)
-- Gates lead claims behind installer acceptance of the data-handling policy.
-- Installers accept before their first claim and re-accept every 90 days
-- (the 90-day check is enforced passively at claim time).
-- Run manually: psql $POSTGRES_URL < 038-legal-compliance.sql

BEGIN;

-- Versioned policy documents. The active policy is the most recent row (by
-- effective_at) for a given type whose effective_at has passed.
CREATE TABLE IF NOT EXISTS legal_policies (
  id           SERIAL PRIMARY KEY,
  type         VARCHAR(50) NOT NULL,   -- 'lead_data_handling'
  version      VARCHAR(20) NOT NULL,   -- e.g. '2024-Q1'
  summary      TEXT NOT NULL,          -- plain-English text shown in the modal
  effective_at TIMESTAMPTZ NOT NULL,
  UNIQUE (type, version)
);

-- Every acceptance by every installer. business_id references businesses_1,
-- which holds both India and US installer rows.
CREATE TABLE IF NOT EXISTS legal_acceptances (
  id          SERIAL PRIMARY KEY,
  business_id INTEGER NOT NULL REFERENCES businesses_1(id),
  policy_id   INTEGER NOT NULL REFERENCES legal_policies(id),
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address  VARCHAR(45)
);

CREATE INDEX IF NOT EXISTS legal_acceptances_business_policy_idx
  ON legal_acceptances (business_id, policy_id, accepted_at DESC);

-- Seed the initial lead-data-handling policy.
INSERT INTO legal_policies (type, version, summary, effective_at)
VALUES (
  'lead_data_handling',
  '2024-Q1',
  'By claiming this lead, you agree to: (1) use the customer''s contact details only to respond to their specific solar inquiry; (2) not sell, share, or transfer their details to any third party; (3) delete their details if they request it; (4) comply with applicable data protection laws including India''s DPDP Act 2023.',
  NOW()
)
ON CONFLICT (type, version) DO NOTHING;

COMMIT;
