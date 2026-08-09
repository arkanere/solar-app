-- Rename in_business_profiles -> business_profiles (2026-08-09).
--
-- The `in_` prefix has been wrong since 054. 040 created the table as the IN
-- half of a per-country pair (in_business_profiles vs us_businesses); 054 united
-- both countries onto it behind a country_code discriminator, and 056 dropped
-- the us_* tables outright. It has held US rows for two migrations now, so the
-- prefix actively misleads — it is the profile table, full stop.
--
-- Nothing about the shape or contents changes. This is a rename plus the three
-- function bodies that name the table; a plpgsql body is stored as text and
-- resolved at execution, so leaving them would not fail here but would fail on
-- the next sync call.
--
-- Verified on live before writing this migration:
--   - no inbound foreign keys, no triggers, no views or matviews;
--   - exactly three function bodies mention it — sv_sync_business (055),
--     sv_sync_in_split (054) and sv_sync_in_business_profile (050), all three
--     recreated below with the new name and otherwise byte-identical to what
--     pg_get_functiondef returns today;
--   - business_profiles_pkey and business_profiles_id_seq already carry the new
--     name (they predate 040's rename in the other direction), so only the
--     unique constraint and the two indexes need renaming to match.
--
-- sv_sync_in_business_profile has been an orphan since 054 inlined the profile
-- upsert into sv_sync_in_split — nothing calls it, in the database or in any
-- app. It is recreated here rather than dropped so the rename stays a rename;
-- dropping it is its own decision, tracked in next-steps.md.
--
-- The function names themselves are left alone. sv_sync_in_split is now a
-- misnomer for the same reason the table was, but renaming a function the apps
-- call by name is a code change too, and does not belong in this migration.
--
-- Code side, in the same commit as this file: the drizzle export renames from
-- `inBusinessProfiles` to `businessProfiles` (drizzle-kit pull derives it from
-- the table name), across 28 files in main-app, business-app and the tests.
-- user-app has no reference, and admin-app in solar-app-internal declares the
-- table in its generated schema but its barrel does not import it.
--
-- The three places a src/ grep misses (see next-steps.md):
--   - replayed migrations: 050, 054 and 055 are on apply-test-migrations.mjs's
--     list and all three name the table. 054 does a bare ALTER TABLE and a
--     CREATE INDEX against it, which would fail outright against a regenerated
--     baseline that only has business_profiles. Rather than edit those files —
--     they are history — the script now winds the baseline's names back to the
--     old ones before replaying, and this migration, appended to the list,
--     renames them forward again exactly as it does on live.
--   - fixtures.ts TRUNCATE list: updated in this commit.
--   - function bodies: the three below.
--
-- Reversible: 061-rename-in-business-profiles.rollback.sql.
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 061-rename-in-business-profiles.sql

BEGIN;

ALTER TABLE in_business_profiles RENAME TO business_profiles;

ALTER INDEX in_business_profiles_slug_idx RENAME TO business_profiles_slug_idx;
ALTER INDEX in_business_profiles_country_idx RENAME TO business_profiles_country_idx;
ALTER TABLE business_profiles
  RENAME CONSTRAINT in_business_profiles_business_id_key TO business_profiles_business_id_key;

-- businesses_1 -> business_profiles, carrying country_code (054's version).
CREATE OR REPLACE FUNCTION sv_sync_in_split(p_source_id INTEGER)
RETURNS void AS $$
BEGIN
  INSERT INTO business_profiles (
    business_id, country_code, slug, businessname, email, phonenumber, whatsapp,
    description, website, instagram_id, google_maps_link, address, pluscode,
    services, brands, gstn, state, district, city, pincode, rscore, tag, notes,
    businessfilled, tier3, isvisible, created_at
  )
  SELECT
    b.id, b.country_code, b.slug, b.businessname, b.email, b.phonenumber,
    b.whatsapp, b.description, b.website, b.instagram_id, b.google_maps_link,
    b.address, b.pluscode, b.services, b.brands, b.gstn, b.state, b.district,
    b.city, b.pincode, b.rscore, b.tag, b.notes, b.businessfilled, b.tier3,
    b.isvisible, b.created_at
  FROM businesses_1 b WHERE b.id = p_source_id
  ON CONFLICT (business_id) DO UPDATE SET
    country_code     = EXCLUDED.country_code,
    slug             = EXCLUDED.slug,
    businessname     = EXCLUDED.businessname,
    email            = EXCLUDED.email,
    phonenumber      = EXCLUDED.phonenumber,
    whatsapp         = EXCLUDED.whatsapp,
    description      = EXCLUDED.description,
    website          = EXCLUDED.website,
    instagram_id     = EXCLUDED.instagram_id,
    google_maps_link = EXCLUDED.google_maps_link,
    address          = EXCLUDED.address,
    pluscode         = EXCLUDED.pluscode,
    services         = EXCLUDED.services,
    brands           = EXCLUDED.brands,
    gstn             = EXCLUDED.gstn,
    state            = EXCLUDED.state,
    district         = EXCLUDED.district,
    city             = EXCLUDED.city,
    pincode          = EXCLUDED.pincode,
    rscore           = EXCLUDED.rscore,
    tag              = EXCLUDED.tag,
    notes            = EXCLUDED.notes,
    businessfilled   = EXCLUDED.businessfilled,
    tier3            = EXCLUDED.tier3,
    isvisible        = EXCLUDED.isvisible;
END;
$$ LANGUAGE plpgsql;

-- business_profiles -> unified businesses, for both countries (055's version).
CREATE OR REPLACE FUNCTION sv_sync_business(p_country CHARACTER, p_source_id INTEGER)
RETURNS void AS $$
BEGIN
  INSERT INTO businesses (
    country_code, source_id, slug, businessname, email, phonenumber, whatsapp,
    description, website, instagram_id, google_maps_link, address, pluscode,
    services, brands, tax_id, level1, level2, city, postal_code, rscore, tag,
    notes, businessfilled, tier3, isvisible
  )
  SELECT
    p.country_code, p.business_id, p.slug, p.businessname, p.email,
    p.phonenumber, p.whatsapp, p.description, p.website,
    p.instagram_id, p.google_maps_link, p.address, p.pluscode,
    p.services, p.brands, p.gstn, p.state, p.district, p.city,
    p.pincode, p.rscore, p.tag, p.notes, p.businessfilled,
    p.tier3, p.isvisible
  FROM business_profiles p
  WHERE p.business_id = p_source_id AND p.country_code = p_country
  ON CONFLICT (country_code, source_id) DO UPDATE SET
    slug             = EXCLUDED.slug,
    businessname     = EXCLUDED.businessname,
    email            = EXCLUDED.email,
    phonenumber      = EXCLUDED.phonenumber,
    whatsapp         = EXCLUDED.whatsapp,
    description      = EXCLUDED.description,
    website          = EXCLUDED.website,
    instagram_id     = EXCLUDED.instagram_id,
    google_maps_link = EXCLUDED.google_maps_link,
    address          = EXCLUDED.address,
    pluscode         = EXCLUDED.pluscode,
    services         = EXCLUDED.services,
    brands           = EXCLUDED.brands,
    tax_id           = EXCLUDED.tax_id,
    level1           = EXCLUDED.level1,
    level2           = EXCLUDED.level2,
    city             = EXCLUDED.city,
    postal_code      = EXCLUDED.postal_code,
    rscore           = EXCLUDED.rscore,
    tag              = EXCLUDED.tag,
    notes            = EXCLUDED.notes,
    businessfilled   = EXCLUDED.businessfilled,
    tier3            = EXCLUDED.tier3,
    isvisible        = EXCLUDED.isvisible,
    updated_at       = NOW();
END;
$$ LANGUAGE plpgsql;

-- Orphaned since 054 (see the header) — recreated only so the rename leaves no
-- function with an unresolvable table reference behind it.
CREATE OR REPLACE FUNCTION sv_sync_in_business_profile(p_source_id INTEGER)
RETURNS void AS $$
BEGIN
  INSERT INTO business_profiles (
    business_id, slug, businessname, email, phonenumber, whatsapp,
    description, website, instagram_id, google_maps_link, address, pluscode,
    services, brands, gstn, state, district, city, pincode, rscore, tag,
    notes, businessfilled, tier3, isvisible
  )
  SELECT
    b.id, b.slug, b.businessname, b.email, b.phonenumber,
    b.whatsapp, b.description, b.website, b.instagram_id,
    b.google_maps_link, b.address, b.pluscode, b.services, b.brands,
    b.gstn, b.state, b.district, b.city, b.pincode, b.rscore,
    b.tag, b.notes, b.businessfilled, b.tier3, b.isvisible
  FROM businesses_1 b WHERE b.id = p_source_id
  ON CONFLICT (business_id) DO UPDATE SET
    slug             = EXCLUDED.slug,
    businessname     = EXCLUDED.businessname,
    email            = EXCLUDED.email,
    phonenumber      = EXCLUDED.phonenumber,
    whatsapp         = EXCLUDED.whatsapp,
    description      = EXCLUDED.description,
    website          = EXCLUDED.website,
    instagram_id     = EXCLUDED.instagram_id,
    google_maps_link = EXCLUDED.google_maps_link,
    address          = EXCLUDED.address,
    pluscode         = EXCLUDED.pluscode,
    services         = EXCLUDED.services,
    brands           = EXCLUDED.brands,
    gstn             = EXCLUDED.gstn,
    state            = EXCLUDED.state,
    district         = EXCLUDED.district,
    city             = EXCLUDED.city,
    pincode          = EXCLUDED.pincode,
    rscore           = EXCLUDED.rscore,
    tag              = EXCLUDED.tag,
    notes            = EXCLUDED.notes,
    businessfilled   = EXCLUDED.businessfilled,
    tier3            = EXCLUDED.tier3,
    isvisible        = EXCLUDED.isvisible,
    updated_at       = NOW();
END;
$$ LANGUAGE plpgsql;

COMMIT;
