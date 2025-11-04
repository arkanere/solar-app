// Main export file for user authentication system

export { UserAuthService } from './UserAuthService.js';
export { SessionManager } from './SessionManager.js';
export { LoginTracker } from './LoginTracker.js';
export { TokenManager } from './TokenManager.js';
export {
	AUTH_METHODS,
	AUTH_ERRORS,
	AUTH_CONFIG,
	SUCCESS_RESPONSE,
	ERROR_RESPONSE
} from './AuthTypes.js';

// Convenience function to create a new auth service instance
export function createUserAuthService() {
	return new UserAuthService();
}
