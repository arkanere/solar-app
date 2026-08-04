import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import type { VercelPool } from '@vercel/postgres';
import { db } from '$lib/server/db';
import { businesses1, inUser, usBusinesses } from '@solar/db/schema';
import { eq, sql } from 'drizzle-orm';
import { syncAccountToUnified, syncInSplitTables } from '$lib/server/unifiedSync';

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

// `table` names the per-country business table, as it did when these were raw
// SQL; it maps to a Drizzle table here instead of being interpolated.
// `pool` is still needed for the unifiedSync helpers, which take a raw Queryable.
export async function mintBusinessTokenById(
	pool: VercelPool,
	table: 'businesses_1' | 'us_businesses',
	businessId: number
): Promise<string | null> {
	const { raw, hash, expiresAt } = newMagicToken();
	const businessTable = table === 'us_businesses' ? usBusinesses : businesses1;

	const updated = await db
		.update(businessTable)
		.set({ magicLinkToken: hash, magicLinkTokenExpiresAt: expiresAt.toISOString() })
		.where(eq(businessTable.id, businessId))
		.returning({ id: businessTable.id });

	if (updated.length === 0) return null;
	if (table !== 'us_businesses') {
		await syncInSplitTables(pool, businessId);
	}
	await syncAccountToUnified(pool, table === 'us_businesses' ? 'us' : 'in', businessId);
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
