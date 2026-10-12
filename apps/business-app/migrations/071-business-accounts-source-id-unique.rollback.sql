-- Rollback for 071. Drops the single-column unique again.
--
-- Safe to run at any time: 071 adds a constraint and changes no data, so there
-- is nothing to reconstruct. The composite UNIQUE (country_code, source_id) is
-- untouched by both files, so legal_acceptances_business_fkey keeps its target
-- either way.
--
-- Note this does NOT restore the country-threading in the app. The id-only
-- mint signature keeps working without the constraint — it was already correct
-- against the live data before 071, which is why 071 could be described as
-- belt-and-braces. Running this only removes the guarantee that it stays that
-- way; it does not require a code revert.

BEGIN;

ALTER TABLE business_accounts DROP CONSTRAINT IF EXISTS business_accounts_source_id_key;

COMMIT;
