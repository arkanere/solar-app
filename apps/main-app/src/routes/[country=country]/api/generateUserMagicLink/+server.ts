import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { svUser } from '@solar/db/schema';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { hasInternalSecret } from '$lib/server/internalAuth';
import { getCountry, isCountry } from '$lib/countries';

interface GenerateUserMagicLinkRequest {
	email: string;
	name?: string;
}

// Magic links expire 15 days after creation.
const TOKEN_TTL_MS = 15 * 24 * 60 * 60 * 1000;

export const POST: RequestHandler = async ({ request, params }) => {
	if (!hasInternalSecret(request)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	if (!params.country || !isCountry(params.country)) {
		return json({ error: 'Unknown country' }, { status: 404 });
	}
	// Customer accounts are IN-only: sv_user has no country column and there is
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
		// magic_link_token_expires_at is typed `mode: 'string'` by the introspected
		// schema, so the Date the raw driver accepted becomes an ISO string here.
		const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

		// Check if user exists, if not create them
		const existingUsers = await db
			.select({ id: svUser.id })
			.from(svUser)
			.where(eq(svUser.email, email));

		if (existingUsers.length > 0) {
			// Update existing user
			await db
				.update(svUser)
				.set({
					magicLinkToken: tokenHash,
					magicLinkTokenExpiresAt: expiresAt,
					name: sql`COALESCE(${name ?? null}, ${svUser.name})`
				})
				.where(eq(svUser.id, existingUsers[0].id));
		} else {
			// Create new user
			await db.insert(svUser).values({
				email,
				name: name || null,
				magicLinkToken: tokenHash,
				magicLinkTokenExpiresAt: expiresAt
			});
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
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
