import { createPool } from '@vercel/postgres';
import { json } from '@sveltejs/kit';
import { POSTGRES_URL } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';

const pool = createPool({ connectionString: POSTGRES_URL });

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json() as { district?: string };
	const { district } = body;

	if (!district) {
		return json({ error: 'State not provided' }, { status: 400 });
	}

	try {
		const result = await pool.query<{ city: string }>(
			'SELECT DISTINCT city FROM locations WHERE district = $1 ORDER BY city ASC',
			[district]
		);

		return json({ cities: result.rows.map((row) => row.city) });
	} catch (error) {
		console.error('Database query error:', error);
		return json({ error: 'Failed to load districts' }, { status: 500 });
	}
};
