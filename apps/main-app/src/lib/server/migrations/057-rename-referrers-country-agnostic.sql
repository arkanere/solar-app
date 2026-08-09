-- Rename in_referrers -> sv_referrers, dropping the country marker from the
-- last legacy table that still carried one (2026-08-09).
--
-- This is NOT a 054-style unification. There was never a us_referrers table --
-- to_regclass('public.us_referrers') is NULL on live and no migration in this
-- directory ever created one. The stale "in_referrers/us_referrers" comment in
-- business-app/src/lib/types/api.ts was the only thing suggesting otherwise.
-- So there are no rows to copy and no sequences to reconcile: the table is
-- already the platform-wide table, and only its name said "IN".
--
-- No country_code column, deliberately, following 054's own rule:
--
--   "branches and projects key off business ids, which are globally unique, so
--    they need no country_code of their own. Only the three tables that are
--    looked up or synced by country get one."
--
-- sv_referrers.business_id is an FK to businesses_1(id), which is globally
-- unique across countries and already carries country_code. Referrers are never
-- looked up by country and are not projected into any unified table, so a
-- country_code here would be denormalized duplication that could disagree with
-- its own business row. Country comes from the fk_business join.
--
-- Verified on live before writing this migration:
--   - 5 rows, on 5 distinct businesses, all with businesses_1.country_code='in',
--     zero orphans;
--   - no inbound foreign keys reference in_referrers;
--   - no views reference it;
--   - the only function that does is its own updated_at trigger, renamed below.
--
-- Every dependent object is renamed too, not just the table -- leaving
-- referrers_in_pkey and idx_referrers_in_phone behind would keep the country
-- marker exactly where the next `drizzle-kit pull` would write it straight back
-- into schema.ts.
--
-- Renaming a UNIQUE/PRIMARY KEY constraint renames its backing index with it,
-- so the three constraint renames below cover six objects.
--
-- Reversible: see 057-...rollback.sql. Renames only -- no data is touched.
--
-- NOT replayed by scripts/apply-test-migrations.mjs: that list is documented as
-- containing "no rename, no drop", and the test baseline is regenerated from
-- packages/db/src/schema, which carries the post-rename names.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 057-rename-referrers-country-agnostic.sql

BEGIN;

ALTER TABLE in_referrers RENAME TO sv_referrers;

ALTER SEQUENCE referrers_in_id_seq RENAME TO sv_referrers_id_seq;

-- Constraints (each takes its backing index along).
ALTER TABLE sv_referrers RENAME CONSTRAINT referrers_in_pkey TO sv_referrers_pkey;
ALTER TABLE sv_referrers RENAME CONSTRAINT referrers_in_slug_key TO sv_referrers_slug_key;
ALTER TABLE sv_referrers
  RENAME CONSTRAINT unique_business_slug TO sv_referrers_business_id_slug_key;
ALTER TABLE sv_referrers RENAME CONSTRAINT fk_business TO sv_referrers_business_id_fkey;

-- Plain indexes.
ALTER INDEX idx_referrers_in_business_id RENAME TO sv_referrers_business_id_idx;
ALTER INDEX idx_referrers_in_phone RENAME TO sv_referrers_phone_idx;
ALTER INDEX idx_referrers_slug RENAME TO sv_referrers_business_id_slug_idx;

-- The trigger and its function. The trigger references the function by OID, so
-- renaming the function does not need the trigger recreated.
ALTER TRIGGER referrers_in_updated_at_trigger ON sv_referrers
  RENAME TO sv_referrers_updated_at_trigger;
ALTER FUNCTION update_referrers_in_updated_at() RENAME TO sv_referrers_set_updated_at;

COMMIT;

-- Left alone on purpose, both pre-existing and both out of scope for a rename:
--   - sv_referrers_business_id_slug_idx (business_id, slug) is redundant with
--     the unique constraint on the same columns, which already provides an
--     index. Dropping it is a free win but is not this migration's business.
--   - sv_referrers_slug_key is UNIQUE on slug alone, globally across all
--     businesses, which makes the per-business unique redundant and means two
--     businesses cannot both have a referrer slugged "ravi". api/addReferrer
--     only checks for a per-business duplicate, so a cross-business collision
--     surfaces as a raw 500 rather than the endpoint's own error message.
