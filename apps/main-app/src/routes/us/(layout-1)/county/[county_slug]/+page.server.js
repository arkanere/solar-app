export const config = {
	isr: {
		expiration: 86400 // 24 hours
	}
};

import { error } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { getStateName } from '$lib/us/stateAbbreviations';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const countySlug = params.county_slug;

	if (!countySlug) {
		error(404, 'Invalid county URL');
	}

	const lastHyphenIndex = countySlug.lastIndexOf('-');

	let state, countyFormatted;

	if (lastHyphenIndex !== -1 && countySlug.substring(lastHyphenIndex + 1).length <= 2) {
		const countyPart = countySlug.substring(0, lastHyphenIndex);
		const statePart = countySlug.substring(lastHyphenIndex + 1);
		state = getStateName(statePart);

		countyFormatted = countyPart
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	} else {
		state = '';
		countyFormatted = countySlug
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	const pool = createPool({ connectionString: POSTGRES_URL });

	const citiesResult = state
		? await pool.query(
				`SELECT DISTINCT city, state
				 FROM us_locations
				 WHERE LOWER(county) = LOWER($1) AND state = $2
				 ORDER BY city ASC`,
				[countyFormatted, state]
			)
		: await pool.query(
				`SELECT DISTINCT city, state
				 FROM us_locations
				 WHERE LOWER(county) = LOWER($1)
				 ORDER BY city ASC`,
				[countyFormatted]
			);

	if (citiesResult.rows.length === 0) {
		const locationStr = state ? `${countyFormatted}, ${state}` : countyFormatted;
		error(404, `County "${locationStr}" not found`);
	}

	const resolvedState = state || citiesResult.rows[0]?.state || '';

	const businessCountResult = await pool.query(
		`SELECT 1 FROM us_businesses
		 WHERE county = $1 AND state = $2 AND isvisible = true
		 LIMIT 1`,
		[countyFormatted, resolvedState]
	);

	if (businessCountResult.rows.length === 0) {
		error(404, `No solar installers found in ${countyFormatted} County, ${resolvedState}`);
	}

	return {
		county: countyFormatted,
		state: resolvedState,
		cities: citiesResult.rows
	};
}
