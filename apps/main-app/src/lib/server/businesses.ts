// Country-agnostic business queries against the unified businesses table
// (migration 043). Profile data only — auth lives elsewhere.

import { db } from './db';
import { businessProfiles } from '@solar/db/schema';
import { and, asc, eq, sql } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';
import type { CountryCode } from '$lib/countries';

export interface Business {
	id: number;
	sourceId: number;
	slug: string | null;
	businessname: string;
	email: string | null;
	phonenumber: string | null;
	whatsapp: string | null;
	description: string | null;
	website: string | null;
	instagramId: string | null;
	googleMapsLink: string | null;
	address: string | null;
	pluscode: string | null;
	services: number[] | null;
	brands: number[] | null;
	level1: string | null;
	level2: string | null;
	city: string | null;
	postalCode: string | null;
	rscore: number | null;
	tag: string | null;
	tier3: boolean | null;
}

// Drizzle infers the Business shape from this map, so the hand-written
// mapBusiness() row mapper is gone. `businessname` is nullable in the schema
// but every consumer treats it as required — the old mapper asserted it the
// same way (`r.businessname as string`), so the wrapper preserves that
// contract rather than widening the interface.
const BUSINESS_SELECTION = {
	id: businessProfiles.id,
	sourceId: businessProfiles.businessId,
	slug: businessProfiles.slug,
	businessname: sql<string>`${businessProfiles.businessname}`,
	email: businessProfiles.email,
	phonenumber: businessProfiles.phonenumber,
	whatsapp: businessProfiles.whatsapp,
	description: businessProfiles.description,
	website: businessProfiles.website,
	instagramId: businessProfiles.instagramId,
	googleMapsLink: businessProfiles.googleMapsLink,
	address: businessProfiles.address,
	pluscode: businessProfiles.pluscode,
	services: businessProfiles.services,
	brands: businessProfiles.brands,
	level1: businessProfiles.level1,
	level2: businessProfiles.level2,
	city: businessProfiles.city,
	postalCode: businessProfiles.postalCode,
	rscore: businessProfiles.rscore,
	tag: businessProfiles.tag,
	tier3: businessProfiles.tier3
};

// `LOWER(col) = LOWER($n)` on both sides, and `NULLS LAST`, have no query
// builder equivalent — both stay on the sql escape hatch.
const lower = (col: PgColumn, value: string) => sql`LOWER(${col}) = LOWER(${value})`;

const RSCORE_DESC = sql`${businessProfiles.rscore} DESC NULLS LAST`;

// The geo directory pages (solar/[state]/[district] and its [slug] leaf) ship
// installer cards straight to the client, so this one keeps the table's
// snake_case names — a different wire shape from Business above.
export const BUSINESS_CARD_SELECTION = {
	businessname: businessProfiles.businessname,
	description: businessProfiles.description,
	phonenumber: businessProfiles.phonenumber,
	slug: businessProfiles.slug,
	address: businessProfiles.address,
	pluscode: businessProfiles.pluscode,
	state: businessProfiles.level1,
	city: businessProfiles.city,
	tag: businessProfiles.tag,
	rscore: businessProfiles.rscore,
	businessfilled: businessProfiles.businessfilled,
	services: businessProfiles.services
};

export async function getBusinessBySlug(
	country: CountryCode,
	slug: string
): Promise<Business | null> {
	const rows = await db
		.select(BUSINESS_SELECTION)
		.from(businessProfiles)
		.where(
			and(
				eq(businessProfiles.countryCode, country),
				eq(businessProfiles.slug, slug),
				eq(businessProfiles.isvisible, true)
			)
		)
		.orderBy(RSCORE_DESC)
		.limit(1);
	return rows[0] ?? null;
}

export async function getBusinessesByLevel2(
	country: CountryCode,
	level2: string,
	level1?: string
): Promise<Business[]> {
	return db
		.select(BUSINESS_SELECTION)
		.from(businessProfiles)
		.where(
			and(
				eq(businessProfiles.countryCode, country),
				lower(businessProfiles.level2, level2),
				level1 ? lower(businessProfiles.level1, level1) : undefined,
				eq(businessProfiles.isvisible, true)
			)
		)
		.orderBy(RSCORE_DESC, asc(businessProfiles.businessname));
}

export async function getBusinessesByCity(
	country: CountryCode,
	city: string,
	level2?: string
): Promise<Business[]> {
	return db
		.select(BUSINESS_SELECTION)
		.from(businessProfiles)
		.where(
			and(
				eq(businessProfiles.countryCode, country),
				lower(businessProfiles.city, city),
				level2 ? lower(businessProfiles.level2, level2) : undefined,
				eq(businessProfiles.isvisible, true)
			)
		)
		.orderBy(RSCORE_DESC, asc(businessProfiles.businessname));
}

export async function hasBusinessesInLevel2(
	country: CountryCode,
	level2: string,
	level1?: string
): Promise<boolean> {
	const rows = await db
		.select({ one: sql`1` })
		.from(businessProfiles)
		.where(
			and(
				eq(businessProfiles.countryCode, country),
				lower(businessProfiles.level2, level2),
				level1 ? lower(businessProfiles.level1, level1) : undefined,
				eq(businessProfiles.isvisible, true)
			)
		)
		.limit(1);
	return rows.length > 0;
}
