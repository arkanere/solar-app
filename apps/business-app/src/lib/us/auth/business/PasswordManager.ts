import bcrypt from 'bcrypt';
import type { Business, AuthResponse } from '$lib/types/auth';
import { AUTH_ERRORS, SUCCESS_RESPONSE, ERROR_RESPONSE } from '$lib/types/auth';

export class PasswordManager {
	static async validatePassword(
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
			const { createPool } = await import('@vercel/postgres');
			const { POSTGRES_URL } = await import('$env/static/private');

			const pool = createPool({ connectionString: POSTGRES_URL });
			let client;

			try {
				client = await pool.connect();
				const result = await client.query<{ login_password: string | null }>(
					'SELECT login_password FROM us_businesses WHERE login_email = $1 AND slug = $2',
					[email, business.slug]
				);

				if (result.rows.length === 0 || !result.rows[0].login_password) {
					return ERROR_RESPONSE(
						'Password authentication not available. Please use magic link.',
						AUTH_ERRORS.INVALID_CREDENTIALS
					);
				}

				const hashedPassword = result.rows[0].login_password;
				const isValid = await bcrypt.compare(password, hashedPassword);

				if (isValid) {
					return SUCCESS_RESPONSE({ business });
				} else {
					return ERROR_RESPONSE('Invalid credentials', AUTH_ERRORS.INVALID_CREDENTIALS);
				}
			} finally {
				if (client) client.release();
			}
		} catch (error) {
			console.error('❌ Error validating password:', error);
			return ERROR_RESPONSE('Error during password validation', AUTH_ERRORS.DATABASE_ERROR);
		}
	}

	static async hashPassword(password: string): Promise<string> {
		try {
			const saltRounds = 12;
			return await bcrypt.hash(password, saltRounds);
		} catch (error) {
			console.error('❌ Error hashing password:', error);
			throw new Error('Password hashing failed');
		}
	}
}
