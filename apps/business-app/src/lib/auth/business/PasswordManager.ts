import bcrypt from 'bcrypt';
import { db } from '$lib/server/db';
import { businessAccounts, businessProfiles } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';
import type { Business, AuthResponse } from '$lib/types/auth';
import { AUTH_ERRORS, SUCCESS_RESPONSE, ERROR_RESPONSE } from '$lib/types/auth';
import type { AuthCountry } from './countryTables';

export class PasswordManager {
	constructor(private readonly country: AuthCountry) {}

	async validatePassword(
		email: string,
		password: string,
		business: Business
	): Promise<AuthResponse<{ business: Business }>> {
		try {
			// Check if email matches
			if (business.login_email !== email) {
				return ERROR_RESPONSE('Invalid credentials', AUTH_ERRORS.INVALID_CREDENTIALS);
			}

			// Get business with password hash from database
			const rows = await db
				.select({ loginPassword: businessAccounts.loginPassword })
				.from(businessAccounts)
				.innerJoin(
					businessProfiles,
					and(
						eq(businessProfiles.countryCode, businessAccounts.countryCode),
						// 075: the credential lives on the account the profile names.
						// For a branch that is its main's — which is what it has always
						// been in effect, since the branch's own account was a copy.
						eq(businessProfiles.accountBusinessId, businessAccounts.sourceId)
					)
				)
				.where(
					and(
						eq(businessAccounts.countryCode, this.country),
						eq(businessAccounts.loginEmail, email),
						eq(businessProfiles.slug, business.slug)
					)
				);

			if (rows.length === 0 || !rows[0].loginPassword) {
				return ERROR_RESPONSE(
					'Password authentication not available. Please use magic link.',
					AUTH_ERRORS.INVALID_CREDENTIALS
				);
			}

			const hashedPassword = rows[0].loginPassword;
			const isValid = await bcrypt.compare(password, hashedPassword);

			if (isValid) {
				return SUCCESS_RESPONSE({ business });
			} else {
				return ERROR_RESPONSE('Invalid credentials', AUTH_ERRORS.INVALID_CREDENTIALS);
			}
		} catch (error) {
			console.error('❌ Error validating password:', error);
			return ERROR_RESPONSE('Error during password validation', AUTH_ERRORS.DATABASE_ERROR);
		}
	}

	async hashPassword(password: string): Promise<string> {
		try {
			const saltRounds = 12;
			return await bcrypt.hash(password, saltRounds);
		} catch (error) {
			console.error('❌ Error hashing password:', error);
			throw new Error('Password hashing failed');
		}
	}
}
