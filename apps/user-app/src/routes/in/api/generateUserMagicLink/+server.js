import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { v4 as uuidv4 } from 'uuid';
import { hasInternalSecret } from '$lib/server/internalAuth.js';

const pool = createPool({ connectionString: POSTGRES_URL });

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	if (!hasInternalSecret(request)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	try {
		const { email, name } = await request.json();

		if (!email) {
			return json({ error: 'Email is required' }, { status: 400 });
		}

		const magicLinkToken = uuidv4();

		const existingUserResult = await pool.query(
			'SELECT id FROM in_user WHERE email = $1',
			[email]
		);

		if (existingUserResult.rows.length > 0) {
			await pool.query(
				'UPDATE in_user SET magic_link_token = $1, name = COALESCE($2, name) WHERE id = $3',
				[magicLinkToken, name || null, existingUserResult.rows[0].id]
			);
		} else {
			await pool.query(
				'INSERT INTO in_user (email, name, magic_link_token) VALUES ($1, $2, $3)',
				[email, name || null, magicLinkToken]
			);
		}

		const magicLinkUrl = `https://user.solarvipani.com/signin-link/${magicLinkToken}`;

		return json({ success: true, magicLinkUrl });
	} catch (error) {
		console.error('Error generating user magic link:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
