import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { hasInternalSecret } from '$lib/server/internalAuth.js';

const pool = createPool({ connectionString: POSTGRES_URL });

// Magic links expire 15 days after creation.
const TOKEN_TTL_MS = 15 * 24 * 60 * 60 * 1000;

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

		// Store only the hash at rest; email the raw token.
		const magicLinkToken = uuidv4();
		const tokenHash = crypto.createHash('sha256').update(magicLinkToken).digest('hex');
		const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

		const existingUserResult = await pool.query(
			'SELECT id FROM in_user WHERE email = $1',
			[email]
		);

		if (existingUserResult.rows.length > 0) {
			await pool.query(
				'UPDATE in_user SET magic_link_token = $1, magic_link_token_expires_at = $2, name = COALESCE($3, name) WHERE id = $4',
				[tokenHash, expiresAt, name || null, existingUserResult.rows[0].id]
			);
		} else {
			await pool.query(
				'INSERT INTO in_user (email, name, magic_link_token, magic_link_token_expires_at) VALUES ($1, $2, $3, $4)',
				[email, name || null, tokenHash, expiresAt]
			);
		}

		const magicLinkUrl = `https://user.solarvipani.com/signin-link/${magicLinkToken}`;

		return json({ success: true, magicLinkUrl });
	} catch (error) {
		console.error('Error generating user magic link:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
