import type { Cookies } from '@sveltejs/kit';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';
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

/**
 * HMAC sign/verify for the session cookie. The cookie value is
 * `base64url(payload).base64url(hmacSha256(payload))`. Verification recomputes
 * the signature and compares in constant time; any tampering (or an old unsigned
 * cookie) fails verification and is treated as logged-out.
 */
function getSessionSecret(): string {
	const secret = env.SESSION_SECRET;
	if (!secret) {
		throw new Error('SESSION_SECRET is not configured');
	}
	return secret;
}

function signPayload(payloadB64: string): string {
	return createHmac('sha256', getSessionSecret()).update(payloadB64).digest('base64url');
}

function serializeSession(sessionData: SessionData): string {
	const payloadB64 = Buffer.from(JSON.stringify(sessionData), 'utf8').toString('base64url');
	return `${payloadB64}.${signPayload(payloadB64)}`;
}

function deserializeSession(cookieValue: string): SessionData | null {
	const dot = cookieValue.indexOf('.');
	if (dot <= 0) return null; // unsigned / malformed (e.g. legacy plain-JSON cookie)

	const payloadB64 = cookieValue.slice(0, dot);
	const providedSig = cookieValue.slice(dot + 1);
	const expectedSig = signPayload(payloadB64);

	// Constant-time compare; bail if lengths differ (timingSafeEqual would throw).
	const a = Buffer.from(providedSig);
	const b = Buffer.from(expectedSig);
	if (a.length !== b.length || !timingSafeEqual(a, b)) {
		return null;
	}

	return JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')) as SessionData;
}

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
		cookies.set(AUTH_CONFIG.COOKIE_NAME, serializeSession(sessionData), AUTH_CONFIG.COOKIE_OPTIONS);
	}

	static getSessionFromCookie(cookies: Cookies): SessionData | null {
		try {
			const sessionString = cookies.get(AUTH_CONFIG.COOKIE_NAME);
			if (!sessionString) return null;

			const sessionData = deserializeSession(sessionString);
			if (!sessionData) return null;

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
