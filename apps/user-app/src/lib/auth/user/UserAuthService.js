import { AUTH_METHODS, AUTH_ERRORS, SUCCESS_RESPONSE, ERROR_RESPONSE } from './AuthTypes.js';
import { LoginTracker } from './LoginTracker.js';
import { SessionManager } from './SessionManager.js';
import { TokenManager } from './TokenManager.js';

export class UserAuthService {
	/**
	 * Authenticate user using magic link token
	 * @param {string} token - Magic link token
	 * @param {Object} cookies - SvelteKit cookies object
	 * @returns {Promise<Object>} Authentication result
	 */
	async authenticateWithMagicLink(token, cookies) {
		try {
			// Validate token and get user
			const tokenResult = await TokenManager.validateMagicLinkToken(token);
			if (!tokenResult.success) {
				return tokenResult;
			}

			const { user } = tokenResult;

			// Update last login
			const loginResult = await LoginTracker.updateLastLogin(user.id);

			// Create session
			const sessionData = SessionManager.createSession(user, AUTH_METHODS.MAGIC_LINK);
			SessionManager.setSessionCookie(cookies, sessionData);

			// Magic links are reusable until they expire: the token is intentionally
			// NOT cleared after login, so the same link keeps working until its
			// 15-day expiry (enforced in TokenManager.validateMagicLinkToken).

			return SUCCESS_RESPONSE({
				user,
				session: sessionData,
				isNewLogin: loginResult.updated,
				lastLogin: loginResult.lastLogin
			});
		} catch (error) {
			console.error('❌ Error in magic link authentication:', error);
			return ERROR_RESPONSE('Authentication failed', AUTH_ERRORS.DATABASE_ERROR);
		}
	}

	/**
	 * Get user by email (for login pages)
	 * @param {string} email - User email
	 * @returns {Promise<Object>} User lookup result
	 */
	async getUserByEmail(email) {
		return await TokenManager.getUserByEmail(email);
	}

	/**
	 * Validate existing session
	 * @param {Object} cookies - SvelteKit cookies object
	 * @returns {Object} Session validation result
	 */
	validateSession(cookies) {
		return SessionManager.validateSession(cookies);
	}

	/**
	 * Refresh session and optionally update last login for long-inactive users
	 * @param {Object} cookies - SvelteKit cookies object
	 * @param {Object} options - Refresh options
	 * @returns {Promise<Object>} Refresh result
	 */
	async refreshSession(cookies, options = {}) {
		const sessionResult = SessionManager.validateSession(cookies);
		if (!sessionResult.success) {
			return sessionResult;
		}

		const { session, user } = sessionResult;

		// Optionally update last login for long-inactive sessions
		if (options.updateLastLogin) {
			const now = new Date();
			const lastActivity = new Date(session.lastActivity);
			const hoursSinceActivity = (now - lastActivity) / (1000 * 60 * 60);

			if (hoursSinceActivity >= (options.activityThresholdHours || 24)) {
				await LoginTracker.updateLastLogin(user.id);
			}
		}

		return sessionResult;
	}

	/**
	 * Logout user and clear session
	 * @param {Object} cookies - SvelteKit cookies object
	 * @returns {Object} Logout result
	 */
	logout(cookies) {
		try {
			SessionManager.clearSession(cookies);

			return SUCCESS_RESPONSE({
				message: 'Logged out successfully'
			});
		} catch (error) {
			console.error('❌ Error during logout:', error);
			// Still clear session even if there's an error
			SessionManager.clearSession(cookies);
			return ERROR_RESPONSE('Logout completed with errors', AUTH_ERRORS.DATABASE_ERROR);
		}
	}

	/**
	 * Check if user is authenticated
	 * @param {Object} cookies - SvelteKit cookies object
	 * @returns {boolean}
	 */
	isAuthenticated(cookies) {
		return SessionManager.isSessionValid(cookies);
	}

	/**
	 * Update last login manually (utility method)
	 * @param {number} userId - User ID
	 * @param {Object} options - Update options
	 * @returns {Promise<Object>} Update result
	 */
	async updateLastLogin(userId, options = {}) {
		const result = await LoginTracker.updateLastLogin(userId, options);
		return SUCCESS_RESPONSE(result);
	}
}
