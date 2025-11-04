/**
 * Simple in-memory rate limiter for API endpoints
 * Note: For production with multiple instances, use Redis or similar
 */
export class RateLimiter {
	constructor() {
		// Map of identifier -> { count, resetTime }
		this.requests = new Map();

		// Clean up old entries every 10 minutes
		setInterval(() => this.cleanup(), 10 * 60 * 1000);
	}

	/**
	 * Check if request is allowed
	 * @param {string} identifier - Unique identifier (IP, email, etc.)
	 * @param {number} maxAttempts - Max attempts allowed
	 * @param {number} windowMs - Time window in milliseconds
	 * @returns {Object} { allowed: boolean, retryAfter: number }
	 */
	checkLimit(identifier, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
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

	/**
	 * Reset rate limit for an identifier
	 * @param {string} identifier - Unique identifier
	 */
	reset(identifier) {
		this.requests.delete(identifier);
	}

	/**
	 * Clean up expired entries
	 */
	cleanup() {
		const now = Date.now();
		for (const [identifier, record] of this.requests.entries()) {
			if (now > record.resetTime) {
				this.requests.delete(identifier);
			}
		}
	}

	/**
	 * Get current stats for an identifier
	 * @param {string} identifier - Unique identifier
	 * @returns {Object|null} Stats or null if no record
	 */
	getStats(identifier) {
		return this.requests.get(identifier) || null;
	}
}

// Singleton instance
export const passwordResetLimiter = new RateLimiter();
