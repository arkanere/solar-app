-- Phase 7 slice: adopt the IN legacy structure for every country.
--
-- Until now each country had its own legacy write tables (businesses_1 +
-- in_business_profiles vs us_businesses; leaddata vs us_leaddata; branches vs
-- us_branches; projects vs us_projects). The unified tables already carry the
-- IN column set for all countries -- sv_sync_lead('us') simply leaves
-- business_notes, reference_uuid, qualification_score and the bill_* columns
-- NULL -- so the IN shape is already the platform-wide shape at the read layer.
-- This migration makes the write layer agree, by moving the US rows into the IN
-- tables under a country_code discriminator.
--
-- Why this is safe to do as a plain INSERT ... SELECT with no id remapping:
-- us_businesses.id and us_leaddata.id were allocated from the IN sequences
-- (neither has a sequence of its own -- pg_get_serial_sequence returns NULL),
-- and there are ZERO id collisions against the IN tables. Verified on live
-- 2026-08-05. Because the ids do not change, every unified
-- (country_code, source_id) pair stays valid and no resync is required.
--
-- Volume is tiny: 12 us_businesses, 4 us_leaddata, 1 us_branches, 0 us_projects.
--
-- The us_* tables are NOT dropped here. They are left in place as a rollback
-- path and to keep the external admin-app working until it is migrated; see
-- 054-...rollback.sql, and drop them in a later migration once every writer is
-- confirmed off them.
--
-- Column renames applied while copying:
--   us_businesses.ein     -> businesses_1.gstn
--   us_businesses.county  -> businesses_1.district
--   us_businesses.zipcode -> businesses_1.pincode
--   us_leaddata.county    -> leaddata.district
--   us_leaddata.zipcode   -> leaddata.pin_code
-- IN-only columns (brands, business_notes, reference_uuid, qualification_score,
-- bill_*) are left NULL for the copied US rows, exactly as sv_sync_* already
-- projects them today.
--
-- Run manually: psql $POSTGRES_URL_NON_POOLING < 054-unite-country-legacy-tables.sql

BEGIN;

-- ------------------------------------------------------- discriminators ----
-- branches and projects key off business ids, which are globally unique, so
-- they need no country_code of their own. Only the three tables that are
-- looked up or synced by country get one.

ALTER TABLE businesses_1
  ADD COLUMN IF NOT EXISTS country_code CHAR(2) NOT NULL DEFAULT 'in';
ALTER TABLE in_business_profiles
  ADD COLUMN IF NOT EXISTS country_code CHAR(2) NOT NULL DEFAULT 'in';
ALTER TABLE leaddata
  ADD COLUMN IF NOT EXISTS country_code CHAR(2) NOT NULL DEFAULT 'in';

-- The default backfills every existing row to 'in', which is correct: these
-- tables held only IN data before this migration.

CREATE INDEX IF NOT EXISTS businesses_1_country_slug_idx
  ON businesses_1 (country_code, slug);
CREATE INDEX IF NOT EXISTS leaddata_country_idx
  ON leaddata (country_code);
CREATE INDEX IF NOT EXISTS in_business_profiles_country_idx
  ON in_business_profiles (country_code);

-- --------------------------------------------------------- copy US rows ----

INSERT INTO businesses_1 (
  id, country_code, businessname, address, pluscode, phonenumber, email,
  website, gstn, state, district, tag, slug, notes, city, rscore, isvisible,
  login_email, login_password, businessfilled, reset_token, reset_token_expires,
  tier3, pincode, magic_link_token, description, services, whatsapp,
  instagram_id, google_maps_link, last_login, created_at,
  magic_link_token_expires_at
)
SELECT
  u.id, 'us', u.businessname, u.address, u.pluscode, u.phonenumber, u.email,
  u.website, u.ein, u.state, u.county, u.tag, u.slug, u.notes, u.city,
  u.rscore, u.isvisible, u.login_email, u.login_password, u.businessfilled,
  u.reset_token, u.reset_token_expires, u.tier3, u.zipcode, u.magic_link_token,
  u.description, u.services, u.whatsapp, u.instagram_id, u.google_maps_link,
  u.last_login, u.created_at, u.magic_link_token_expires_at
FROM us_businesses u
ON CONFLICT (id) DO NOTHING;

INSERT INTO leaddata (
  id, country_code, name, phone, pin_code, type, comment, created_at, svnotes,
  urlparams, isvisible, email, category, district, stage, status, claim_count,
  original_id, business_id, email_invite_count, sv_comment_for_businesses,
  marketing_consent
)
SELECT
  u.id, 'us', u.name, u.phone, u.zipcode, u.type, u.comment, u.created_at,
  u.svnotes, u.urlparams, u.isvisible, u.email, u.category, u.county, u.stage,
  u.status, u.claim_count, u.original_id, u.business_id, u.email_invite_count,
  u.sv_comment_for_businesses, u.marketing_consent
FROM us_leaddata u
ON CONFLICT (id) DO NOTHING;

INSERT INTO branches (id, main_id, branch_id, isactive, created_at)
SELECT u.id, u.main_id, u.branch_id, u.isactive, u.created_at
FROM us_branches u
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (
  id, title, pincode, project_date, created_at, image_path, image_url,
  cloudinary_public_id, image_width, image_height, image_format, business_slug,
  isvisible, project_slug, district, city
)
SELECT
  u.id, u.title, u.zipcode, u.project_date, u.created_at, u.image_path,
  u.image_url, u.cloudinary_public_id, u.image_width, u.image_height,
  u.image_format, u.business_slug, u.isvisible, u.project_slug, u.county, u.city
FROM us_projects u
ON CONFLICT (id) DO NOTHING;

-- Keep the sequences ahead of the copied ids so the next INSERT does not
-- collide with a row that came from the US side.
SELECT setval('businesses_1_id_seq', GREATEST((SELECT max(id) FROM businesses_1), 1));
SELECT setval('leaddata_id_seq',     GREATEST((SELECT max(id) FROM leaddata), 1));
SELECT setval('branches_id_seq',     GREATEST((SELECT max(id) FROM branches), 1));
SELECT setval('projects_id_seq',     GREATEST((SELECT max(id) FROM projects), 1));

-- ------------------------------------------- US profile rows for the split --
-- IN splits its profile across businesses_1 + in_business_profiles and
-- sv_sync_business('in') sources from the profile table. Now that US lives in
-- businesses_1 too, it needs profile rows on the same footing, otherwise
-- sv_sync_business('us') has nothing to read once it is repointed below.

INSERT INTO in_business_profiles (
  business_id, country_code, slug, businessname, email, phonenumber, whatsapp,
  description, website, instagram_id, google_maps_link, address, pluscode,
  services, gstn, state, district, city, pincode, rscore, tag, notes,
  businessfilled, tier3, isvisible, created_at
)
SELECT
  b.id, 'us', b.slug, b.businessname, b.email, b.phonenumber, b.whatsapp,
  b.description, b.website, b.instagram_id, b.google_maps_link, b.address,
  b.pluscode, b.services, b.gstn, b.state, b.district, b.city, b.pincode,
  b.rscore, b.tag, b.notes, b.businessfilled, b.tier3, b.isvisible, b.created_at
FROM businesses_1 b
WHERE b.country_code = 'us'
ON CONFLICT (business_id) DO NOTHING;

-- ------------------------------------------------ repoint the sync fns -----
-- sv_sync_business/_account/_lead branch on p_country to pick a source table.
-- With one set of tables, the branch collapses to a country_code filter. The
-- IN arm is unchanged in shape, so only the source predicate moves.

CREATE OR REPLACE FUNCTION sv_sync_in_split(p_source_id INTEGER)
RETURNS void AS $$
BEGIN
  INSERT INTO in_business_profiles (
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

COMMIT;

-- NOTE: sv_sync_business, sv_sync_account and sv_sync_lead still branch on
-- p_country to read us_businesses / us_leaddata. Repointing their 'us' arms at
-- the united tables is deliberately a SEPARATE migration (055), so this one can
-- be verified -- rows copied, ids intact, unified projection unchanged -- before
-- the read path moves. Until 055 runs, the us_* tables remain the source of
-- truth for the 'us' arm and this migration is purely additive.
