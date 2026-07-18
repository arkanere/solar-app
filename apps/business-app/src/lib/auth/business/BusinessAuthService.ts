import type { Cookies } from '@sveltejs/kit';
import {
	AUTH_METHODS,
	AUTH_ERRORS,
	SUCCESS_RESPONSE,
	ERROR_RESPONSE,
	type AuthResponse,
	type MagicLinkAuthSuccess,
	type PasswordAuthSuccess,
	type SessionValidationSuccess,
	type BusinessLookupSuccess,
	type AuthErrorResponse,
	type LoginTrackerResult
} from './AuthTypes';
import { LoginTracker } from './LoginTracker';
import { SessionManager } from './SessionManager';
import { TokenManager } from './TokenManager';
import { PasswordManager } from './PasswordManager';
import type { AuthCountry } from './countryTables';

interface RefreshOptions {
	updateLastLogin?: boolean;
	activityThresholdHours?: number;
}

export class BusinessAuthService {
	private readonly tokens: TokenManager;
	private readonly passwords: PasswordManager;
	private readonly logins: LoginTracker;

	constructor(country: AuthCountry) {
		this.tokens = new TokenManager(country);
		this.passwords = new PasswordManager(country);
		this.logins = new LoginTracker(country);
	}

	async authenticateWithMagicLink(
		token: string,
		businessSlug: string,
		cookies: Cookies
	): Promise<AuthResponse<MagicLinkAuthSuccess>> {
		try {
			// Validate token and get business
			const tokenResult = await this.tokens.validateMagicLinkToken(token, businessSlug);
			if (!tokenResult.success) {
				return tokenResult;
			}

			const { business } = tokenResult;

			// Update last login
			const loginResult = await this.logins.updateLastLogin(business.id);

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

	async getBusinessByEmail(email: string): Promise<BusinessLookupSuccess | AuthErrorResponse> {
		return await this.tokens.getBusinessByEmail(email);
	}

	async authenticateWithPassword(
		email: string,
		password: string,
		businessSlug: string,
		cookies: Cookies
	): Promise<AuthResponse<PasswordAuthSuccess>> {
		try {
			// Get business by slug
			const businessResult = await this.tokens.getBusinessBySlug(businessSlug);
			if (!businessResult.success) {
				return businessResult;
			}

			const { business } = businessResult;

			// Validate password
			const passwordResult = await this.passwords.validatePassword(email, password, business);
			if (!passwordResult.success) {
				return passwordResult;
			}

			// Update last login
			const loginResult = await this.logins.updateLastLogin(business.id);

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

	validateSession(cookies: Cookies): AuthResponse<SessionValidationSuccess> {
		return SessionManager.validateSession(cookies);
	}

	async refreshSession(
		cookies: Cookies,
		options: RefreshOptions = {}
	): Promise<AuthResponse<SessionValidationSuccess>> {
		const sessionResult = SessionManager.validateSession(cookies);
		if (!sessionResult.success) {
			return sessionResult;
		}

		const { session, business } = sessionResult;

		// Optionally update last login for long-inactive sessions
		if (options.updateLastLogin) {
			const now = new Date();
			const lastActivity = new Date(session.lastActivity);
			const hoursSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

			if (hoursSinceActivity >= (options.activityThresholdHours || 24)) {
				await this.logins.updateLastLogin(business.id);
			}
		}

		return sessionResult;
	}

	logout(cookies: Cookies): AuthResponse<{ message: string }> {
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

	isAuthenticated(cookies: Cookies): boolean {
		return SessionManager.isSessionValid(cookies);
	}

	async updateLastLogin(
		businessId: number,
		options: { throttleHours?: number } = {}
	): Promise<AuthResponse<LoginTrackerResult>> {
		const result = await this.logins.updateLastLogin(businessId, options);
		return SUCCESS_RESPONSE({ ...result });
	}
}
