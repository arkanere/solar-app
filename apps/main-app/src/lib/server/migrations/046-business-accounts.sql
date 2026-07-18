-- Unified business auth accounts (phase 2, business-app migration).
-- Country-scalable counterpart of 040's in_business_accounts: one table for
-- all countries, keyed by (country_code, source_id) where source_id is
-- businesses_1.id (in) / us_businesses.id (us) — same keying as the unified
-- businesses table (043).
--
-- Pattern (same as 040/043/045): backfill + one-directional sync triggers
-- old -> new. business-app switches its auth READS here; auth WRITES (token
-- minting, password reset, login tracking, delete) keep hitting the old
-- tables and the triggers propagate them, so main-app/admin-app and the
-- existing 040 IN account sync stay untouched. Writes flip to this table
-- only at the final business-app cutover, when the triggers are dropped.
--
-- Column names/types match businesses_1 / us_businesses (identical auth
-- column sets, verified against live DB 2026-07-18) so reads are a drop-in
-- switch.
-- Run manually: psql $POSTGRES_URL < 046-business-accounts.sql

BEGIN;

CREATE TABLE IF NOT EXISTS business_accounts (
  id                          SERIAL PRIMARY KEY,
  country_code                CHAR(2) NOT NULL REFERENCES countries(code),
  source_id                   INTEGER NOT NULL,  -- businesses_1.id (in) / us_businesses.id (us)
  login_email                 VARCHAR(255),
  login_password              VARCHAR(255),
  magic_link_token            TEXT,
  magic_link_token_expires_at TIMESTAMPTZ,
  reset_token                 VARCHAR(255),
  reset_token_expires         TIMESTAMP,
  isvisible                   BOOLEAN,
  last_login                  TIMESTAMP,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (country_code, source_id)
);

CREATE INDEX IF NOT EXISTS business_accounts_login_email_idx
  ON business_accounts (country_code, login_email);
CREATE INDEX IF NOT EXISTS business_accounts_magic_token_idx
  ON business_accounts (country_code, magic_link_token);

-- Backfill IN from businesses_1 (the write-side source of truth; 040's
-- in_business_accounts is itself a mirror of it).
INSERT INTO business_accounts (
  country_code, source_id, login_email, login_password, magic_link_token,
  magic_link_token_expires_at, reset_token, reset_token_expires,
  isvisible, last_login
)
SELECT
  'in', b.id, b.login_email, b.login_password, b.magic_link_token,
  b.magic_link_token_expires_at, b.reset_token, b.reset_token_expires,
  b.isvisible, b.last_login
FROM businesses_1 b
ON CONFLICT (country_code, source_id) DO NOTHING;

-- Backfill US from us_businesses.
INSERT INTO business_accounts (
  country_code, source_id, login_email, login_password, magic_link_token,
  magic_link_token_expires_at, reset_token, reset_token_expires,
  isvisible, last_login
)
SELECT
  'us', u.id, u.login_email, u.login_password, u.magic_link_token,
  u.magic_link_token_expires_at, u.reset_token, u.reset_token_expires,
  u.isvisible, u.last_login
FROM us_businesses u
ON CONFLICT (country_code, source_id) DO NOTHING;

-- Sync trigger: businesses_1 -> business_accounts ('in').
CREATE OR REPLACE FUNCTION sync_unified_account_in() RETURNS trigger AS $$
BEGIN
  INSERT INTO business_accounts (
    country_code, source_id, login_email, login_password, magic_link_token,
    magic_link_token_expires_at, reset_token, reset_token_expires,
    isvisible, last_login
  )
  VALUES (
    'in', NEW.id, NEW.login_email, NEW.login_password, NEW.magic_link_token,
    NEW.magic_link_token_expires_at, NEW.reset_token, NEW.reset_token_expires,
    NEW.isvisible, NEW.last_login
  )
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
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS businesses_1_unified_account_sync ON businesses_1;
CREATE TRIGGER businesses_1_unified_account_sync
AFTER INSERT OR UPDATE OF
  login_email, login_password, magic_link_token, magic_link_token_expires_at,
  reset_token, reset_token_expires, isvisible, last_login
ON businesses_1
FOR EACH ROW EXECUTE FUNCTION sync_unified_account_in();

-- Sync trigger: us_businesses -> business_accounts ('us').
CREATE OR REPLACE FUNCTION sync_unified_account_us() RETURNS trigger AS $$
BEGIN
  INSERT INTO business_accounts (
    country_code, source_id, login_email, login_password, magic_link_token,
    magic_link_token_expires_at, reset_token, reset_token_expires,
    isvisible, last_login
  )
  VALUES (
    'us', NEW.id, NEW.login_email, NEW.login_password, NEW.magic_link_token,
    NEW.magic_link_token_expires_at, NEW.reset_token, NEW.reset_token_expires,
    NEW.isvisible, NEW.last_login
  )
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
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS us_businesses_unified_account_sync ON us_businesses;
CREATE TRIGGER us_businesses_unified_account_sync
AFTER INSERT OR UPDATE OF
  login_email, login_password, magic_link_token, magic_link_token_expires_at,
  reset_token, reset_token_expires, isvisible, last_login
ON us_businesses
FOR EACH ROW EXECUTE FUNCTION sync_unified_account_us();

COMMIT;

-- Post-copy check (expected: in = count(businesses_1),
-- us = count(us_businesses)):
-- SELECT country_code, count(*) FROM business_accounts GROUP BY country_code;
