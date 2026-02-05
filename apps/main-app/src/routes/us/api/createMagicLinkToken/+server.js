import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { v4 as uuidv4 } from 'uuid';

const pool = createPool({ connectionString: POSTGRES_URL });

export async function POST({ request }) {
	try {
		const { slug, id } = await request.json();

		if (!slug || !id) {
			return json({ success: false, error: 'Business slug and ID are required' }, { status: 400 });
		}

		// Generate a UUID and embed the business ID
		const base_uuid = uuidv4();
		const parts = base_uuid.split('-');
		parts[2] = String(id); // Insert business ID in the 3rd segment
		const magicLinkToken = parts.join('-');

		// Update the database with the new token
		const client = await pool.connect();
		try {
			const result = await client.query(
				'UPDATE us_businesses SET magic_link_token = $1 WHERE id = $2 RETURNING magic_link_token',
				[magicLinkToken, id]
			);

			if (result.rowCount === 0) {
				return json({ success: false, error: 'Business not found' }, { status: 404 });
			}

			return json({ success: true, magic_link_token: result.rows[0].magic_link_token });
		} finally {
			client.release();
		}
	} catch (error) {
		console.error('Error creating magic link token:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
}
