-- Fix: the 039 backfill did not copy businesses_1.created_at, so every
-- backfilled in_business_profiles row carries the migration date instead of
-- the original business creation date. main-app's /in/solar/[state] page
-- reads MAX(created_at) as "latest installer added", so copy the real
-- timestamps across. Rows created after the migration are unaffected
-- (trigger inserts at business creation time, so DEFAULT NOW() is correct).
-- Run manually: psql $POSTGRES_URL < 041-in-business-profiles-created-at.sql

BEGIN;

UPDATE in_business_profiles p
SET created_at = b.created_at
FROM businesses_1 b
WHERE b.id = p.business_id
  AND b.created_at IS NOT NULL
  AND p.created_at <> b.created_at;

COMMIT;
