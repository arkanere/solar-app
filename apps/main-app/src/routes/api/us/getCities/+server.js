// src/routes/api/us/getCities/+server.js

import { createPool } from '@vercel/postgres';
import { json } from '@sveltejs/kit';
import { POSTGRES_URL } from '$env/static/private';

const pool = createPool({ connectionString: POSTGRES_URL });

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
	// Extract the county from the request body
	const { county } = await request.json();

	if (!county) {
		return json({ error: 'County not provided' }, { status: 400 });
	}

	try {
		// Query the database for cities based on the county
		const result = await pool.query(
			'SELECT DISTINCT city FROM us_locations WHERE county = $1 ORDER BY city ASC',
			[county]
		);

		// Return the cities in JSON format
		return json({ cities: result.rows.map((row) => row.city) });
	} catch (error) {
		console.error('Database query error:', error);
		return json({ error: 'Failed to load cities' }, { status: 500 });
	}
}