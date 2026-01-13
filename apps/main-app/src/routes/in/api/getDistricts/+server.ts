// src/routes/api/getDistricts/+server.js

import { createPool } from '@vercel/postgres';
import { json, type RequestHandler } from '@sveltejs/kit';
import { POSTGRES_URL } from '$env/static/private';

const pool = createPool({ connectionString: POSTGRES_URL });

export const POST: RequestHandler = async ({ request }) => {
	// Extract the state from the request body
	const { state, timestamp } = await request.json();

	if (!state) {
		return json({ error: 'State not provided' }, { status: 400 });
	}

	try {
		// Query the database for districts based on the state
		const result = await pool.query(
			'SELECT DISTINCT district FROM locations WHERE state = $1 ORDER BY district ASC',
			[state]
		);

		// Return the districts in JSON format with cache control headers
		const response = json({ 
			districts: result.rows.map((row) => row.district),
			timestamp: timestamp || Date.now()
		});

		// Add headers to prevent caching
		response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
		response.headers.set('Pragma', 'no-cache');
		response.headers.set('Expires', '0');

		return response;
	} catch (error) {
		console.error('Database query error:', error);
		return json({ error: 'Failed to load districts' }, { status: 500 });
	}
}
