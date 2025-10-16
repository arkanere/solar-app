export const config = {
	isr: {
		expiration: 86400 // 24 hours
	}
};

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const stateSlug = params.state_slug; // The state slug from the URL (e.g., "solar-panel-installers-in-maharashtra")

	// Extract the state name from the slug parameter directly
	let stateName = '';

	// Handle both formats: "state_slug" or fully formed "solar-panel-installers-in-state_slug"
	if (stateSlug.startsWith('solar-panel-installers-in-')) {
		stateName = stateSlug.replace('solar-panel-installers-in-', '');
	} else {
		stateName = stateSlug;
	}

	if (!stateName) {
		return {
			state: '',
			errorMessage: 'Invalid state URL format'
		};
	}

	// Format the state name properly (capitalize each word)
	const stateFormatted = stateName
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Query to get all districts from the specified state
		const districtsResult = await pool.query(
			`
      SELECT DISTINCT district
      FROM locations 
      WHERE LOWER(state) = LOWER($1) 
      ORDER BY district ASC
      `,
			[stateFormatted]
		);

		const districts = districtsResult.rows.map((row) => row.district);

		// Return districts from the state
		if (districts.length > 0) {
			return {
				state: stateFormatted,
				districts
			};
		} else {
			// Check if the state exists in our database
			const stateCheckResult = await pool.query(
				`
        SELECT DISTINCT state 
        FROM locations 
        WHERE LOWER(state) = LOWER($1) 
        LIMIT 1
        `,
				[stateFormatted]
			);

			if (stateCheckResult.rows.length > 0) {
				return {
					state: stateFormatted,
					errorMessage: `No districts found in ${stateFormatted}.`
				};
			} else {
				return {
					state: stateFormatted,
					errorMessage: `${stateFormatted} is not a recognized state or we don't have coverage in this area yet.`
				};
			}
		}
	} catch (error) {
		console.error('Database query error:', error);
		return {
			state: stateFormatted,
			errorMessage: 'Failed to load solar panel installers'
		};
	}
}
