// Country-agnostic geography queries against geo_locations (migration 042).
// level1 = state, level2 = district (IN) / county (US). All lookups are
// exact matches on the precomputed slug columns — no LOWER(REPLACE(...))
// scans.

import { pool } from './db';
import type { CountryCode } from '$lib/countries';

export interface GeoLevel1 {
	level1: string;
	level1Slug: string;
}

export interface GeoLevel2 {
	level1: string;
	level1Slug: string;
	level2: string;
	level2Slug: string;
}

export interface GeoCity extends GeoLevel2 {
	city: string;
	citySlug: string;
}

export async function resolveLevel1(
	country: CountryCode,
	level1Slug: string
): Promise<GeoLevel1 | null> {
	const result = await pool.query(
		`SELECT level1, level1_slug FROM geo_locations
		 WHERE country_code = $1 AND level1_slug = $2
		 LIMIT 1`,
		[country, level1Slug]
	);
	if (result.rows.length === 0) return null;
	return { level1: result.rows[0].level1, level1Slug: result.rows[0].level1_slug };
}

export async function resolveLevel2(
	country: CountryCode,
	level1Slug: string,
	level2Slug: string
): Promise<GeoLevel2 | null> {
	const result = await pool.query(
		`SELECT level1, level1_slug, level2, level2_slug FROM geo_locations
		 WHERE country_code = $1 AND level1_slug = $2 AND level2_slug = $3
		 LIMIT 1`,
		[country, level1Slug, level2Slug]
	);
	if (result.rows.length === 0) return null;
	const r = result.rows[0];
	return {
		level1: r.level1,
		level1Slug: r.level1_slug,
		level2: r.level2,
		level2Slug: r.level2_slug
	};
}

export async function resolveCity(
	country: CountryCode,
	level1Slug: string,
	level2Slug: string,
	citySlug: string
): Promise<GeoCity | null> {
	const result = await pool.query(
		`SELECT level1, level1_slug, level2, level2_slug, city, city_slug FROM geo_locations
		 WHERE country_code = $1 AND level1_slug = $2 AND level2_slug = $3 AND city_slug = $4
		 LIMIT 1`,
		[country, level1Slug, level2Slug, citySlug]
	);
	if (result.rows.length === 0) return null;
	const r = result.rows[0];
	return {
		level1: r.level1,
		level1Slug: r.level1_slug,
		level2: r.level2,
		level2Slug: r.level2_slug,
		city: r.city,
		citySlug: r.city_slug
	};
}

// Legacy US slugs carry no state segment ("orange" or suffixed "orange-ca").
// Redirect shims use this to find the state for a bare level2 slug.
export async function findLevel1ForLevel2(
	country: CountryCode,
	level2Slug: string
): Promise<GeoLevel2 | null> {
	const result = await pool.query(
		`SELECT level1, level1_slug, level2, level2_slug FROM geo_locations
		 WHERE country_code = $1 AND level2_slug = $2
		 LIMIT 1`,
		[country, level2Slug]
	);
	if (result.rows.length === 0) return null;
	const r = result.rows[0];
	return {
		level1: r.level1,
		level1Slug: r.level1_slug,
		level2: r.level2,
		level2Slug: r.level2_slug
	};
}

// Redirect shims for the legacy US city directory: locate a city by slug
// (optionally scoped to a state) to rebuild its full geo path.
export async function findCity(
	country: CountryCode,
	citySlug: string,
	level1Slug?: string
): Promise<GeoCity | null> {
	const result = level1Slug
		? await pool.query(
				`SELECT level1, level1_slug, level2, level2_slug, city, city_slug FROM geo_locations
				 WHERE country_code = $1 AND city_slug = $2 AND level1_slug = $3
				 LIMIT 1`,
				[country, citySlug, level1Slug]
			)
		: await pool.query(
				`SELECT level1, level1_slug, level2, level2_slug, city, city_slug FROM geo_locations
				 WHERE country_code = $1 AND city_slug = $2
				 LIMIT 1`,
				[country, citySlug]
			);
	if (result.rows.length === 0) return null;
	const r = result.rows[0];
	return {
		level1: r.level1,
		level1Slug: r.level1_slug,
		level2: r.level2,
		level2Slug: r.level2_slug,
		city: r.city,
		citySlug: r.city_slug
	};
}

export async function getLevel1s(country: CountryCode): Promise<GeoLevel1[]> {
	const result = await pool.query(
		`SELECT DISTINCT g.level1, g.level1_slug FROM geo_locations g
		 WHERE g.country_code = $1
		   AND EXISTS (
		     SELECT 1 FROM businesses b
		     WHERE b.country_code = g.country_code
		       AND LOWER(b.level1) = LOWER(g.level1) AND b.isvisible = true
		   )
		 ORDER BY g.level1 ASC`,
		[country]
	);
	return result.rows.map((r) => ({ level1: r.level1, level1Slug: r.level1_slug }));
}

export async function getLevel2sForLevel1(
	country: CountryCode,
	level1Slug: string,
	options: { withBusinessesOnly?: boolean } = {}
): Promise<GeoLevel2[]> {
	const businessFilter = options.withBusinessesOnly
		? `AND EXISTS (
		     SELECT 1 FROM businesses b
		     WHERE b.country_code = g.country_code
		       AND LOWER(b.level2) = LOWER(g.level2) AND b.isvisible = true
		   )`
		: '';
	const result = await pool.query(
		`SELECT DISTINCT g.level1, g.level1_slug, g.level2, g.level2_slug FROM geo_locations g
		 WHERE g.country_code = $1 AND g.level1_slug = $2 ${businessFilter}
		 ORDER BY g.level2 ASC`,
		[country, level1Slug]
	);
	return result.rows.map((r) => ({
		level1: r.level1,
		level1Slug: r.level1_slug,
		level2: r.level2,
		level2Slug: r.level2_slug
	}));
}

export async function getCitiesForLevel2(
	country: CountryCode,
	level1Slug: string,
	level2Slug: string
): Promise<GeoCity[]> {
	const result = await pool.query(
		`SELECT level1, level1_slug, level2, level2_slug, city, city_slug FROM geo_locations
		 WHERE country_code = $1 AND level1_slug = $2 AND level2_slug = $3
		 ORDER BY city ASC`,
		[country, level1Slug, level2Slug]
	);
	return result.rows.map((r) => ({
		level1: r.level1,
		level1Slug: r.level1_slug,
		level2: r.level2,
		level2Slug: r.level2_slug,
		city: r.city,
		citySlug: r.city_slug
	}));
}

export interface TopLevel2 {
	name: string;
	level1: string;
	level1Slug: string;
	level2Slug: string;
	installerCount: number;
}

// Generalizes queries.ts getTopDistricts to any country.
export async function getTopLevel2s(country: CountryCode, limit = 5): Promise<TopLevel2[]> {
	const result = await pool.query(
		`SELECT g.level2, g.level1, g.level1_slug, g.level2_slug,
		        COUNT(DISTINCT b.source_id) as installer_count
		 FROM geo_locations g
		 JOIN businesses b
		   ON b.country_code = g.country_code
		  AND LOWER(b.level2) = LOWER(g.level2) AND b.isvisible = true
		 WHERE g.country_code = $1
		 GROUP BY g.level2, g.level1, g.level1_slug, g.level2_slug
		 ORDER BY installer_count DESC
		 LIMIT $2`,
		[country, limit]
	);
	return result.rows.map((r) => ({
		name: r.level2,
		level1: r.level1,
		level1Slug: r.level1_slug,
		level2Slug: r.level2_slug,
		installerCount: parseInt(r.installer_count)
	}));
}
