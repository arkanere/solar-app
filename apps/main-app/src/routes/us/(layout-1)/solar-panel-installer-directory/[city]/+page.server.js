export const config = {
	isr: {
		expiration: 604800 // 7 days
	}
};

import { error } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { parseCityStateParam } from '$lib/us/stateAbbreviations';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const cityStateParam = params.city;

	const { city: cityFromSlug, state } = parseCityStateParam(cityStateParam);
	const citySlug = cityFromSlug.toLowerCase().replace(/\s+/g, '-');

	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const countyResult = await pool.query(
			`SELECT county, city, state
			FROM us_locations
			WHERE LOWER(REGEXP_REPLACE(city, '\\s+', '-', 'g')) = $1 AND state = $2
			LIMIT 1`,
			[citySlug, state]
		);

		if (countyResult.rows.length === 0) {
			error(404, { message: `No location found for "${cityFromSlug}, ${state}"` });
		}

		const city = countyResult.rows[0].city;
		const county = countyResult.rows[0].county;
		const matchedState = countyResult.rows[0].state;

		const districtBusinessesResult = await pool.query(
			`SELECT businessname, description, phonenumber, slug, address, pluscode, state, city, county, tag, rscore, businessfilled, tier3, services
			FROM us_businesses
			WHERE county = $1 AND state = $2 AND isvisible = true
			ORDER BY
				CASE WHEN LOWER(city) = LOWER($3) THEN 0 ELSE 1 END,
				businessfilled DESC,
				tier3 DESC,
				rscore DESC`,
			[county, matchedState, city]
		);

		const businesses = districtBusinessesResult.rows;

		const citiesResult = await pool.query(
			`SELECT DISTINCT city, state
			FROM us_locations
			WHERE county = $1 AND state = $2
			ORDER BY city ASC`,
			[county, matchedState]
		);

		const subset_cities_localities = citiesResult.rows.map((row) => row.city);

		const projectsResult = await pool.query(
			`SELECT
				id,
				business_slug,
				project_slug,
				title,
				pincode,
				project_date,
				created_at,
				image_url,
				cloudinary_public_id,
				image_width,
				image_height,
				image_format,
				district
			FROM projects
			WHERE district = $1 AND isvisible = true
			ORDER BY
				project_date DESC,
				created_at DESC
			LIMIT 6`,
			[county]
		);

		const recentProjects = projectsResult.rows;

		if (businesses.length > 0) {
			return {
				city,
				state: matchedState,
				county,
				businesses,
				subset_cities_localities,
				recentProjects,
				lastUpdated: new Date().toISOString()
			};
		} else {
			return {
				city,
				state: matchedState,
				county,
				subset_cities_localities,
				recentProjects,
				lastUpdated: new Date().toISOString(),
				errorMessage: `No businesses found in ${city}, ${matchedState} or its county: ${county}.`
			};
		}
	} catch (err) {
		console.error('Database query error:', err);
		return {
			city: cityFromSlug,
			state,
			errorMessage: 'Failed to load businesses',
			subset_cities_localities: [],
			county: '',
			recentProjects: [],
			lastUpdated: new Date().toISOString()
		};
	}
}
