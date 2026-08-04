import { pool } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';


export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json() as { state?: string; timestamp?: number };
	const { state, timestamp } = body;

	if (!state) {
		return json({ error: 'State not provided' }, { status: 400 });
	}

	try {
		const result = await pool.query<{ district: string }>(
			'SELECT DISTINCT district FROM locations WHERE state = $1 ORDER BY district ASC',
			[state]
		);

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
};
