import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { pool } from '$lib/server/db';
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

	const result = await pool.query(
		`SELECT DISTINCT state, district
		 FROM locations
		 WHERE LOWER(REPLACE(district, ' ', '-')) = $1
		 LIMIT 1`,
		[districtSlug]
	);

	if (result.rows.length === 0) {
		error(404, { message: `No district found for "${districtSlug}"` });
	}

	const { state, district } = result.rows[0];
	const stateSlug = state.toLowerCase().replace(/\s+/g, '-');
	const newDistrictSlug = district.toLowerCase().replace(/\s+/g, '-');

	redirect(301, geoUrl(params.country, stateSlug, newDistrictSlug));
};
