// Authentication constants and type definitions for user authentication

export const AUTH_METHODS = {
	MAGIC_LINK: 'magic-link',
	PASSWORD: 'password',
	GOOGLE_OAUTH: 'google-oauth'
} as const;

export const AUTH_ERRORS = {
	INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
	EXPIRED_TOKEN: 'AUTH_EXPIRED_TOKEN',
	INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
	USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
	SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',
	DATABASE_ERROR: 'AUTH_DATABASE_ERROR',
	INVALID_USER: 'AUTH_INVALID_USER'
} as const;

export const AUTH_CONFIG = {
	SESSION_EXPIRY_DAYS: 30,
	TOKEN_EXPIRY_HOURS: 24,
	LAST_LOGIN_THROTTLE_HOURS: 48,
	COOKIE_NAME: 'user-session',
	COOKIE_OPTIONS: {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24 * 30 // 30 days in seconds
	}
} as const;

export type AuthMethod = (typeof AUTH_METHODS)[keyof typeof AUTH_METHODS];
export type AuthErrorCode = (typeof AUTH_ERRORS)[keyof typeof AUTH_ERRORS];

/**
 * A user as every auth path hands it back. `name` and `created_at` are nullable
 * in `sv_user`; this app still reads through the raw pg driver, so `created_at`
 * arrives as a `Date` rather than the `mode: 'string'` the Drizzle schema uses.
 */
export interface AuthUser {
	id: number;
	email: string;
	name: string | null;
	created_at: Date | null;
}

/**
 * The `{ success: true, ...data }` / `{ success: false, error, code }` pair that
 * every auth function returns. Modelled as a discriminated union so a caller
 * that checks `result.success` gets the payload narrowed for free — that check
 * was previously unenforced, and `@returns {Object}` erased the payload entirely.
 */
export type AuthSuccess<T> = { success: true } & T;

export interface AuthFailure {
	success: false;
	error: string;
	code: AuthErrorCode;
}

export type AuthResult<T> = AuthSuccess<T> | AuthFailure;

export const SUCCESS_RESPONSE = <T extends object>(data: T): AuthSuccess<T> => ({
	success: true,
	...data
});

export const ERROR_RESPONSE = (
	error: string,
	code: AuthErrorCode = AUTH_ERRORS.DATABASE_ERROR
): AuthFailure => ({
	success: false,
	error,
	code
});
