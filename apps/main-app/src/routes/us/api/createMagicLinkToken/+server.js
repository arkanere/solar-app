import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { hasInternalSecret } from '$lib/server/internalAuth';
import { syncAccountToUnified } from '$lib/server/unifiedSync';

const pool = createPool({ connectionString: POSTGRES_URL });

// Magic links expire 15 days after creation.
const TOKEN_TTL_MS = 15 * 24 * 60 * 60 * 1000;

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
		// Store only the hash at rest; email the raw token below.
		const tokenHash = crypto.createHash('sha256').update(magicLinkToken).digest('hex');
		const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

		// Update the database with the new token
		const client = await pool.connect();
		try {
			const result = await client.query(
				'UPDATE us_businesses SET magic_link_token = $1, magic_link_token_expires_at = $2 WHERE id = $3',
				[tokenHash, expiresAt, id]
			);

			if (result.rowCount === 0) {
				return json({ success: false, error: 'Business not found' }, { status: 404 });
			}

			// Idempotent with the us_businesses sync trigger (046); keeps the
			// unified business_accounts fresh once triggers drop (phase 2.4).
			await syncAccountToUnified(client, 'us', id);

			// Return the raw token (not the stored hash) so the caller can email it.
			return json({ success: true, magic_link_token: magicLinkToken });
		} finally {
			client.release();
		}
	} catch (error) {
		console.error('Error creating magic link token:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
}
