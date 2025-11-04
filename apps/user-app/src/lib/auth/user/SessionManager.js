import { AUTH_CONFIG, AUTH_ERRORS, SUCCESS_RESPONSE, ERROR_RESPONSE } from './AuthTypes.js';

export class SessionManager {
	/**
	 * Create a new user session
	 * @param {Object} user - User data
	 * @param {string} authMethod - Authentication method used
	 * @returns {Object} Session data
	 */
	static createSession(user, authMethod) {
		const now = new Date();
		const expires = new Date(now.getTime() + (AUTH_CONFIG.SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000));

		return {
			userId: user.id,
			userEmail: user.email,
			userName: user.name,
			loginTime: now,
			expires,
			lastActivity: now,
			authMethod
		};
	}

	/**
	 * Set session cookie
	 * @param {Object} cookies - SvelteKit cookies object
	 * @param {Object} sessionData - Session data to store
	 */
	static setSessionCookie(cookies, sessionData) {
		const sessionString = JSON.stringify(sessionData);
		cookies.set(AUTH_CONFIG.COOKIE_NAME, sessionString, AUTH_CONFIG.COOKIE_OPTIONS);
	}

	/**
	 * Get session from cookie
	 * @param {Object} cookies - SvelteKit cookies object
	 * @returns {Object|null} Session data or null
	 */
	static getSessionFromCookie(cookies) {
		try {
			const sessionString = cookies.get(AUTH_CONFIG.COOKIE_NAME);
			if (!sessionString) return null;

			const sessionData = JSON.parse(sessionString);

			// Check if session is expired
			const now = new Date();
			const expires = new Date(sessionData.expires);

			if (now > expires) {
				return null;
			}

			return sessionData;
		} catch (error) {
			console.error('❌ Error parsing session cookie:', error);
			return null;
		}
	}

	/**
	 * Validate and refresh session
	 * @param {Object} cookies - SvelteKit cookies object
	 * @param {Object} options - Options for validation
	 * @returns {Object} Validation result
	 */
	static validateSession(cookies, options = {}) {
		const sessionData = this.getSessionFromCookie(cookies);

		if (!sessionData) {
			return ERROR_RESPONSE('Session not found or expired', AUTH_ERRORS.SESSION_EXPIRED);
		}

		// Only update last activity if not explicitly disabled
		// This prevents cookie setting during redirects
		if (!options.skipRefresh) {
			try {
				sessionData.lastActivity = new Date();
				this.setSessionCookie(cookies, sessionData);
			} catch (error) {
				// If we can't set cookies (e.g., during redirect), just continue
				console.warn('Could not refresh session cookie:', error.message);
			}
		}

		return SUCCESS_RESPONSE({
			session: sessionData,
			user: {
				id: sessionData.userId,
				email: sessionData.userEmail,
				name: sessionData.userName
			}
		});
	}

	/**
	 * Clear session cookie
	 * @param {Object} cookies - SvelteKit cookies object
	 */
	static clearSession(cookies) {
		cookies.delete(AUTH_CONFIG.COOKIE_NAME, { path: '/' });
	}

	/**
	 * Check if session exists and is valid
	 * @param {Object} cookies - SvelteKit cookies object
	 * @returns {boolean}
	 */
	static isSessionValid(cookies) {
		return this.getSessionFromCookie(cookies) !== null;
	}
}
