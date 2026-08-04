import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { businesses1, usBusinesses } from '@solar/db/schema';
import { eq } from 'drizzle-orm';

// NOTE: nothing in the monorepo imports this module — business-app has its own
// `lib/server/magicLink`, which is the one actually in use. Converted rather
// than deleted so the Phase 10 raw-SQL grep comes back clean; it is a deletion
// candidate. See next-steps.md.
//
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

// The trusted table-name string ('businesses_1' | 'us_businesses') became a
// per-country Drizzle table, continuing the approach from Phases 2 and 5.
const BUSINESS_TABLES = {
	in: businesses1,
	us: usBusinesses
} as const;

export async function mintBusinessTokenBySlug(
	country: keyof typeof BUSINESS_TABLES,
	slug: string
): Promise<string | null> {
	const table = BUSINESS_TABLES[country];
	const { raw, hash, expiresAt } = newMagicToken();
	const updated = await db
		.update(table)
		.set({
			magicLinkToken: hash,
			// The column is typed `mode: 'string'`, so the Date becomes an ISO string.
			magicLinkTokenExpiresAt: expiresAt.toISOString()
		})
		.where(eq(table.slug, slug))
		.returning({ id: table.id });
	return updated.length === 0 ? null : raw;
}
