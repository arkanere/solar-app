// Main export file for business authentication system

export { BusinessAuthService } from './BusinessAuthService.js';
export { SessionManager } from './SessionManager.js';
export { LoginTracker } from './LoginTracker.js';
export { TokenManager } from './TokenManager.js';
export { PasswordManager } from './PasswordManager.js';
export { 
	AUTH_METHODS, 
	AUTH_ERRORS, 
	AUTH_CONFIG, 
	SUCCESS_RESPONSE, 
	ERROR_RESPONSE 
} from './AuthTypes.js';

// Convenience function to create a new auth service instance
export function createBusinessAuthService() {
	return new BusinessAuthService();
}