-- Shared rate-limit store (R2)
-- Backs the previously in-memory RateLimiter so limits hold across serverless
-- instances. Keyed by an opaque identifier (e.g. "reset:<ip>:<slug>").
-- Run manually: psql $POSTGRES_URL < 035-rate-limits.sql

BEGIN;

CREATE TABLE IF NOT EXISTS rate_limits (
  identifier  TEXT PRIMARY KEY,
  count       INTEGER NOT NULL DEFAULT 0,
  reset_time  TIMESTAMPTZ NOT NULL
);

-- Lets a periodic cleanup prune expired windows cheaply.
CREATE INDEX IF NOT EXISTS rate_limits_reset_time_idx ON rate_limits (reset_time);

COMMIT;
