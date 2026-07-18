// India bindings over the shared auth module ($lib/auth/business). Keeps the
// historical import surface (`import { BusinessAuthService } from
// '$lib/in/auth/business'`) while all logic lives in one shared place.

import {
	BusinessAuthService as SharedBusinessAuthService,
	TokenManager as TokenManagerClass,
	PasswordManager as PasswordManagerClass,
	LoginTracker as LoginTrackerClass
} from '$lib/auth/business';

const COUNTRY = 'in' as const;

export class BusinessAuthService extends SharedBusinessAuthService {
	constructor() {
		super(COUNTRY);
	}
}

// Country-bound singletons; method call sites (`TokenManager.x(...)`) are
// unchanged from the old static-class API.
export const TokenManager = new TokenManagerClass(COUNTRY);
export const PasswordManager = new PasswordManagerClass(COUNTRY);
export const LoginTracker = new LoginTrackerClass(COUNTRY);

export {
	SessionManager,
	TokenSecurity,
	RateLimiter,
	passwordResetLimiter,
	AUTH_METHODS,
	AUTH_ERRORS,
	AUTH_CONFIG,
	SUCCESS_RESPONSE,
	ERROR_RESPONSE
} from '$lib/auth/business';

// Convenience function to create a new auth service instance
export function createBusinessAuthService(): BusinessAuthService {
	return new BusinessAuthService();
}
