// Simple in-memory rate limiter for API endpoints.
//
// SECURITY LIMITATION (L1): state lives in this process's Map. On Vercel
// serverless each instance has its own Map, so the password-reset limit
// (passwordResetLimiter, used by /api/resetPassword) is effectively bypassable
// by spreading requests across instances, and resets on cold start. This is a
// best-effort throttle only. To make it enforceable, back it with a shared
// store (Postgres table keyed by identifier+window, or Upstash/Redis) before
// relying on it as a real control.

interface RateLimitRecord {
	count: number;
	resetTime: number;
}

interface RateLimitResult {
	allowed: boolean;
	retryAfter: number;
}

export class RateLimiter {
	private requests: Map<string, RateLimitRecord>;

	constructor() {
		this.requests = new Map<string, RateLimitRecord>();
		// Clean up old entries every 10 minutes
		setInterval(() => this.cleanup(), 10 * 60 * 1000);
	}

	checkLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): RateLimitResult {
		const now = Date.now();
		const record = this.requests.get(identifier);

		// No previous requests or window expired
		if (!record || now > record.resetTime) {
			this.requests.set(identifier, {
				count: 1,
				resetTime: now + windowMs
			});
			return { allowed: true, retryAfter: 0 };
		}

		// Increment count
		record.count++;

		// Check if limit exceeded
		if (record.count > maxAttempts) {
			const retryAfter = Math.ceil((record.resetTime - now) / 1000);
			return { allowed: false, retryAfter };
		}

		return { allowed: true, retryAfter: 0 };
	}

	reset(identifier: string): void {
		this.requests.delete(identifier);
	}

	cleanup(): void {
		const now = Date.now();
		for (const [identifier, record] of this.requests.entries()) {
			if (now > record.resetTime) {
				this.requests.delete(identifier);
			}
		}
	}

	getStats(identifier: string): RateLimitRecord | null {
		return this.requests.get(identifier) || null;
	}
}

export const passwordResetLimiter = new RateLimiter();
