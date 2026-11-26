-- Add business_contact_persons (2026-11-26).
--
-- ** APPLIED 2026-11-26. ** BEGIN, CREATE TABLE, COMMIT.
--
-- The one person who answers for a business account. Until now we held the
-- business's details (business_profiles) and its login (business_accounts) but
-- not who the person behind the account is. A business must add this before it
-- can claim a lead (business-app claim gate).
--
-- One row per account: UNIQUE on account_business_id. Branches share their
-- main's account, so they share its person. Dropping the UNIQUE later allows
-- more than one person per account.
--
-- No verification: access to the account is taken as enough.
--
--   role         'proprietor' | 'employee' | 'third_party'
--   description  free text, optional: what this person does for the business.
--
-- Deleting the account deletes the person (ON DELETE CASCADE), which is what
-- data_deletion_requests need. No backfill: existing businesses are asked for
-- it by the claim gate.
--
-- Deploy order: apply this, then deploy business-app.

BEGIN;

CREATE TABLE business_contact_persons (
  id                  serial PRIMARY KEY,
  account_business_id integer      NOT NULL UNIQUE
                      REFERENCES business_accounts (source_id) ON DELETE CASCADE,
  full_name           varchar(255) NOT NULL,
  role                text         NOT NULL
                      CHECK (role IN ('proprietor', 'employee', 'third_party')),
  description         text,
  created_at          timestamptz  NOT NULL DEFAULT now(),
  updated_at          timestamptz  NOT NULL DEFAULT now()
);

COMMIT;
