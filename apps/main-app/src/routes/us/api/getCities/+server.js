// src/routes/api/us/getCities/+server.js

import { createPool } from '@vercel/postgres';
import { json } from '@sveltejs/kit';
import { POSTGRES_URL } from '$env/static/private';

const pool = createPool({ connectionString: POSTGRES_URL });

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
	// Extract the county/district from the request body (supporting both for compatibility)
	const { county, district } = await request.json();
	const countyValue = county || district;

	if (!countyValue) {
		return json({ error: 'County/District not provided' }, { status: 400 });
	}

	try {
		// Query the database for cities based on the county
		const result = await pool.query(
			'SELECT DISTINCT city FROM us_locations WHERE LOWER(county) = LOWER($1) ORDER BY city ASC',
			[countyValue]
		);

		// Return the cities in JSON format
		return json({ cities: result.rows.map((row) => row.city) });
	} catch (error) {
		console.error('Database query error:', error);
		return json({ error: 'Failed to load cities' }, { status: 500 });
	}
}
