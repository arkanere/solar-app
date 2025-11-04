import crypto from 'crypto';

/**
 * Secure token management for password reset and magic links
 */
export class TokenSecurity {
	/**
	 * Hash a token using SHA-256
	 * @param {string} token - Plain text token
	 * @returns {string} Hashed token
	 */
	static hashToken(token) {
		return crypto.createHash('sha256').update(token).digest('hex');
	}

	/**
	 * Generate a cryptographically secure random token
	 * @param {number} bytes - Number of random bytes (default 32)
	 * @returns {string} Random token
	 */
	static generateSecureToken(bytes = 32) {
		return crypto.randomBytes(bytes).toString('hex');
	}

	/**
	 * Validate password strength
	 * @param {string} password - Password to validate
	 * @returns {Object} Validation result
	 */
	static validatePasswordStrength(password) {
		const errors = [];

		if (!password || password.length < 8) {
			errors.push('Password must be at least 8 characters long');
		}

		if (!/[A-Z]/.test(password)) {
			errors.push('Password must contain at least one uppercase letter');
		}

		if (!/[a-z]/.test(password)) {
			errors.push('Password must contain at least one lowercase letter');
		}

		if (!/[0-9]/.test(password)) {
			errors.push('Password must contain at least one number');
		}

		if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
			errors.push('Password must contain at least one special character');
		}

		if (password.length > 128) {
			errors.push('Password must be less than 128 characters');
		}

		return {
			valid: errors.length === 0,
			errors
		};
	}

	/**
	 * Check if token has expired
	 * @param {Date|string} expiresAt - Expiration date
	 * @returns {boolean} True if expired
	 */
	static isTokenExpired(expiresAt) {
		if (!expiresAt) return true;
		return new Date() > new Date(expiresAt);
	}

	/**
	 * Generate token expiration date (default 1 hour)
	 * @param {number} hours - Hours until expiration
	 * @returns {Date} Expiration date
	 */
	static getTokenExpiration(hours = 1) {
		const expiration = new Date();
		expiration.setHours(expiration.getHours() + hours);
		return expiration;
	}
}
