import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';
import {
	AUTH_CONFIG,
	AUTH_ERRORS,
	SUCCESS_RESPONSE,
	ERROR_RESPONSE,
	type AuthResult,
	type AuthUser
} from './AuthTypes';

/**
 * What is stored in the session cookie. `createSession` writes real `Date`s, but
 * the cookie round-trips through JSON, so everything read back out is a string —
 * hence the union. Every consumer already wraps these in `new Date(...)`.
 */
export interface SessionData {
	userId: number;
	userEmail: string;
	userName: string | null;
	loginTime: Date | string;
	expires: Date | string;
	lastActivity: Date | string;
	authMethod: string;
}

export interface SessionUser {
	id: number;
	email: string;
	name: string | null;
}

/**
 * HMAC sign/verify for the session cookie. Cookie value is
 * `base64url(payload).base64url(hmacSha256(payload))`. Tampered or legacy
 * unsigned cookies fail verification and are treated as logged-out.
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

	const a = Buffer.from(providedSig);
	const b = Buffer.from(expectedSig);
	if (a.length !== b.length || !timingSafeEqual(a, b)) {
		return null;
	}

	return JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
}

export class SessionManager {
	/**
	 * Create a new user session
	 */
	static createSession(user: AuthUser | SessionUser, authMethod: string): SessionData {
		const now = new Date();
		const expires = new Date(now.getTime() + AUTH_CONFIG.SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

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
	 */
	static setSessionCookie(cookies: Cookies, sessionData: SessionData): void {
		cookies.set(AUTH_CONFIG.COOKIE_NAME, serializeSession(sessionData), AUTH_CONFIG.COOKIE_OPTIONS);
	}

	/**
	 * Get session from cookie
	 */
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

	/**
	 * Validate and refresh session
	 */
	static validateSession(
		cookies: Cookies,
		options: { skipRefresh?: boolean } = {}
	): AuthResult<{ session: SessionData; user: SessionUser }> {
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
				console.warn(
					'Could not refresh session cookie:',
					error instanceof Error ? error.message : error
				);
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
	 */
	static clearSession(cookies: Cookies): void {
		cookies.delete(AUTH_CONFIG.COOKIE_NAME, { path: '/' });
	}

	/**
	 * Check if session exists and is valid
	 */
	static isSessionValid(cookies: Cookies): boolean {
		return this.getSessionFromCookie(cookies) !== null;
	}
}
