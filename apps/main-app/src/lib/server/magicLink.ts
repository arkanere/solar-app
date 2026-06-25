import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import type { VercelPool } from '@vercel/postgres';

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

// `table` is a trusted constant ('businesses_1' | 'us_businesses'), never user input.
export async function mintBusinessTokenBySlug(
	pool: VercelPool,
	table: string,
	slug: string
): Promise<string | null> {
	const { raw, hash, expiresAt } = newMagicToken();
	const result = await pool.query(
		`UPDATE ${table} SET magic_link_token = $1, magic_link_token_expires_at = $2 WHERE slug = $3`,
		[hash, expiresAt, slug]
	);
	return result.rowCount === 0 ? null : raw;
}
