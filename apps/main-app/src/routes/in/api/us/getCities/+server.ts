import { createPool, type VercelPool } from '@vercel/postgres';
import { json, type RequestHandler } from '@sveltejs/kit';
import { POSTGRES_URL } from '$env/static/private';

interface CountyRequest {
	county: string;
}

interface CityRow {
	city: string;
}

const pool: VercelPool = createPool({ connectionString: POSTGRES_URL });

export const POST: RequestHandler = async ({ request }) => {
	const { county } = await request.json() as CountyRequest;

	if (!county) {
		return json({ error: 'County not provided' }, { status: 400 });
	}

	try {
		const result = await pool.query<CityRow>(
			'SELECT DISTINCT city FROM us_locations WHERE county = $1 ORDER BY city ASC',
			[county]
		);

		return json({ cities: result.rows.map((row) => row.city) });
	} catch (error) {
		console.error('Database query error:', error);
		return json({ error: 'Failed to load cities' }, { status: 500 });
	}
};
