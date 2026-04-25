import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { AUTH_ERRORS, SUCCESS_RESPONSE, ERROR_RESPONSE } from './AuthTypes.js';

const pool = createPool({ connectionString: POSTGRES_URL });

export class TokenManager {
	/**
	 * Validate magic link token and get user
	 * @param {string} token - Magic link token
	 * @returns {Promise<Object>} Validation result with user data
	 */
	static async validateMagicLinkToken(token) {
		try {
			// Query user with matching token
			const result = await pool.query(
				`SELECT id, email, name, magic_link_token, created_at
				 FROM in_user
				 WHERE magic_link_token = $1 AND magic_link_token IS NOT NULL`,
				[token]
			);

			if (result.rows.length === 0) {
				return ERROR_RESPONSE('Invalid or expired magic link', AUTH_ERRORS.INVALID_TOKEN);
			}

			const user = result.rows[0];

			return SUCCESS_RESPONSE({
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					created_at: user.created_at
				}
			});
		} catch (error) {
			console.error('❌ Error validating magic link token:', error);
			return ERROR_RESPONSE('Database error during token validation', AUTH_ERRORS.DATABASE_ERROR);
		}
	}

	/**
	 * Get user by email
	 * @param {string} email - User email
	 * @returns {Promise<Object>} User data or error
	 */
	static async getUserByEmail(email) {
		let client;
		try {
			client = await pool.connect();

			const result = await client.query(
				`SELECT id, email, name, created_at
				 FROM in_user
				 WHERE email = $1
				 LIMIT 1`,
				[email]
			);

			if (result.rows.length === 0) {
				return ERROR_RESPONSE('User not found', AUTH_ERRORS.USER_NOT_FOUND);
			}

			const user = result.rows[0];

			return SUCCESS_RESPONSE({
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					created_at: user.created_at
				}
			});
		} catch (error) {
			console.error('❌ Error getting user by email:', error);
			return ERROR_RESPONSE('Database error during user lookup', AUTH_ERRORS.DATABASE_ERROR);
		} finally {
			if (client) client.release();
		}
	}

	/**
	 * Get user by ID
	 * @param {number} userId - User ID
	 * @returns {Promise<Object>} User data or error
	 */
	static async getUserById(userId) {
		try {
			const result = await pool.query(
				`SELECT id, email, name, created_at
				 FROM in_user
				 WHERE id = $1`,
				[userId]
			);

			if (result.rows.length === 0) {
				return ERROR_RESPONSE('User not found', AUTH_ERRORS.USER_NOT_FOUND);
			}

			const user = result.rows[0];

			return SUCCESS_RESPONSE({
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					created_at: user.created_at
				}
			});
		} catch (error) {
			console.error('❌ Error getting user by ID:', error);
			return ERROR_RESPONSE('Database error during user lookup', AUTH_ERRORS.DATABASE_ERROR);
		}
	}

	/**
	 * Clear the magic link token after successful login
	 * @param {number} userId - User ID
	 * @returns {Promise<Object>} Result of token clearing
	 */
	static async clearMagicLinkToken(userId) {
		try {
			await pool.query(
				`UPDATE in_user
				 SET magic_link_token = NULL
				 WHERE id = $1`,
				[userId]
			);

			return SUCCESS_RESPONSE({
				message: 'Token cleared successfully'
			});
		} catch (error) {
			console.error('❌ Error clearing magic link token:', error);
			// Don't fail authentication if we can't clear the token
			return ERROR_RESPONSE('Error clearing token', AUTH_ERRORS.DATABASE_ERROR);
		}
	}
}
