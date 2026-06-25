import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { v4 as uuidv4 } from 'uuid';
import { hasInternalSecret } from '$lib/server/internalAuth';

const pool = createPool({ connectionString: POSTGRES_URL });

export async function POST({ request }) {
	if (!hasInternalSecret(request)) {
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });
	}
	try {
		const { slug, id } = await request.json();

		if (!slug || !id) {
			return json({ success: false, error: 'Business slug and ID are required' }, { status: 400 });
		}

		// Random, unguessable token. Do NOT embed the business id — that made
		// tokens partially predictable.
		const magicLinkToken = uuidv4();

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
