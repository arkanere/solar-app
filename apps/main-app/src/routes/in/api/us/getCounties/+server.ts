import { createPool, type VercelPool } from '@vercel/postgres';
import { json, type RequestHandler } from '@sveltejs/kit';
import { POSTGRES_URL } from '$env/static/private';

interface CountiesRequest {
	state: string;
	timestamp?: number;
}

interface CountyRow {
	county: string;
}

const pool: VercelPool = createPool({ connectionString: POSTGRES_URL });

export const POST: RequestHandler = async ({ request }) => {
	const { state, timestamp } = await request.json() as CountiesRequest;

	if (!state) {
		return json({ error: 'State not provided' }, { status: 400 });
	}

	try {
		const result = await pool.query<CountyRow>(
			'SELECT DISTINCT county FROM us_locations WHERE state = $1 ORDER BY county ASC',
			[state]
		);

		const response = json({ 
			counties: result.rows.map((row) => row.county),
			timestamp: timestamp || Date.now()
		});

		response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
		response.headers.set('Pragma', 'no-cache');
		response.headers.set('Expires', '0');

		return response;
	} catch (error) {
		console.error('Database query error:', error);
		return json({ error: 'Failed to load counties' }, { status: 500 });
	}
};
