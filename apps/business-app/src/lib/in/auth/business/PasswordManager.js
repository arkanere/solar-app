import bcrypt from 'bcrypt';
import { AUTH_ERRORS, SUCCESS_RESPONSE, ERROR_RESPONSE } from './AuthTypes.js';

export class PasswordManager {
	/**
	 * Validate password credentials using bcrypt
	 * @param {string} email - Business email
	 * @param {string} password - Plain text password
	 * @param {Object} business - Business data from database
	 * @returns {Promise<Object>} Validation result
	 */
	static async validatePassword(email, password, business) {
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
				const result = await client.query(
					'SELECT login_password FROM businesses_1 WHERE login_email = $1 AND slug = $2',
					[email, business.slug]
				);

				if (result.rows.length === 0 || !result.rows[0].login_password) {
					return ERROR_RESPONSE('Password authentication not available. Please use magic link.', AUTH_ERRORS.INVALID_CREDENTIALS);
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

	/**
	 * Hash password for storage (utility method for future use)
	 * @param {string} password - Plain text password
	 * @returns {Promise<string>} Hashed password
	 */
	static async hashPassword(password) {
		try {
			const saltRounds = 12;
			return await bcrypt.hash(password, saltRounds);
		} catch (error) {
			console.error('❌ Error hashing password:', error);
			throw new Error('Password hashing failed');
		}
	}
}