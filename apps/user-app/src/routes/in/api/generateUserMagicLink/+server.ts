import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { schema } from '@solar/db';
import { db } from '$lib/server/db';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { hasInternalSecret } from '$lib/server/internalAuth';
import type { RequestHandler } from './$types';

// Magic links expire 15 days after creation.
const TOKEN_TTL_MS = 15 * 24 * 60 * 60 * 1000;

export const POST: RequestHandler = async ({ request }) => {
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

		const existingUsers = await db
			.select({ id: schema.inUser.id })
			.from(schema.inUser)
			.where(eq(schema.inUser.email, email));

		if (existingUsers.length > 0) {
			await db
				.update(schema.inUser)
				.set({
					magicLinkToken: tokenHash,
					magicLinkTokenExpiresAt: expiresAt.toISOString(),
					// The raw SQL wrote `name = COALESCE($3, name)` with `name || null`
					// as the parameter — i.e. keep the stored name when the caller
					// sends none. Omitting the key from the update does the same.
					...(name ? { name } : {})
				})
				.where(eq(schema.inUser.id, existingUsers[0].id));
		} else {
			await db.insert(schema.inUser).values({
				email,
				name: name || null,
				magicLinkToken: tokenHash,
				magicLinkTokenExpiresAt: expiresAt.toISOString()
			});
		}

		const magicLinkUrl = `https://user.solarvipani.com/signin-link/${magicLinkToken}`;

		return json({ success: true, magicLinkUrl });
	} catch (error) {
		console.error('Error generating user magic link:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
