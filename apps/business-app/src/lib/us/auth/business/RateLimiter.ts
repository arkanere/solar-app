// Postgres-backed rate limiter (R2).
//
// State lives in the shared `rate_limits` table (see migration 035) so the limit
// holds across Vercel serverless instances and cold starts — unlike the previous
// in-memory Map, which was per-instance and effectively bypassable.
//
// Fail-open: if the store is unreachable we allow the request rather than block
// logins/resets on a DB hiccup. The limiter is a throttle, not an auth boundary.

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

interface RateLimitResult {
	allowed: boolean;
	retryAfter: number;
}

const pool = createPool({ connectionString: POSTGRES_URL });

export class RateLimiter {
	async checkLimit(
		identifier: string,
		maxAttempts: number = 5,
		windowMs: number = 15 * 60 * 1000
	): Promise<RateLimitResult> {
		const windowSeconds = windowMs / 1000;
		try {
			// Atomic upsert: start a fresh window when none exists or the previous
			// one has elapsed, otherwise increment the count in the current window.
			const result = await pool.query<{ count: number; reset_time: string }>(
				`INSERT INTO rate_limits (identifier, count, reset_time)
				 VALUES ($1, 1, now() + ($2 || ' seconds')::interval)
				 ON CONFLICT (identifier) DO UPDATE SET
				   count = CASE WHEN rate_limits.reset_time <= now() THEN 1 ELSE rate_limits.count + 1 END,
				   reset_time = CASE WHEN rate_limits.reset_time <= now()
				     THEN now() + ($2 || ' seconds')::interval ELSE rate_limits.reset_time END
				 RETURNING count, reset_time`,
				[identifier, windowSeconds]
			);

			const { count, reset_time } = result.rows[0];
			const retryAfter = Math.max(0, Math.ceil((new Date(reset_time).getTime() - Date.now()) / 1000));

			if (count > maxAttempts) {
				return { allowed: false, retryAfter };
			}
			return { allowed: true, retryAfter: 0 };
		} catch (error) {
			console.error('❌ RateLimiter store error (failing open):', error);
			return { allowed: true, retryAfter: 0 };
		}
	}

	async reset(identifier: string): Promise<void> {
		try {
			await pool.query('DELETE FROM rate_limits WHERE identifier = $1', [identifier]);
		} catch (error) {
			console.error('❌ RateLimiter reset error:', error);
		}
	}
}

export const passwordResetLimiter = new RateLimiter();
