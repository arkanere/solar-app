-- Give business_profiles the column vocabulary `businesses` carries (2026-08-10).
--
-- Step 2a of the collapse. 062 archived businesses_1; the end state is two
-- tables, business_profiles (profile) + business_accounts (auth), and no
-- projection. This file does everything EXCEPT the drop, and 064 drops
-- `businesses` once the code that reads it is deployed and quiet.
--
-- ** Why this is split from the drop, when 062 was not. ** Not to avoid a
-- deploy window — there is one either way, and it is worth being exact about
-- what it costs rather than claiming it away. The renames below break the ~114
-- deployed sites that read business_profiles.gstn/state/district/pincode the
-- moment this commits, and no ordering of a rename avoids that. What the split
-- changes is which failure you are exposed to during those minutes:
--
--   with the split      a renamed column. `businesses` is untouched and still
--                       projected, so the ~329 sites reading it — essentially
--                       every public page that lists an installer — keep
--                       working throughout, and this file is fully reversible
--                       from its rollback script if the deploy goes wrong.
--   without the split   the same rename PLUS a dropped table, taking those 329
--                       sites down with it, and the drop cannot be undone by
--                       reverting code.
--
-- So the window narrows from the whole public directory to the profile writers,
-- and everything inside it stays recoverable. 064 then drops a table that is
-- provably unread, which has no window at all. Apply this immediately before
-- the deploy, not hours ahead.
--
-- ** What changes here. ** The four India-shaped column names go country-neutral,
-- which is the whole reason `businesses` was worth keeping around this long:
--
--   gstn     -> tax_id
--   state    -> level1
--   district -> level2
--   pincode  -> postal_code, char(6) -> varchar(10)
--
-- Renaming these rather than the reverse is what keeps the ~329 sites reading
-- `businesses` changing only their table reference and source_id -> business_id
-- when they move; their column names are already these. The ~114 sites on
-- business_profiles take the rename instead. It is also the direction that does
-- not make `state`/`district`/`gstn` the canonical names for US rows, which is
-- the leakage next-steps.md items 3 and 4 are still working through.
--
-- ** postal_code uses the plain cast, deliberately. ** char(6) space-pads, so
-- `pincode = '411001'` fails on a padded value and a US ZIP+4 does not fit at
-- all. Widening fixes both. The cast is bare `TYPE varchar(10)` rather than
-- `USING trim(...)`: verified on live that the plain char->varchar cast (which
-- strips *trailing* blanks) reproduces businesses.postal_code with 0 mismatches
-- across all 6708 rows, so this changes no value anywhere. trim() would have —
-- **22 rows have a LEADING space in pincode**, which the plain cast preserves
-- and trim() would eat. Those 22 are a real data problem and today
-- businesses.postal_code has the same leading spaces, so nothing regresses;
-- cleaning them is a separate decision, not a side effect of a type change.
--
-- ** sv_sync_business is rewritten, not dropped. ** It sources from the four
-- columns being renamed here (p.gstn, p.state, p.district, p.pincode), so it
-- breaks the moment the rename lands unless it is replaced in the same
-- transaction — that is exactly why these renames could not go in 062. Its
-- target columns in `businesses` are unchanged; only the SELECT side moves. It
-- is dropped in 064 with the table.
--
-- Verified on live before writing this migration:
--   - `businesses` and business_profiles are 6708 rows each, 1:1 on
--     (country_code, source_id) <-> (country_code, business_id), and 0 value
--     drift across slug, businessname, tax_id, level1, level2, postal_code,
--     city and isvisible;
--   - no inbound foreign keys to `businesses` at all;
--   - business_profiles has only bare country_code and slug indexes, where
--     `businesses` carries the composite geo one the directory pages need.
--
-- Code side, changed in the same commit as this file: every read of `businesses`
-- moves to business_profiles (`source_id` -> `business_id`, column names
-- unchanged), and the ~114 existing business_profiles sites take the four
-- renames. `syncBusinessToUnified` stays until 064 — the projection is still
-- live and still has to be driven.
--
-- The three places a code grep of src/ misses (see next-steps.md):
--   - replayed migrations: 054's `CREATE INDEX IF NOT EXISTS
--     in_business_profiles_country_idx` and 055/061's sv_sync_business bodies
--     all predate this and run against the pre-rename names. They are replayed
--     BEFORE this file, against a baseline wound back by apply-test-migrations,
--     so they see the old names exactly as they expect; this file then renames
--     forward at the end of the list, as 061 and 062 do.
--   - fixtures.ts: createBusiness/createUsBusiness insert district/state, which
--     become level2/level1.
--   - function bodies: sv_sync_business only, rewritten below. sv_sync_lead
--     touches leaddata and `leads`, neither of which moves here.
--
-- Reversible via 063-country-neutral-profile-columns.rollback.sql. Unlike 062's,
-- this rollback is safe to run at any point while `businesses` still exists —
-- nothing here is destructive and no data is dropped. The one caveat is the
-- postal_code narrowing, which fails loudly rather than truncating if any value
-- has grown past 6 characters (i.e. if a real ZIP+4 has been written since).
--
-- The test baseline is generated from packages/db/src/schema, so after applying:
--   npm run pull -w @solar/db && node scripts/generate-test-baseline.mjs
--
-- Run manually: psql "$POSTGRES_URL_NON_POOLING" < 063-country-neutral-profile-columns.sql

BEGIN;

-- ---------------------------------------------------------- the vocabulary ----

ALTER TABLE business_profiles RENAME COLUMN gstn     TO tax_id;
ALTER TABLE business_profiles RENAME COLUMN state    TO level1;
ALTER TABLE business_profiles RENAME COLUMN district TO level2;
ALTER TABLE business_profiles RENAME COLUMN pincode  TO postal_code;

ALTER TABLE business_profiles
  ALTER COLUMN postal_code TYPE varchar(10);

-- ---------------------------------------------------------------- indexes ----
-- Carried over from `businesses`, which 064 drops. The composite is what
-- main-app's directory pages filter on; without it those reads become a seq
-- scan over 6,708 rows the moment they repoint here. The two bare indexes it
-- replaces are prefixes of the two composites, so nothing loses coverage.

CREATE INDEX IF NOT EXISTS business_profiles_geo_idx
  ON business_profiles USING btree (country_code, level2, isvisible);

CREATE INDEX IF NOT EXISTS business_profiles_country_slug_idx
  ON business_profiles USING btree (country_code, slug);

DROP INDEX IF EXISTS business_profiles_country_idx;
DROP INDEX IF EXISTS business_profiles_slug_idx;

-- The countries FK `businesses` and business_accounts both carry and this table
-- does not. NOT VALID would buy nothing — every row already satisfies it.

ALTER TABLE business_profiles
  ADD CONSTRAINT business_profiles_country_code_fkey
  FOREIGN KEY (country_code) REFERENCES countries(code);

-- ------------------------------------------------------------ the sync ----
-- Same function, same target columns, sourced from the renamed ones. Must be in
-- this transaction: between the RENAME above and this replacement the old body
-- references columns that no longer exist, and any write that fired in that
-- window would fail.

CREATE OR REPLACE FUNCTION sv_sync_business(p_country character, p_source_id integer)
RETURNS void AS $function$
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
    p.services, p.brands, p.tax_id, p.level1, p.level2, p.city,
    p.postal_code, p.rscore, p.tag, p.notes, p.businessfilled,
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
$function$ LANGUAGE plpgsql;

COMMIT;

-- After committing, confirm the rename is cosmetic and the projection still runs:
--
--   \d business_profiles          -- tax_id, level1, level2, postal_code varchar(10)
--   SELECT sv_sync_business('in', (SELECT business_id FROM business_profiles LIMIT 1));
--   -- and the drift check that matters, which must stay 0:
--   SELECT count(*) FROM business_profiles p JOIN businesses b
--     ON b.country_code = p.country_code AND b.source_id = p.business_id
--    WHERE p.tax_id IS DISTINCT FROM b.tax_id OR p.level1 IS DISTINCT FROM b.level1
--       OR p.level2 IS DISTINCT FROM b.level2 OR p.postal_code IS DISTINCT FROM b.postal_code;
