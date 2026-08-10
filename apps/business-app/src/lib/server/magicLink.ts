import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { db } from '$lib/server/db';
import { businessAccounts, inUser } from '@solar/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import type { AuthCountry } from '$lib/auth/business/countryTables';

// Magic-link tokens are stored hashed at rest and expire after 15 days.
// Emitters mint a fresh token, persist its hash, and email/return the raw token.
// Each table holds a single token column, so minting invalidates any previously
// issued link for that account (last-write-wins, by design).
const TOKEN_TTL_MS = 15 * 24 * 60 * 60 * 1000;

export function newMagicToken() {
	const raw = uuidv4();
	const hash = crypto.createHash('sha256').update(raw).digest('hex');
	const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
	return { raw, hash, expiresAt };
}

// Takes a country rather than a table name. The old signature named the
// per-country business table ('businesses_1' | 'us_businesses'), a holdover
// from when these were raw SQL strings; since 054 united those tables there is
// only one to name, and what actually varies is the country_code filter.
export async function mintBusinessTokenById(
	country: AuthCountry,
	businessId: number
): Promise<string | null> {
	const { raw, hash, expiresAt } = newMagicToken();

	// Since 062 this writes business_accounts directly rather than staging the
	// token in businesses_1 for sv_sync_account to pick up. TokenManager already
	// verified links against this table, so the mint and the check now agree by
	// construction instead of by a sync call.
	//
	// magic_link_token_expires_at is timestamptz, so it takes .toISOString()
	// directly — unlike reset_token_expires in passwordReset.ts, which is naive.
	const updated = await db
		.update(businessAccounts)
		.set({ magicLinkToken: hash, magicLinkTokenExpiresAt: expiresAt.toISOString() })
		.where(
			and(eq(businessAccounts.sourceId, businessId), eq(businessAccounts.countryCode, country))
		)
		.returning({ sourceId: businessAccounts.sourceId });

	if (updated.length === 0) return null;
	return raw;
}

// Upserts the user by email and returns the raw token (in_user has no slug).
export async function mintUserToken(
	email: string,
	name: string | null = null
): Promise<string> {
	const { raw, hash, expiresAt } = newMagicToken();

	// in_user has a unique index on email, so this is a real upsert. The old
	// UPDATE-then-INSERT pair did the same thing with a race between the two.
	await db
		.insert(inUser)
		.values({
			email,
			name,
			magicLinkToken: hash,
			magicLinkTokenExpiresAt: expiresAt.toISOString()
		})
		.onConflictDoUpdate({
			target: inUser.email,
			set: {
				magicLinkToken: hash,
				magicLinkTokenExpiresAt: expiresAt.toISOString(),
				// COALESCE: a null name must not wipe an existing one.
				name: sql`COALESCE(${name}::varchar, ${inUser.name})`
			}
		});

	return raw;
}
