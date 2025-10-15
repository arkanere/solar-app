import { AUTH_METHODS, AUTH_ERRORS, SUCCESS_RESPONSE, ERROR_RESPONSE } from './AuthTypes.js';
import { LoginTracker } from './LoginTracker.js';
import { SessionManager } from './SessionManager.js';
import { TokenManager } from './TokenManager.js';
import { PasswordManager } from './PasswordManager.js';

export class BusinessAuthService {
	/**
	 * Authenticate business using magic link token
	 * @param {string} token - Magic link token
	 * @param {string} businessSlug - Business slug from URL
	 * @param {Object} cookies - SvelteKit cookies object
	 * @returns {Promise<Object>} Authentication result
	 */
	async authenticateWithMagicLink(token, businessSlug, cookies) {
		try {
			// Validate token and get business
			const tokenResult = await TokenManager.validateMagicLinkToken(token, businessSlug);
			if (!tokenResult.success) {
				return tokenResult;
			}

			const { business } = tokenResult;

			// Update last login
			const loginResult = await LoginTracker.updateLastLogin(business.id);

			// Create session
			const sessionData = SessionManager.createSession(business, AUTH_METHODS.MAGIC_LINK);
			SessionManager.setSessionCookie(cookies, sessionData);

			
			return SUCCESS_RESPONSE({
				business,
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
	 * Get business by email (for generic login page)
	 * @param {string} email - Business email
	 * @returns {Promise<Object>} Business lookup result
	 */
	async getBusinessByEmail(email) {
		return await TokenManager.getBusinessByEmail(email);
	}

	/**
	 * Authenticate business using email and password
	 * @param {string} email - Business email
	 * @param {string} password - Password
	 * @param {string} businessSlug - Business slug from URL
	 * @param {Object} cookies - SvelteKit cookies object
	 * @returns {Promise<Object>} Authentication result
	 */
	async authenticateWithPassword(email, password, businessSlug, cookies) {
		try {
			// Get business by slug
			const businessResult = await TokenManager.getBusinessBySlug(businessSlug);
			if (!businessResult.success) {
				return businessResult;
			}

			const { business } = businessResult;

			// Validate password
			const passwordResult = await PasswordManager.validatePassword(email, password, business);
			if (!passwordResult.success) {
				return passwordResult;
			}

			// Update last login
			const loginResult = await LoginTracker.updateLastLogin(business.id);

			// Create session
			const sessionData = SessionManager.createSession(business, AUTH_METHODS.PASSWORD);
			SessionManager.setSessionCookie(cookies, sessionData);

			
			return SUCCESS_RESPONSE({
				business,
				session: sessionData,
				isNewLogin: loginResult.updated,
				lastLogin: loginResult.lastLogin
			});

		} catch (error) {
			console.error('❌ Error in password authentication:', error);
			return ERROR_RESPONSE('Authentication failed', AUTH_ERRORS.DATABASE_ERROR);
		}
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

		const { session, business } = sessionResult;

		// Optionally update last login for long-inactive sessions
		if (options.updateLastLogin) {
			const now = new Date();
			const lastActivity = new Date(session.lastActivity);
			const hoursSinceActivity = (now - lastActivity) / (1000 * 60 * 60);
			
			if (hoursSinceActivity >= (options.activityThresholdHours || 24)) {
				await LoginTracker.updateLastLogin(business.id);
			}
		}

		return sessionResult;
	}

	/**
	 * Logout business and clear session
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
	 * @param {number} businessId - Business ID
	 * @param {Object} options - Update options
	 * @returns {Promise<Object>} Update result
	 */
	async updateLastLogin(businessId, options = {}) {
		const result = await LoginTracker.updateLastLogin(businessId, options);
		return SUCCESS_RESPONSE(result);
	}
}