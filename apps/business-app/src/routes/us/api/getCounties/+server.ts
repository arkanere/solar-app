import { createPool } from '@vercel/postgres';
import { json } from '@sveltejs/kit';
import { POSTGRES_URL } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';

const pool = createPool({ connectionString: POSTGRES_URL });

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json() as { state?: string; timestamp?: number };
	const { state, timestamp } = body;

	if (!state) {
		return json({ error: 'State not provided' }, { status: 400 });
	}

	try {
		const result = await pool.query<{ county: string }>(
			'SELECT DISTINCT county FROM us_locations WHERE state = $1 ORDER BY county ASC',
			[state]
		);

		const countiesData = result.rows.map((row) => row.county);

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
};
