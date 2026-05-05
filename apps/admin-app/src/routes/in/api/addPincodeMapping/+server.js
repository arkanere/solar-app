import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { pincode, district, state } = await request.json();

		if (!pincode || !district || !state) {
			return json({ success: false, error: 'Pincode, district, and state are required' }, { status: 400 });
		}

		const pool = createPool({ connectionString: POSTGRES_URL });

		const existing = await pool.query(
			'SELECT pincode FROM pincode_mapping WHERE pincode = $1 LIMIT 1',
			[pincode]
		);

		if (existing.rows.length > 0) {
			await pool.query(
				'UPDATE pincode_mapping SET district = $1, state = $2 WHERE pincode = $3',
				[district, state, pincode]
			);
		} else {
			await pool.query(
				'INSERT INTO pincode_mapping (pincode, district, state) VALUES ($1, $2, $3)',
				[pincode, district, state]
			);
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error adding pincode mapping:', error);
		return json({ success: false, error: 'Failed to add pincode mapping' }, { status: 500 });
	}
}
