export const config = {
	isr: {
		expiration: 86400 // 24 hours
	}
};

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const districtSlug = params.district_slug; // The district slug from the URL

	if (!districtSlug) {
		return {
			district: '',
			errorMessage: 'Invalid district URL format'
		};
	}

	// Format the district name properly (capitalize each word)
	const districtFormatted = districtSlug
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Query to get all cities from the specified district
		const citiesResult = await pool.query(
			`
      SELECT DISTINCT city
      FROM locations 
      WHERE LOWER(district) = LOWER($1) 
      ORDER BY city ASC
      `,
			[districtFormatted]
		);

		const cities = citiesResult.rows.map((row) => row.city);

		// Return cities from the district
		if (cities.length > 0) {
			return {
				district: districtFormatted,
				cities: cities
			};
		} else {
			// Check if the district exists in our database
			const districtCheckResult = await pool.query(
				`
        SELECT DISTINCT district
        FROM locations 
        WHERE LOWER(district) = LOWER($1) 
        LIMIT 1
        `,
				[districtFormatted]
			);

			if (districtCheckResult.rows.length > 0) {
				return {
					district: districtFormatted,
					cities: [],
					errorMessage: `No cities found in ${districtFormatted}.`
				};
			} else {
				return {
					district: districtFormatted,
					cities: [],
					errorMessage: `${districtFormatted} is not a recognized district or we don't have coverage in this area yet.`
				};
			}
		}
	} catch (error) {
		console.error('Database query error:', error);
		return {
			district: districtFormatted,
			cities: [],
			errorMessage: 'Failed to load cities'
		};
	}
}