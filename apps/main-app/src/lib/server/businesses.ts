// Country-agnostic business queries against the unified businesses table
// (migration 043). Profile data only — auth lives elsewhere.

import { pool } from './db';
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

const BUSINESS_COLUMNS = `
	id, source_id, slug, businessname, email, phonenumber, whatsapp,
	description, website, instagram_id, google_maps_link, address, pluscode,
	services, brands, level1, level2, city, postal_code, rscore, tag, tier3
`;

function mapBusiness(r: Record<string, unknown>): Business {
	return {
		id: r.id as number,
		sourceId: r.source_id as number,
		slug: r.slug as string | null,
		businessname: r.businessname as string,
		email: r.email as string | null,
		phonenumber: r.phonenumber as string | null,
		whatsapp: r.whatsapp as string | null,
		description: r.description as string | null,
		website: r.website as string | null,
		instagramId: r.instagram_id as string | null,
		googleMapsLink: r.google_maps_link as string | null,
		address: r.address as string | null,
		pluscode: r.pluscode as string | null,
		services: r.services as number[] | null,
		brands: r.brands as number[] | null,
		level1: r.level1 as string | null,
		level2: r.level2 as string | null,
		city: r.city as string | null,
		postalCode: r.postal_code as string | null,
		rscore: r.rscore as number | null,
		tag: r.tag as string | null,
		tier3: r.tier3 as boolean | null
	};
}

export async function getBusinessBySlug(
	country: CountryCode,
	slug: string
): Promise<Business | null> {
	const result = await pool.query(
		`SELECT ${BUSINESS_COLUMNS} FROM businesses
		 WHERE country_code = $1 AND slug = $2 AND isvisible = true
		 ORDER BY rscore DESC NULLS LAST
		 LIMIT 1`,
		[country, slug]
	);
	return result.rows.length > 0 ? mapBusiness(result.rows[0]) : null;
}

export async function getBusinessesByLevel2(
	country: CountryCode,
	level2: string,
	level1?: string
): Promise<Business[]> {
	const result = level1
		? await pool.query(
				`SELECT ${BUSINESS_COLUMNS} FROM businesses
				 WHERE country_code = $1 AND LOWER(level2) = LOWER($2)
				   AND LOWER(level1) = LOWER($3) AND isvisible = true
				 ORDER BY rscore DESC NULLS LAST, businessname ASC`,
				[country, level2, level1]
			)
		: await pool.query(
				`SELECT ${BUSINESS_COLUMNS} FROM businesses
				 WHERE country_code = $1 AND LOWER(level2) = LOWER($2) AND isvisible = true
				 ORDER BY rscore DESC NULLS LAST, businessname ASC`,
				[country, level2]
			);
	return result.rows.map(mapBusiness);
}

export async function getBusinessesByCity(
	country: CountryCode,
	city: string,
	level2?: string
): Promise<Business[]> {
	const result = level2
		? await pool.query(
				`SELECT ${BUSINESS_COLUMNS} FROM businesses
				 WHERE country_code = $1 AND LOWER(city) = LOWER($2)
				   AND LOWER(level2) = LOWER($3) AND isvisible = true
				 ORDER BY rscore DESC NULLS LAST, businessname ASC`,
				[country, city, level2]
			)
		: await pool.query(
				`SELECT ${BUSINESS_COLUMNS} FROM businesses
				 WHERE country_code = $1 AND LOWER(city) = LOWER($2) AND isvisible = true
				 ORDER BY rscore DESC NULLS LAST, businessname ASC`,
				[country, city]
			);
	return result.rows.map(mapBusiness);
}

export async function hasBusinessesInLevel2(
	country: CountryCode,
	level2: string,
	level1?: string
): Promise<boolean> {
	const result = level1
		? await pool.query(
				`SELECT 1 FROM businesses
				 WHERE country_code = $1 AND LOWER(level2) = LOWER($2)
				   AND LOWER(level1) = LOWER($3) AND isvisible = true
				 LIMIT 1`,
				[country, level2, level1]
			)
		: await pool.query(
				`SELECT 1 FROM businesses
				 WHERE country_code = $1 AND LOWER(level2) = LOWER($2) AND isvisible = true
				 LIMIT 1`,
				[country, level2]
			);
	return result.rows.length > 0;
}
