import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { db } from '$lib/server/db';
import { businesses1, inUser } from '@solar/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import {
	syncAccountToUnified,
	syncInSplitTables,
	type SyncCountry
} from '$lib/server/unifiedSync';

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
	country: SyncCountry,
	businessId: number
): Promise<string | null> {
	const { raw, hash, expiresAt } = newMagicToken();

	const updated = await db
		.update(businesses1)
		.set({ magicLinkToken: hash, magicLinkTokenExpiresAt: expiresAt.toISOString() })
		.where(and(eq(businesses1.id, businessId), eq(businesses1.countryCode, country)))
		.returning({ id: businesses1.id });

	if (updated.length === 0) return null;
	await syncInSplitTables(db, businessId);
	await syncAccountToUnified(db, country, businessId);
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
