// Authentication constants and type definitions for user authentication

export const AUTH_METHODS = {
	MAGIC_LINK: 'magic-link',
	PASSWORD: 'password',
	GOOGLE_OAUTH: 'google-oauth'
};

export const AUTH_ERRORS = {
	INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
	EXPIRED_TOKEN: 'AUTH_EXPIRED_TOKEN',
	INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
	USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
	SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',
	DATABASE_ERROR: 'AUTH_DATABASE_ERROR',
	INVALID_USER: 'AUTH_INVALID_USER'
};

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
};

export const SUCCESS_RESPONSE = (data) => ({
	success: true,
	...data
});

export const ERROR_RESPONSE = (error, code = AUTH_ERRORS.DATABASE_ERROR) => ({
	success: false,
	error,
	code
});
