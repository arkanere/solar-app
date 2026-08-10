// Country-agnostic geography queries against geo_locations (migration 042).
// level1 = state, level2 = district (IN) / county (US). All lookups are
// exact matches on the precomputed slug columns — no LOWER(REPLACE(...))
// scans.

import { db } from './db';
import { businessProfiles, geoLocations } from '@solar/db/schema';
import { and, asc, countDistinct, desc, eq, exists, sql } from 'drizzle-orm';
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

const LEVEL1_SELECTION = {
	level1: geoLocations.level1,
	level1Slug: geoLocations.level1Slug
};

const LEVEL2_SELECTION = {
	...LEVEL1_SELECTION,
	level2: geoLocations.level2,
	level2Slug: geoLocations.level2Slug
};

const CITY_SELECTION = {
	...LEVEL2_SELECTION,
	city: geoLocations.city,
	citySlug: geoLocations.citySlug
};

export async function resolveLevel1(
	country: CountryCode,
	level1Slug: string
): Promise<GeoLevel1 | null> {
	const rows = await db
		.select(LEVEL1_SELECTION)
		.from(geoLocations)
		.where(and(eq(geoLocations.countryCode, country), eq(geoLocations.level1Slug, level1Slug)))
		.limit(1);
	return rows[0] ?? null;
}

export async function resolveLevel2(
	country: CountryCode,
	level1Slug: string,
	level2Slug: string
): Promise<GeoLevel2 | null> {
	const rows = await db
		.select(LEVEL2_SELECTION)
		.from(geoLocations)
		.where(
			and(
				eq(geoLocations.countryCode, country),
				eq(geoLocations.level1Slug, level1Slug),
				eq(geoLocations.level2Slug, level2Slug)
			)
		)
		.limit(1);
	return rows[0] ?? null;
}

export async function resolveCity(
	country: CountryCode,
	level1Slug: string,
	level2Slug: string,
	citySlug: string
): Promise<GeoCity | null> {
	const rows = await db
		.select(CITY_SELECTION)
		.from(geoLocations)
		.where(
			and(
				eq(geoLocations.countryCode, country),
				eq(geoLocations.level1Slug, level1Slug),
				eq(geoLocations.level2Slug, level2Slug),
				eq(geoLocations.citySlug, citySlug)
			)
		)
		.limit(1);
	return rows[0] ?? null;
}

// Legacy US slugs carry no state segment ("orange" or suffixed "orange-ca").
// Redirect shims use this to find the state for a bare level2 slug.
export async function findLevel1ForLevel2(
	country: CountryCode,
	level2Slug: string
): Promise<GeoLevel2 | null> {
	const rows = await db
		.select(LEVEL2_SELECTION)
		.from(geoLocations)
		.where(and(eq(geoLocations.countryCode, country), eq(geoLocations.level2Slug, level2Slug)))
		.limit(1);
	return rows[0] ?? null;
}

// Redirect shims for the legacy US city directory: locate a city by slug
// (optionally scoped to a state) to rebuild its full geo path.
export async function findCity(
	country: CountryCode,
	citySlug: string,
	level1Slug?: string
): Promise<GeoCity | null> {
	const rows = await db
		.select(CITY_SELECTION)
		.from(geoLocations)
		.where(
			and(
				eq(geoLocations.countryCode, country),
				eq(geoLocations.citySlug, citySlug),
				level1Slug ? eq(geoLocations.level1Slug, level1Slug) : undefined
			)
		)
		.limit(1);
	return rows[0] ?? null;
}

// The businesses-exist filters compare LOWER() on both sides, so they stay on
// the sql escape hatch rather than the query builder.
function hasVisibleBusinessesInLevel1() {
	return exists(
		db
			.select({ one: sql`1` })
			.from(businessProfiles)
			.where(
				and(
					eq(businessProfiles.countryCode, geoLocations.countryCode),
					sql`LOWER(${businessProfiles.level1}) = LOWER(${geoLocations.level1})`,
					eq(businessProfiles.isvisible, true)
				)
			)
	);
}

function hasVisibleBusinessesInLevel2() {
	return exists(
		db
			.select({ one: sql`1` })
			.from(businessProfiles)
			.where(
				and(
					eq(businessProfiles.countryCode, geoLocations.countryCode),
					sql`LOWER(${businessProfiles.level2}) = LOWER(${geoLocations.level2})`,
					eq(businessProfiles.isvisible, true)
				)
			)
	);
}

export async function getLevel1s(country: CountryCode): Promise<GeoLevel1[]> {
	return db
		.selectDistinct(LEVEL1_SELECTION)
		.from(geoLocations)
		.where(and(eq(geoLocations.countryCode, country), hasVisibleBusinessesInLevel1()))
		.orderBy(asc(geoLocations.level1));
}

export async function getLevel2sForLevel1(
	country: CountryCode,
	level1Slug: string,
	options: { withBusinessesOnly?: boolean } = {}
): Promise<GeoLevel2[]> {
	return db
		.selectDistinct(LEVEL2_SELECTION)
		.from(geoLocations)
		.where(
			and(
				eq(geoLocations.countryCode, country),
				eq(geoLocations.level1Slug, level1Slug),
				options.withBusinessesOnly ? hasVisibleBusinessesInLevel2() : undefined
			)
		)
		.orderBy(asc(geoLocations.level2));
}

export async function getCitiesForLevel2(
	country: CountryCode,
	level1Slug: string,
	level2Slug: string
): Promise<GeoCity[]> {
	return db
		.select(CITY_SELECTION)
		.from(geoLocations)
		.where(
			and(
				eq(geoLocations.countryCode, country),
				eq(geoLocations.level1Slug, level1Slug),
				eq(geoLocations.level2Slug, level2Slug)
			)
		)
		.orderBy(asc(geoLocations.city));
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
	const installerCount = countDistinct(businessProfiles.businessId);
	const rows = await db
		.select({
			name: geoLocations.level2,
			level1: geoLocations.level1,
			level1Slug: geoLocations.level1Slug,
			level2Slug: geoLocations.level2Slug,
			installerCount
		})
		.from(geoLocations)
		.innerJoin(
			businessProfiles,
			and(
				eq(businessProfiles.countryCode, geoLocations.countryCode),
				sql`LOWER(${businessProfiles.level2}) = LOWER(${geoLocations.level2})`,
				eq(businessProfiles.isvisible, true)
			)
		)
		.where(eq(geoLocations.countryCode, country))
		.groupBy(
			geoLocations.level2,
			geoLocations.level1,
			geoLocations.level1Slug,
			geoLocations.level2Slug
		)
		.orderBy(desc(installerCount))
		.limit(limit);
	return rows;
}
