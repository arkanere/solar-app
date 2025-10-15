import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { AUTH_ERRORS, SUCCESS_RESPONSE, ERROR_RESPONSE } from './AuthTypes.js';

const pool = createPool({ connectionString: POSTGRES_URL });

export class TokenManager {
	/**
	 * Validate magic link token and get business
	 * @param {string} token - Magic link token
	 * @param {string} businessSlug - Business slug from URL
	 * @returns {Promise<Object>} Validation result with business data
	 */
	static async validateMagicLinkToken(token, businessSlug) {
		try {
			// Query business with matching token and slug
			const result = await pool.query(
				`SELECT id, businessname, slug, login_email, magic_link_token, isvisible, tier3
				 FROM businesses_1
				 WHERE slug = $1 AND magic_link_token = $2 AND magic_link_token IS NOT NULL`,
				[businessSlug, token]
			);

			if (result.rows.length === 0) {
				return ERROR_RESPONSE('Invalid or expired magic link', AUTH_ERRORS.INVALID_TOKEN);
			}

			const business = result.rows[0];

			// Check if business is visible/active
			if (!business.isvisible) {
				return ERROR_RESPONSE('Business account is not active', AUTH_ERRORS.INVALID_BUSINESS);
			}
			return SUCCESS_RESPONSE({
				business: {
					id: business.id,
					businessname: business.businessname,
					slug: business.slug,
					login_email: business.login_email,
					isvisible: business.isvisible,
					tier3: business.tier3
				}
			});

		} catch (error) {
			console.error('❌ Error validating magic link token:', error);
			return ERROR_RESPONSE('Database error during token validation', AUTH_ERRORS.DATABASE_ERROR);
		}
	}

	/**
	 * Get business by email for generic login
	 * @param {string} email - Business email
	 * @returns {Promise<Object>} Business data or error
	 */
	static async getBusinessByEmail(email) {
		let client;
		try {
			client = await pool.connect();

			const result = await client.query(
				`SELECT id, businessname, slug, login_email, isvisible, tier3
				 FROM businesses_1
				 WHERE login_email = $1 AND isvisible = true AND slug NOT LIKE '%-branch-%'
				 LIMIT 1`,
				[email]
			);

			if (result.rows.length === 0) {
				return ERROR_RESPONSE('Business not found', AUTH_ERRORS.BUSINESS_NOT_FOUND);
			}

			const business = result.rows[0];
			
			return SUCCESS_RESPONSE({
				business: {
					id: business.id,
					businessname: business.businessname,
					slug: business.slug,
					login_email: business.login_email,
					isvisible: business.isvisible,
					tier3: business.tier3
				}
			});

		} catch (error) {
			console.error('❌ Error getting business by email:', error);
			return ERROR_RESPONSE('Database error during business lookup', AUTH_ERRORS.DATABASE_ERROR);
		} finally {
			if (client) client.release();
		}
	}

	/**
	 * Get business by slug for password authentication
	 * @param {string} businessSlug - Business slug
	 * @returns {Promise<Object>} Business data or error
	 */
	static async getBusinessBySlug(businessSlug) {
		try {
			const result = await pool.query(
				`SELECT id, businessname, slug, login_email, isvisible, tier3
				 FROM businesses_1
				 WHERE slug = $1 AND isvisible = true`,
				[businessSlug]
			);

			if (result.rows.length === 0) {
				return ERROR_RESPONSE('Business not found', AUTH_ERRORS.BUSINESS_NOT_FOUND);
			}

			const business = result.rows[0];
			
			return SUCCESS_RESPONSE({
				business: {
					id: business.id,
					businessname: business.businessname,
					slug: business.slug,
					login_email: business.login_email,
					isvisible: business.isvisible,
					tier3: business.tier3
				}
			});

		} catch (error) {
			console.error('❌ Error getting business by slug:', error);
			return ERROR_RESPONSE('Database error during business lookup', AUTH_ERRORS.DATABASE_ERROR);
		}
	}
}