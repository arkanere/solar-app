import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { state } = await request.json();

		if (!state) {
			return json({ error: 'State is required' }, { status: 400 });
		}

		const pool = createPool({ connectionString: POSTGRES_URL });
		const result = await pool.query(
			'SELECT DISTINCT district FROM pincode_mapping WHERE state = $1 ORDER BY district ASC',
			[state]
		);

		return json({ districts: result.rows.map(r => r.district) });
	} catch (error) {
		console.error('Error fetching districts:', error);
		return json({ error: 'Failed to load districts' }, { status: 500 });
	}
}
