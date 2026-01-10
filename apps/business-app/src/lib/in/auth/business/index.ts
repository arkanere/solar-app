// Main export file for business authentication system

import { BusinessAuthService } from './BusinessAuthService';
import { SessionManager } from './SessionManager';
import { LoginTracker } from './LoginTracker';
import { TokenManager } from './TokenManager';
import { PasswordManager } from './PasswordManager';
import {
	AUTH_METHODS,
	AUTH_ERRORS,
	AUTH_CONFIG,
	SUCCESS_RESPONSE,
	ERROR_RESPONSE
} from './AuthTypes';

export {
	BusinessAuthService,
	SessionManager,
	LoginTracker,
	TokenManager,
	PasswordManager,
	AUTH_METHODS,
	AUTH_ERRORS,
	AUTH_CONFIG,
	SUCCESS_RESPONSE,
	ERROR_RESPONSE
};

// Convenience function to create a new auth service instance
export function createBusinessAuthService(): BusinessAuthService {
	return new BusinessAuthService();
}
