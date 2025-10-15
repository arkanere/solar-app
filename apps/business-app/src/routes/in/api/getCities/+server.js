// src/routes/api/getCities/+server.js

import { createPool } from '@vercel/postgres';
import { json } from '@sveltejs/kit';
import { POSTGRES_URL } from '$env/static/private';

const pool = createPool({ connectionString: POSTGRES_URL });

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
	// Extract the state from the request body
	const { district } = await request.json();

	if (!district) {
		return json({ error: 'State not provided' }, { status: 400 });
	}

	try {
		// Query the database for districts based on the state
		const result = await pool.query(
			'SELECT DISTINCT city FROM locations WHERE district = $1 ORDER BY city ASC',
			[district]
		);

		// Return the cities in JSON format
		return json({ cities: result.rows.map((row) => row.city) });
	} catch (error) {
		console.error('Database query error:', error);
		return json({ error: 'Failed to load districts' }, { status: 500 });
	}
}
