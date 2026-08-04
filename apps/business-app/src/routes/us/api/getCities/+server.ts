import { pool } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';


export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json() as { county?: string; district?: string };
	const { county, district } = body;
	const countyValue = county || district;

	if (!countyValue) {
		return json({ error: 'County/District not provided' }, { status: 400 });
	}

	try {
		const result = await pool.query<{ city: string }>(
			'SELECT DISTINCT city FROM us_locations WHERE LOWER(county) = LOWER($1) ORDER BY city ASC',
			[countyValue]
		);

		return json({ cities: result.rows.map((row) => row.city) });
	} catch (error) {
		console.error('Database query error:', error);
		return json({ error: 'Failed to load cities' }, { status: 500 });
	}
};
