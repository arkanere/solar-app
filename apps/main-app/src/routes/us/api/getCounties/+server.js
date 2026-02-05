// src/routes/api/us/getCounties/+server.js

import { createPool } from '@vercel/postgres';
import { json } from '@sveltejs/kit';
import { POSTGRES_URL } from '$env/static/private';

const pool = createPool({ connectionString: POSTGRES_URL });

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
	// Extract the state from the request body
	const { state, timestamp } = await request.json();

	if (!state) {
		return json({ error: 'State not provided' }, { status: 400 });
	}

	try {
		// Query the database for counties based on the state
		const result = await pool.query(
			'SELECT DISTINCT county FROM us_locations WHERE state = $1 ORDER BY county ASC',
			[state]
		);

		const countiesData = result.rows.map((row) => row.county);

		// Return the counties in JSON format with cache control headers
		const response = json({
			counties: countiesData,
			districts: countiesData, // Also include as 'districts' for backward compatibility
			timestamp: timestamp || Date.now()
		});

		// Add headers to prevent caching
		response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
		response.headers.set('Pragma', 'no-cache');
		response.headers.set('Expires', '0');

		return response;
	} catch (error) {
		console.error('Database query error:', error);
		return json({ error: 'Failed to load counties' }, { status: 500 });
	}
}
