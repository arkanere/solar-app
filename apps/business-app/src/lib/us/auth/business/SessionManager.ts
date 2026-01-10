import type { Cookies } from '@sveltejs/kit';
import {
	AUTH_CONFIG,
	AUTH_ERRORS,
	SUCCESS_RESPONSE,
	ERROR_RESPONSE,
	type BusinessPartial,
	type SessionData,
	type SessionValidationOptions,
	type AuthResponse,
	type SessionValidationSuccess
} from './AuthTypes';

export class SessionManager {
	static createSession(business: BusinessPartial, authMethod: string): SessionData {
		const now = new Date();
		const expires = new Date(now.getTime() + AUTH_CONFIG.SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

		return {
			businessId: business.id,
			businessSlug: business.slug,
			businessName: business.businessname,
			loginTime: now,
			expires,
			lastActivity: now,
			authMethod: authMethod as 'magic-link' | 'password'
		};
	}

	static setSessionCookie(cookies: Cookies, sessionData: SessionData): void {
		const sessionString = JSON.stringify(sessionData);
		cookies.set(AUTH_CONFIG.COOKIE_NAME, sessionString, AUTH_CONFIG.COOKIE_OPTIONS);
	}

	static getSessionFromCookie(cookies: Cookies): SessionData | null {
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

	static validateSession(
		cookies: Cookies,
		options: SessionValidationOptions = {}
	): AuthResponse<SessionValidationSuccess> {
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
				console.warn('Could not refresh session cookie:', (error as Error).message);
			}
		}

		return SUCCESS_RESPONSE({
			session: sessionData,
			business: {
				id: sessionData.businessId,
				slug: sessionData.businessSlug,
				businessname: sessionData.businessName
			}
		});
	}

	static clearSession(cookies: Cookies): void {
		cookies.delete(AUTH_CONFIG.COOKIE_NAME, { path: '/' });
	}

	static isSessionValid(cookies: Cookies): boolean {
		return this.getSessionFromCookie(cookies) !== null;
	}
}
