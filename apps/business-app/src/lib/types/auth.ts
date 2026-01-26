/**
 * Authentication types and interfaces for business-app
 * Centralized type definitions for auth modules used across /in and /us regions
 */

// Auth method types
export type AuthMethod = 'magic-link' | 'password';

export const AUTH_METHODS = {
	MAGIC_LINK: 'magic-link' as const,
	PASSWORD: 'password' as const
} as const;

// Auth error codes
export type AuthErrorCode =
	| 'AUTH_INVALID_TOKEN'
	| 'AUTH_EXPIRED_TOKEN'
	| 'AUTH_INVALID_CREDENTIALS'
	| 'AUTH_BUSINESS_NOT_FOUND'
	| 'AUTH_SESSION_EXPIRED'
	| 'AUTH_DATABASE_ERROR'
	| 'AUTH_INVALID_BUSINESS';

export const AUTH_ERRORS = {
	INVALID_TOKEN: 'AUTH_INVALID_TOKEN' as const,
	EXPIRED_TOKEN: 'AUTH_EXPIRED_TOKEN' as const,
	INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS' as const,
	BUSINESS_NOT_FOUND: 'AUTH_BUSINESS_NOT_FOUND' as const,
	SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED' as const,
	DATABASE_ERROR: 'AUTH_DATABASE_ERROR' as const,
	INVALID_BUSINESS: 'AUTH_INVALID_BUSINESS' as const
} as const;

// Cookie options type
export interface CookieOptions {
	httpOnly: boolean;
	secure: boolean;
	sameSite: 'lax' | 'strict' | 'none';
	path: string;
	maxAge: number;
}

// Auth configuration
export interface AuthConfig {
	SESSION_EXPIRY_DAYS: number;
	TOKEN_EXPIRY_HOURS: number;
	LAST_LOGIN_THROTTLE_HOURS: number;
	COOKIE_NAME: string;
	COOKIE_OPTIONS: CookieOptions;
}

export const AUTH_CONFIG: AuthConfig = {
	SESSION_EXPIRY_DAYS: 30,
	TOKEN_EXPIRY_HOURS: 24,
	LAST_LOGIN_THROTTLE_HOURS: 48,
	COOKIE_NAME: 'business-session',
	COOKIE_OPTIONS: {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24 * 30 // 30 days in seconds
	}
};

// Business entity types
export interface Business {
	id: number;
	businessname: string;
	slug: string;
	login_email: string;
	isvisible: boolean;
}

export interface BusinessPartial {
	id: number;
	slug: string;
	businessname: string;
}

// Session types
export interface SessionData {
	businessId: number;
	businessSlug: string;
	businessName: string;
	loginTime: Date;
	expires: Date;
	lastActivity: Date;
	authMethod: AuthMethod;
}

export interface SessionValidationOptions {
	skipRefresh?: boolean;
}

// Authentication response types
export interface AuthSuccessResponse {
	success: true;
}

export interface AuthErrorResponse {
	success: false;
	error: string;
	code: AuthErrorCode;
}

export type AuthResponse<T = Record<string, unknown>> =
	| (AuthSuccessResponse & T)
	| AuthErrorResponse;

// Specific response types
export interface TokenValidationSuccess {
	success: true;
	business: Business;
}

export interface BusinessLookupSuccess {
	success: true;
	business: Business;
}

export interface SessionValidationSuccess {
	success: true;
	session: SessionData;
	business: BusinessPartial;
}

export interface MagicLinkAuthSuccess {
	success: true;
	business: Business;
	session: SessionData;
	isNewLogin: boolean;
	lastLogin: Date | null;
}

export interface PasswordAuthSuccess {
	success: true;
	business: Business;
	session: SessionData;
	isNewLogin: boolean;
	lastLogin: Date | null;
}

export interface LoginTrackerResult {
	updated: boolean;
	lastLogin: Date | null;
	error?: string;
}

// Password validation types
export interface PasswordValidationResult {
	valid: boolean;
	errors: string[];
}

// Helper type constructors for consistent response patterns
export const SUCCESS_RESPONSE = <T extends Record<string, unknown>>(
	data: T
): AuthSuccessResponse & T => ({
	success: true,
	...data
});

export const ERROR_RESPONSE = (
	error: string,
	code: AuthErrorCode = AUTH_ERRORS.DATABASE_ERROR
): AuthErrorResponse => ({
	success: false,
	error,
	code
});
