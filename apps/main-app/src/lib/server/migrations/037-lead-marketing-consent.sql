-- Explicit consent on lead forms (PII compliance plan, item 7)
-- Records the affirmative opt-in captured by the lead-form consent checkbox.
-- Existing rows predate the checkbox, so they default to false.
-- Run manually: psql $POSTGRES_URL < 037-lead-marketing-consent.sql

BEGIN;

ALTER TABLE leaddata    ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE us_leaddata ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN NOT NULL DEFAULT false;

COMMIT;
