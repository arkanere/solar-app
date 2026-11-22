-- Add business_magic_links (2026-11-22).
--
-- ** APPLIED 2026-11-22. ** BEGIN, CREATE TABLE, CREATE INDEX ×2, COMMIT.
--
-- One row per magic link sent to a business. Until now each account held a
-- single token in business_accounts.magic_link_token, so every new link (a
-- share mail, an allotment mail, a WhatsApp reminder) killed the one sent
-- before it. With a row per link, links sent by mail, WhatsApp, the next mail
-- and so on all work side by side until each one expires.
--
-- Only the SHA-256 of the raw token is stored, as before.
--
--   purpose   why the link was sent: 'lead_share', 'lead_whatsapp',
--             'lead_allotted', 'forgot_password', 'promo', 'credentials',
--             'admin_access'. Free text, for audit; nothing branches on an
--             unknown value.
--   lead_id   the leaddata row the link is about, when there is one. Sign-in
--             lands the business on that lead.
--
-- business_accounts.magic_link_token stays for now: business-app accepts it
-- as a fallback so links sent before this deploy keep working. It can be
-- dropped once the last of them has expired (15 days after the deploy).
--
-- Deploy order: apply this, then deploy business-app (reads and writes the
-- table), then admin-app (writes it).

BEGIN;

CREATE TABLE business_magic_links (
  id                  serial PRIMARY KEY,
  account_business_id integer     NOT NULL
                      REFERENCES business_accounts (source_id) ON DELETE CASCADE,
  token_hash          text        NOT NULL UNIQUE,
  purpose             text        NOT NULL,
  lead_id             integer,
  created_at          timestamptz NOT NULL DEFAULT now(),
  expires_at          timestamptz NOT NULL,
  last_used_at        timestamptz
);

CREATE INDEX business_magic_links_account_idx
  ON business_magic_links (account_business_id);
CREATE INDEX business_magic_links_expires_at_idx
  ON business_magic_links (expires_at);

COMMIT;
