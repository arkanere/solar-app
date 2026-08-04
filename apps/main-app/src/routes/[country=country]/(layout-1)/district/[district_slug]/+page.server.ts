import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { locations } from '@solar/db/schema';
import { sql } from 'drizzle-orm';
import { geoUrl } from '$lib/countries/urls';

export const config = {
	isr: { expiration: 2592000 }
};

export const load: PageServerLoad = async ({ params }) => {
	// This shim resolves legacy /district/{slug} URLs against the IN-only
	// `locations` table, so it only means anything for IN. Gate before the
	// lookup: without this, /us/district/{slug} would resolve a US slug against
	// Indian rows. (svelte-check cannot catch a missing gate — hazard 7.)
	if (params.country !== 'in') {
		error(404, 'Not found');
	}

	const districtSlug = params.district_slug?.toLowerCase();

	if (!districtSlug) {
		error(404, 'Invalid district URL');
	}

	// LOWER(REPLACE(...)) has no query builder equivalent — sql escape hatch.
	const rows = await db
		.selectDistinct({ state: locations.state, district: locations.district })
		.from(locations)
		.where(sql`LOWER(REPLACE(${locations.district}, ' ', '-')) = ${districtSlug}`)
		.limit(1);

	if (rows.length === 0) {
		error(404, { message: `No district found for "${districtSlug}"` });
	}

	const { state, district } = rows[0];
	const stateSlug = (state as string).toLowerCase().replace(/\s+/g, '-');
	const newDistrictSlug = (district as string).toLowerCase().replace(/\s+/g, '-');

	redirect(301, geoUrl(params.country, stateSlug, newDistrictSlug));
};
