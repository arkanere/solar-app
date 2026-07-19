import { json, type RequestHandler } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { hasInternalSecret } from '$lib/server/internalAuth';
import { getCountry, isCountry } from '$lib/countries';

interface GenerateUserMagicLinkRequest {
	email: string;
	name?: string;
}

const pool = createPool({ connectionString: POSTGRES_URL });

// Magic links expire 15 days after creation.
const TOKEN_TTL_MS = 15 * 24 * 60 * 60 * 1000;

export const POST: RequestHandler = async ({ request, params }) => {
	if (!hasInternalSecret(request)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	if (!params.country || !isCountry(params.country)) {
		return json({ error: 'Unknown country' }, { status: 404 });
	}
	// Customer accounts are IN-only: in_user has no country column and there is
	// no unified equivalent, so this must not silently write IN rows for another
	// country's leads.
	if (!getCountry(params.country).features.userAccounts) {
		return json({ error: 'User accounts are not enabled for this country' }, { status: 404 });
	}
	try {
		const { email, name }: GenerateUserMagicLinkRequest = await request.json();

		if (!email) {
			return json({ error: 'Email is required' }, { status: 400 });
		}

		// Generate magic link token. Store only the hash at rest; email the raw token.
		const magicLinkToken = uuidv4();
		const tokenHash = crypto.createHash('sha256').update(magicLinkToken).digest('hex');
		const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

		// Check if user exists, if not create them
		const existingUserQuery = 'SELECT id FROM in_user WHERE email = $1';
		const existingUserResult = await pool.query(existingUserQuery, [email]);

		if (existingUserResult.rows.length > 0) {
			// Update existing user
			await pool.query(
				'UPDATE in_user SET magic_link_token = $1, magic_link_token_expires_at = $2, name = COALESCE($3, name) WHERE id = $4',
				[tokenHash, expiresAt, name || null, existingUserResult.rows[0].id]
			);
		} else {
			// Create new user
			await pool.query(
				'INSERT INTO in_user (email, name, magic_link_token, magic_link_token_expires_at) VALUES ($1, $2, $3, $4)',
				[email, name || null, tokenHash, expiresAt]
			);
		}

		// Generate magic link URL
		const baseUrl = request.headers.get('origin') || 'https://solarvipani.com';
		const magicLinkUrl = `${baseUrl}/user/signin-link/${magicLinkToken}`;

		return json({
			success: true,
			magicLinkUrl,
			message: 'Magic link generated successfully (valid for 15 days)'
		});

	} catch (error) {
		console.error('Error generating user magic link:', error);
		return json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
};
