// Postgres-backed rate limiter (R2).
//
// State lives in the shared `rate_limits` table (see migration 035) so the limit
// holds across Vercel serverless instances and cold starts — unlike the previous
// in-memory Map, which was per-instance and effectively bypassable.
//
// Fail-open: if the store is unreachable we allow the request rather than block
// logins/resets on a DB hiccup. The limiter is a throttle, not an auth boundary.

import { db } from '$lib/server/db';
import { rateLimits } from '@solar/db/schema';
import { eq, sql } from 'drizzle-orm';

interface RateLimitResult {
	allowed: boolean;
	retryAfter: number;
}


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
			const freshResetTime = sql`now() + make_interval(secs => ${windowSeconds})`;
			const rows = await db
				.insert(rateLimits)
				.values({ identifier, count: 1, resetTime: freshResetTime })
				.onConflictDoUpdate({
					target: rateLimits.identifier,
					set: {
						count: sql`CASE WHEN ${rateLimits.resetTime} <= now() THEN 1 ELSE ${rateLimits.count} + 1 END`,
						resetTime: sql`CASE WHEN ${rateLimits.resetTime} <= now() THEN now() + make_interval(secs => ${windowSeconds}) ELSE ${rateLimits.resetTime} END`
					}
				})
				.returning({ count: rateLimits.count, resetTime: rateLimits.resetTime });

			const { count, resetTime } = rows[0];
			const retryAfter = Math.max(0, Math.ceil((new Date(resetTime).getTime() - Date.now()) / 1000));

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
			await db.delete(rateLimits).where(eq(rateLimits.identifier, identifier));
		} catch (error) {
			console.error('❌ RateLimiter reset error:', error);
		}
	}
}

export const passwordResetLimiter = new RateLimiter();
