export const config = {
	isr: {
		expiration: 86400 // 24 hours
	}
};

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { getStateName } from '$lib/us/stateAbbreviations';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const countySlug = params.county_slug; // The county-state from the URL (e.g., "butler-al")

	if (!countySlug) {
		return {
			county: '',
			state: '',
			errorMessage: 'Invalid county URL format'
		};
	}

	// Parse county and state from the slug
	// Format: "butler-al" or "jefferson-county-al" (last part after final hyphen is state abbreviation)
	const lastHyphenIndex = countySlug.lastIndexOf('-');

	let countyPart, statePart, state, countyFormatted;

	// Check if last segment looks like a state abbreviation (2 characters)
	if (lastHyphenIndex !== -1 && countySlug.substring(lastHyphenIndex + 1).length <= 2) {
		// New format: county-state (e.g., "butler-al" or "butler-county-al")
		countyPart = countySlug.substring(0, lastHyphenIndex);
		statePart = countySlug.substring(lastHyphenIndex + 1);
		state = getStateName(statePart);

		// Format the county name properly (capitalize each word)
		countyFormatted = countyPart
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	} else {
		// Old format: just county name (backward compatibility)
		state = '';
		countyFormatted = countySlug
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Query to get all cities with state from the specified county (using us_locations table)
		let citiesResult;

		if (state) {
			// New behavior: Query using both county and state for precise matching
			citiesResult = await pool.query(
				`
				SELECT DISTINCT city, state
				FROM us_locations
				WHERE LOWER(county) = LOWER($1) AND state = $2
				ORDER BY city ASC
				`,
				[countyFormatted, state]
			);
		} else {
			// Old behavior: Query using only county name (backward compatibility)
			citiesResult = await pool.query(
				`
				SELECT DISTINCT city, state
				FROM us_locations
				WHERE LOWER(county) = LOWER($1)
				ORDER BY city ASC
				`,
				[countyFormatted]
			);
		}

		const cities = citiesResult.rows;

		// Return cities from the county
		if (cities.length > 0) {
			return {
				county: countyFormatted,
				state: state || cities[0]?.state || '',
				cities: cities
			};
		} else {
			// Check if the county exists in our database
			let countyCheckResult;

			if (state) {
				countyCheckResult = await pool.query(
					`
					SELECT DISTINCT county, state
					FROM us_locations
					WHERE LOWER(county) = LOWER($1) AND state = $2
					LIMIT 1
					`,
					[countyFormatted, state]
				);
			} else {
				countyCheckResult = await pool.query(
					`
					SELECT DISTINCT county, state
					FROM us_locations
					WHERE LOWER(county) = LOWER($1)
					LIMIT 1
					`,
					[countyFormatted]
				);
			}

			const locationStr = state ? `${countyFormatted}, ${state}` : countyFormatted;

			if (countyCheckResult.rows.length > 0) {
				return {
					county: countyFormatted,
					state: state || countyCheckResult.rows[0]?.state || '',
					cities: [],
					errorMessage: `No cities found in ${locationStr}.`
				};
			} else {
				return {
					county: countyFormatted,
					state: state,
					cities: [],
					errorMessage: `${locationStr} is not a recognized county or we don't have coverage in this area yet.`
				};
			}
		}
	} catch (error) {
		console.error('Database query error:', error);
		return {
			county: countyFormatted,
			state: state,
			cities: [],
			errorMessage: 'Failed to load cities'
		};
	}
}
