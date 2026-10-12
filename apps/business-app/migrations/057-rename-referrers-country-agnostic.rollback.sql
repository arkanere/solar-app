-- Rollback for 057-rename-referrers-country-agnostic.sql.
--
-- Renames only, so this is a complete reversal: no data was copied, dropped or
-- defaulted by 057, and no sequence value moved. Safe to run at any point.
--
-- Note the app side must go back with it -- @solar/db/schema exports
-- `svReferrers` mapped to "sv_referrers" after 057, and business-app's three
-- referrer endpoints import that name.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 057-rename-referrers-country-agnostic.rollback.sql

BEGIN;

ALTER FUNCTION sv_referrers_set_updated_at() RENAME TO update_referrers_in_updated_at;
ALTER TRIGGER sv_referrers_updated_at_trigger ON sv_referrers
  RENAME TO referrers_in_updated_at_trigger;

ALTER INDEX sv_referrers_business_id_slug_idx RENAME TO idx_referrers_slug;
ALTER INDEX sv_referrers_phone_idx RENAME TO idx_referrers_in_phone;
ALTER INDEX sv_referrers_business_id_idx RENAME TO idx_referrers_in_business_id;

ALTER TABLE sv_referrers RENAME CONSTRAINT sv_referrers_business_id_fkey TO fk_business;
ALTER TABLE sv_referrers
  RENAME CONSTRAINT sv_referrers_business_id_slug_key TO unique_business_slug;
ALTER TABLE sv_referrers RENAME CONSTRAINT sv_referrers_slug_key TO referrers_in_slug_key;
ALTER TABLE sv_referrers RENAME CONSTRAINT sv_referrers_pkey TO referrers_in_pkey;

ALTER SEQUENCE sv_referrers_id_seq RENAME TO referrers_in_id_seq;

ALTER TABLE sv_referrers RENAME TO in_referrers;

COMMIT;
