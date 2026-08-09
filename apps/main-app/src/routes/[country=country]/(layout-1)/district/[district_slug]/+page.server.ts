import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { geoLocations } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';
import { geoUrl } from '$lib/countries/urls';

export const config = {
	isr: { expiration: 2592000 }
};

export const load: PageServerLoad = async ({ params }) => {
	// This shim resolves legacy /district/{slug} URLs against IN geography, so
	// it only means anything for IN. Gate before the lookup: without this,
	// /us/district/{slug} would resolve a US slug against Indian rows.
	// (svelte-check cannot catch a missing gate — hazard 7.)
	if (params.country !== 'in') {
		error(404, 'Not found');
	}

	const districtSlug = params.district_slug?.toLowerCase();

	if (!districtSlug) {
		error(404, 'Invalid district URL');
	}

	// geo_locations carries the precomputed slugs, so this is an exact indexed
	// lookup rather than the LOWER(REPLACE(...)) scan it replaces.
	const rows = await db
		.selectDistinct({ stateSlug: geoLocations.level1Slug, districtSlug: geoLocations.level2Slug })
		.from(geoLocations)
		.where(and(eq(geoLocations.countryCode, 'in'), eq(geoLocations.level2Slug, districtSlug)))
		.limit(1);

	if (rows.length === 0) {
		error(404, { message: `No district found for "${districtSlug}"` });
	}

	redirect(301, geoUrl(params.country, rows[0].stateSlug, rows[0].districtSlug));
};
