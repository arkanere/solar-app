import type { Cookies } from '@sveltejs/kit';
import {
	AUTH_METHODS,
	AUTH_ERRORS,
	SUCCESS_RESPONSE,
	ERROR_RESPONSE,
	type AuthResult,
	type AuthSuccess,
	type AuthUser
} from './AuthTypes';
import { LoginTracker, type LastLoginUpdate } from './LoginTracker';
import { SessionManager, type SessionData, type SessionUser } from './SessionManager';
import { TokenManager } from './TokenManager';

export class UserAuthService {
	/**
	 * Authenticate user using magic link token
	 */
	async authenticateWithMagicLink(
		token: string,
		cookies: Cookies
	): Promise<
		AuthResult<{
			user: AuthUser;
			session: SessionData;
			isNewLogin: boolean;
			lastLogin: Date | null;
		}>
	> {
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
	 */
	async getUserByEmail(email: string): Promise<AuthResult<{ user: AuthUser }>> {
		return await TokenManager.getUserByEmail(email);
	}

	/**
	 * Validate existing session
	 */
	validateSession(cookies: Cookies): AuthResult<{ session: SessionData; user: SessionUser }> {
		return SessionManager.validateSession(cookies);
	}

	/**
	 * Refresh session and optionally update last login for long-inactive users
	 */
	async refreshSession(
		cookies: Cookies,
		options: { updateLastLogin?: boolean; activityThresholdHours?: number } = {}
	): Promise<AuthResult<{ session: SessionData; user: SessionUser }>> {
		const sessionResult = SessionManager.validateSession(cookies);
		if (!sessionResult.success) {
			return sessionResult;
		}

		const { session, user } = sessionResult;

		// Optionally update last login for long-inactive sessions
		if (options.updateLastLogin) {
			const now = new Date();
			const lastActivity = new Date(session.lastActivity);
			const hoursSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

			if (hoursSinceActivity >= (options.activityThresholdHours || 24)) {
				await LoginTracker.updateLastLogin(user.id);
			}
		}

		return sessionResult;
	}

	/**
	 * Logout user and clear session
	 */
	logout(cookies: Cookies): AuthResult<{ message: string }> {
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
	 */
	isAuthenticated(cookies: Cookies): boolean {
		return SessionManager.isSessionValid(cookies);
	}

	/**
	 * Update last login manually (utility method)
	 */
	async updateLastLogin(
		userId: number,
		options: { throttleHours?: number } = {}
	): Promise<AuthSuccess<LastLoginUpdate>> {
		const result = await LoginTracker.updateLastLogin(userId, options);
		return SUCCESS_RESPONSE(result);
	}
}
