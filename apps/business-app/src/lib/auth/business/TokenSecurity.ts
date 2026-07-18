import crypto from 'crypto';
import type { PasswordValidationResult } from '$lib/types/auth';

// Secure token management for password reset and magic links
export class TokenSecurity {
	static hashToken(token: string): string {
		return crypto.createHash('sha256').update(token).digest('hex');
	}

	static generateSecureToken(bytes: number = 32): string {
		return crypto.randomBytes(bytes).toString('hex');
	}

	static validatePasswordStrength(password: string): PasswordValidationResult {
		const errors: string[] = [];

		if (!password || password.length < 8) {
			errors.push('Password must be at least 8 characters long');
		}

		if (!/[A-Z]/.test(password)) {
			errors.push('Password must contain at least one uppercase letter');
		}

		if (!/[a-z]/.test(password)) {
			errors.push('Password must contain at least one lowercase letter');
		}

		if (!/[0-9]/.test(password)) {
			errors.push('Password must contain at least one number');
		}

		if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
			errors.push('Password must contain at least one special character');
		}

		if (password.length > 128) {
			errors.push('Password must be less than 128 characters');
		}

		return {
			valid: errors.length === 0,
			errors
		};
	}

	static isTokenExpired(expiresAt: Date | string | null | undefined): boolean {
		if (!expiresAt) return true;
		return new Date() > new Date(expiresAt);
	}

	static getTokenExpiration(hours: number = 1): Date {
		const expiration = new Date();
		expiration.setHours(expiration.getHours() + hours);
		return expiration;
	}
}
