export const config = {
	isr: {
		expiration: 604800 // 7 days
	}
};

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { parseCityStateParam } from '$lib/us/stateAbbreviations';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const cityStateParam = params.city; // The city-state from the URL (e.g., "greenville-al")

	// Parse the city and state from the URL parameter
	const { city, state } = parseCityStateParam(cityStateParam);

	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Determine which query to use based on whether state was provided
		let countyResult;

		if (state) {
			// New behavior: Query using both city and state for precise matching
			countyResult = await pool.query(
				`
				SELECT county, city, state
				FROM us_locations
				WHERE LOWER(city) = LOWER($1) AND state = $2
				LIMIT 1
				`,
				[city, state]
			);
		} else {
			// Fallback: Old behavior for backward compatibility (no state provided)
			countyResult = await pool.query(
				`
				SELECT district as county, city
				FROM locations
				WHERE LOWER(city) = LOWER($1)
				LIMIT 1
				`,
				[city]
			);
		}

		// If no location is found, return an error message
		if (countyResult.rows.length === 0) {
			const locationStr = state ? `${city}, ${state}` : city;
			return {
				city,
				state,
				errorMessage: `No businesses found in ${locationStr}.`,
				subset_cities_localities: [],
				county: '',
				district: '',
				recentProjects: [],
				lastUpdated: new Date().toISOString()
			};
		}

		const county = countyResult.rows[0].county;
		const matchedState = countyResult.rows[0].state || state;
		// For backward compatibility, also set district
		const district = county;

		// Modified query: Sort businesses from the requested city to the top,
		// then apply the existing sorting criteria within each group
		let districtBusinessesResult;

		if (state) {
			// Use us_businesses table with county AND state filter for precise matching
			districtBusinessesResult = await pool.query(
				`SELECT businessname, description, phonenumber, slug, address, pluscode, state, city, county, tag, rscore, businessfilled, tier3, services
				FROM us_businesses
				WHERE county = $1 AND state = $2 AND isvisible = true
				ORDER BY
					CASE WHEN LOWER(city) = LOWER($3) THEN 0 ELSE 1 END, -- Sort businesses from selected city first
					businessfilled DESC,
					tier3 DESC,
					rscore DESC`,
				[county, matchedState, city]
			);
		} else {
			// Fallback to old table for backward compatibility
			districtBusinessesResult = await pool.query(
				`SELECT businessname, description, phonenumber, slug, address, pluscode, state, city, tag, rscore, businessfilled, tier3, services
				FROM businesses_1
				WHERE district = $1 AND isvisible = true
				ORDER BY
					CASE WHEN LOWER(city) = LOWER($2) THEN 0 ELSE 1 END, -- Sort businesses from selected city first
					businessfilled DESC,
					tier3 DESC,
					rscore DESC`,
				[district, city]
			);
		}

		const businesses = districtBusinessesResult.rows;

		// Fetch all cities in the same county/district
		let citiesResult;

		if (state) {
			// Get cities from us_locations with state filter for precise matching
			citiesResult = await pool.query(
				`SELECT DISTINCT city, state
				FROM us_locations
				WHERE county = $1 AND state = $2
				ORDER BY city ASC`,
				[county, matchedState]
			);
		} else {
			// Fallback to old table
			citiesResult = await pool.query(
				`SELECT DISTINCT city
				FROM locations
				WHERE district = $1
				ORDER BY city ASC`,
				[district]
			);
		}

		const subset_cities_localities = citiesResult.rows.map((row) => row.city);

		// Fetch recent projects for the district
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
			[district]
		);

		const recentProjects = projectsResult.rows;

		// Return businesses from the county/district along with location data, cities, and projects
		if (businesses.length > 0) {
			return {
				city,
				state: matchedState,
				county,
				district, // For backward compatibility
				businesses,
				subset_cities_localities,
				recentProjects,
				lastUpdated: new Date().toISOString()
			};
		} else {
			const locationStr = matchedState ? `${city}, ${matchedState}` : city;
			const countyStr = county || district;
			return {
				city,
				state: matchedState,
				county,
				district, // For backward compatibility
				subset_cities_localities,
				recentProjects,
				lastUpdated: new Date().toISOString(),
				errorMessage: `No businesses found in ${locationStr} or its county: ${countyStr}.`
			};
		}
	} catch (error) {
		console.error('Database query error:', error);
		return {
			city,
			state,
			errorMessage: 'Failed to load businesses',
			subset_cities_localities: [],
			county: '',
			district: '',
			recentProjects: [],
			lastUpdated: new Date().toISOString()
		};
	}
}
