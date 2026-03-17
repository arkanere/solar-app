import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

export const config = {
	isr: { expiration: 2592000 }
};

export const load: PageServerLoad = async ({ params }) => {
	const citySlug = params.city.toLowerCase();

	const result = await pool.query(
		`SELECT city, district, state
		 FROM locations
		 WHERE LOWER(REGEXP_REPLACE(city, '\\s+', '-', 'g')) = $1
		 LIMIT 1`,
		[citySlug]
	);

	if (result.rows.length === 0) {
		error(404, { message: `No location found for "${citySlug}"` });
	}

	const { city, district, state } = result.rows[0];
	const stateSlug = state.toLowerCase().replace(/\s+/g, '-');
	const districtSlug = district.toLowerCase().replace(/\s+/g, '-');
	const newCitySlug = city.toLowerCase().replace(/\s+/g, '-');

	redirect(301, `/in/solar/${stateSlug}/${districtSlug}/${newCitySlug}`);
};
