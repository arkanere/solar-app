import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import type { VercelPool } from '@vercel/postgres';
import { syncAccountToUnified } from '$lib/server/unifiedSync';

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
export async function mintBusinessTokenById(
	pool: VercelPool,
	table: string,
	businessId: number
): Promise<string | null> {
	const { raw, hash, expiresAt } = newMagicToken();
	const result = await pool.query(
		`UPDATE ${table} SET magic_link_token = $1, magic_link_token_expires_at = $2 WHERE id = $3`,
		[hash, expiresAt, businessId]
	);
	if (result.rowCount === 0) return null;
	await syncAccountToUnified(pool, table === 'us_businesses' ? 'us' : 'in', businessId);
	return raw;
}

// Upserts the user by email and returns the raw token (in_user has no slug).
export async function mintUserToken(
	pool: VercelPool,
	email: string,
	name: string | null = null
): Promise<string> {
	const { raw, hash, expiresAt } = newMagicToken();
	const updated = await pool.query(
		'UPDATE in_user SET magic_link_token = $1, magic_link_token_expires_at = $2, name = COALESCE($3, name) WHERE email = $4',
		[hash, expiresAt, name, email]
	);
	if (updated.rowCount === 0) {
		await pool.query(
			'INSERT INTO in_user (email, name, magic_link_token, magic_link_token_expires_at) VALUES ($1, $2, $3, $4)',
			[email, name, hash, expiresAt]
		);
	}
	return raw;
}
