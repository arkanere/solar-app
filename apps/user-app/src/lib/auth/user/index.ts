// Main export file for user authentication system

import { UserAuthService } from './UserAuthService';

export { UserAuthService } from './UserAuthService';
export { SessionManager } from './SessionManager';
export { LoginTracker } from './LoginTracker';
export { TokenManager } from './TokenManager';
export {
	AUTH_METHODS,
	AUTH_ERRORS,
	AUTH_CONFIG,
	SUCCESS_RESPONSE,
	ERROR_RESPONSE
} from './AuthTypes';
export type {
	AuthMethod,
	AuthErrorCode,
	AuthUser,
	AuthSuccess,
	AuthFailure,
	AuthResult
} from './AuthTypes';
export type { SessionData } from './SessionManager';

// Convenience function to create a new auth service instance
export function createUserAuthService() {
	return new UserAuthService();
}
