-- Magic-link token hardening (R1)
-- Adds an expiry column so magic links are no longer "permanent until used".
-- Tokens are now also stored hashed (sha256) by the creators; existing plaintext
-- tokens will stop matching after deploy, so any already-issued links must be
-- re-requested. Rows with a NULL expiry are treated as expired by validation.
-- Run manually: psql $POSTGRES_URL < 034-magic-link-token-expiry.sql

BEGIN;

ALTER TABLE businesses_1  ADD COLUMN IF NOT EXISTS magic_link_token_expires_at TIMESTAMPTZ;
ALTER TABLE us_businesses ADD COLUMN IF NOT EXISTS magic_link_token_expires_at TIMESTAMPTZ;
ALTER TABLE in_user       ADD COLUMN IF NOT EXISTS magic_link_token_expires_at TIMESTAMPTZ;

COMMIT;
