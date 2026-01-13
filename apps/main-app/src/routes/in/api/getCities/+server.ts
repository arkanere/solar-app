import { createPool } from '@vercel/postgres';
import { json, type RequestHandler } from '@sveltejs/kit';
import { POSTGRES_URL } from '$env/static/private';

interface GetCitiesRequest {
	district: string;
}

const pool = createPool({ connectionString: POSTGRES_URL });

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { district }: GetCitiesRequest = await request.json();

		if (!district) {
			return json({ error: 'District not provided' }, { status: 400 });
		}

		const result = await pool.query(
			'SELECT DISTINCT city FROM locations WHERE district = $1 ORDER BY city ASC',
			[district]
		);

		return json({ cities: result.rows.map((row) => row.city) });
	} catch (error) {
		console.error('Database query error:', error);
		return json({ error: 'Failed to load cities' }, { status: 500 });
	}
};
