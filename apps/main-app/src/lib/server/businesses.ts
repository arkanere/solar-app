// Country-agnostic business queries against the unified businesses table
// (migration 043). Profile data only — auth lives elsewhere.

import { db } from './db';
import { businesses } from '@solar/db/schema';
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
	id: businesses.id,
	sourceId: businesses.sourceId,
	slug: businesses.slug,
	businessname: sql<string>`${businesses.businessname}`,
	email: businesses.email,
	phonenumber: businesses.phonenumber,
	whatsapp: businesses.whatsapp,
	description: businesses.description,
	website: businesses.website,
	instagramId: businesses.instagramId,
	googleMapsLink: businesses.googleMapsLink,
	address: businesses.address,
	pluscode: businesses.pluscode,
	services: businesses.services,
	brands: businesses.brands,
	level1: businesses.level1,
	level2: businesses.level2,
	city: businesses.city,
	postalCode: businesses.postalCode,
	rscore: businesses.rscore,
	tag: businesses.tag,
	tier3: businesses.tier3
};

// `LOWER(col) = LOWER($n)` on both sides, and `NULLS LAST`, have no query
// builder equivalent — both stay on the sql escape hatch.
const lower = (col: PgColumn, value: string) => sql`LOWER(${col}) = LOWER(${value})`;

const RSCORE_DESC = sql`${businesses.rscore} DESC NULLS LAST`;

export async function getBusinessBySlug(
	country: CountryCode,
	slug: string
): Promise<Business | null> {
	const rows = await db
		.select(BUSINESS_SELECTION)
		.from(businesses)
		.where(
			and(
				eq(businesses.countryCode, country),
				eq(businesses.slug, slug),
				eq(businesses.isvisible, true)
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
		.from(businesses)
		.where(
			and(
				eq(businesses.countryCode, country),
				lower(businesses.level2, level2),
				level1 ? lower(businesses.level1, level1) : undefined,
				eq(businesses.isvisible, true)
			)
		)
		.orderBy(RSCORE_DESC, asc(businesses.businessname));
}

export async function getBusinessesByCity(
	country: CountryCode,
	city: string,
	level2?: string
): Promise<Business[]> {
	return db
		.select(BUSINESS_SELECTION)
		.from(businesses)
		.where(
			and(
				eq(businesses.countryCode, country),
				lower(businesses.city, city),
				level2 ? lower(businesses.level2, level2) : undefined,
				eq(businesses.isvisible, true)
			)
		)
		.orderBy(RSCORE_DESC, asc(businesses.businessname));
}

export async function hasBusinessesInLevel2(
	country: CountryCode,
	level2: string,
	level1?: string
): Promise<boolean> {
	const rows = await db
		.select({ one: sql`1` })
		.from(businesses)
		.where(
			and(
				eq(businesses.countryCode, country),
				lower(businesses.level2, level2),
				level1 ? lower(businesses.level1, level1) : undefined,
				eq(businesses.isvisible, true)
			)
		)
		.limit(1);
	return rows.length > 0;
}
