-- DSAR "Request My Data" (PII compliance plan, item 4)
-- Mirrors data_deletion_requests. Lead submitters have no account to authenticate
-- against, so access requests are collected here and fulfilled manually within the
-- 30-day SLA (team queries the DB and emails a CSV).
-- Run manually: psql $POSTGRES_URL < 036-data-access-requests.sql

BEGIN;

CREATE TABLE IF NOT EXISTS data_access_requests (
  id         SERIAL PRIMARY KEY,
  email      TEXT NOT NULL,
  phone      TEXT,
  reason     TEXT,
  status     TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS data_access_requests_status_idx ON data_access_requests (status);

COMMIT;
