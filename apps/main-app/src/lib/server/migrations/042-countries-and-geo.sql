-- Country-scalable architecture, phase 1: countries + unified geography.
--
-- Replaces the per-country geo tables (locations: state/district/city;
-- us_locations: state/county/city) with one geo_locations table using
-- generic admin levels. level1 = state everywhere; level2 = district (IN) /
-- county (US). Display labels ("District" vs "County") come from the app's
-- per-country config, not the schema.
--
-- Old tables (locations, us_locations) are NOT touched — business-app,
-- user-app and admin-app keep reading them until they migrate. Geo data is
-- static reference data (no app writes), so a one-time copy needs no sync
-- trigger.
--
-- Slugs are precomputed here so page loads become exact indexed lookups
-- instead of the LOWER(REPLACE(...)) scans used today. sv_slugify matches
-- the existing toSlug convention (lower-case, whitespace -> hyphen) exactly,
-- so every generated IN slug is byte-identical to the URLs already in
-- /in/sitemap.xml. US city slugs use city_ascii when it differs from city
-- (78 rows) so URLs stay ASCII; the display name keeps its diacritics.
-- US slugs deliberately DROP the state-abbreviation suffix ("orange-ca" ->
-- "orange"): in the new /us/solar/{state}/{county}/{city} scheme the state
-- is its own path segment, so the suffix is redundant.
--
-- Verified against live DB 2026-07-18: locations 8395 rows, us_locations
-- 31314 rows, no NULL or untrimmed values; 3 IN + 61 US duplicate groups
-- after slugify (true duplicates — ON CONFLICT keeps the first).
-- Run manually: psql $POSTGRES_URL < 042-countries-and-geo.sql

BEGIN;

CREATE TABLE IF NOT EXISTS countries (
  code      CHAR(2) PRIMARY KEY,   -- 'in', 'us' (lower-case, matches URL prefix)
  name      TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO countries (code, name) VALUES
  ('in', 'India'),
  ('us', 'United States')
ON CONFLICT (code) DO NOTHING;

CREATE OR REPLACE FUNCTION sv_slugify(txt TEXT) RETURNS TEXT AS $$
  SELECT lower(regexp_replace(txt, '\s+', '-', 'g'));
$$ LANGUAGE sql IMMUTABLE;

CREATE TABLE IF NOT EXISTS geo_locations (
  id           SERIAL PRIMARY KEY,
  country_code CHAR(2) NOT NULL REFERENCES countries(code),
  level1       VARCHAR(255) NOT NULL,  -- state
  level2       VARCHAR(255) NOT NULL,  -- district (IN) / county (US)
  city         VARCHAR(255) NOT NULL,
  level1_slug  VARCHAR(255) NOT NULL,
  level2_slug  VARCHAR(255) NOT NULL,
  city_slug    VARCHAR(255) NOT NULL,
  UNIQUE (country_code, level1_slug, level2_slug, city_slug)
);

CREATE INDEX IF NOT EXISTS geo_locations_level2_idx
  ON geo_locations (country_code, level1_slug, level2_slug);

INSERT INTO geo_locations (
  country_code, level1, level2, city, level1_slug, level2_slug, city_slug
)
SELECT
  'in', l.state, l.district, l.city,
  sv_slugify(l.state), sv_slugify(l.district), sv_slugify(l.city)
FROM locations l
ON CONFLICT (country_code, level1_slug, level2_slug, city_slug) DO NOTHING;

INSERT INTO geo_locations (
  country_code, level1, level2, city, level1_slug, level2_slug, city_slug
)
SELECT
  'us', u.state, u.county, u.city,
  sv_slugify(u.state), sv_slugify(u.county),
  sv_slugify(COALESCE(NULLIF(u.city_ascii, ''), u.city))
FROM us_locations u
ON CONFLICT (country_code, level1_slug, level2_slug, city_slug) DO NOTHING;

COMMIT;

-- Post-copy check (expected: in = 8395 - 3 dup rows, us = 31314 - 61 dup rows):
-- SELECT country_code, count(*) FROM geo_locations GROUP BY country_code;
