import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { AUTH_CONFIG } from './AuthTypes.js';

const pool = createPool({ connectionString: POSTGRES_URL });

export class LoginTracker {
	/**
	 * Update last_login for a business with throttling
	 * @param {number} businessId - The business ID
	 * @param {Object} options - Configuration options
	 * @param {number} options.throttleHours - Hours to throttle updates (default: 6)
	 * @returns {Promise<{updated: boolean, lastLogin: Date|null}>}
	 */
	static async updateLastLogin(businessId, options = {}) {
		const throttleHours = options.throttleHours || AUTH_CONFIG.LAST_LOGIN_THROTTLE_HOURS;

		try {
			// Update only if last_login is null or older than throttle threshold
			const result = await pool.query(
				`UPDATE businesses_1 
				 SET last_login = NOW() 
				 WHERE id = $1 
				   AND (last_login IS NULL OR last_login < NOW() - INTERVAL '${throttleHours} hours')
				 RETURNING last_login`,
				[businessId]
			);

			if (result.rows.length > 0) {
				console.log(`✅ Updated last_login for business ID: ${businessId}`);
				return {
					updated: true,
					lastLogin: result.rows[0].last_login
				};
			} else {
				// Get current last_login for reference
				const currentResult = await pool.query(
					'SELECT last_login FROM businesses_1 WHERE id = $1',
					[businessId]
				);
				
				return {
					updated: false,
					lastLogin: currentResult.rows[0]?.last_login || null
				};
			}
		} catch (error) {
			console.error('❌ Error updating last_login:', error);
			// Don't throw - login should still succeed even if tracking fails
			return {
				updated: false,
				lastLogin: null,
				error: error.message
			};
		}
	}

	/**
	 * Get last login time for a business
	 * @param {number} businessId - The business ID
	 * @returns {Promise<Date|null>}
	 */
	static async getLastLogin(businessId) {
		try {
			const result = await pool.query(
				'SELECT last_login FROM businesses_1 WHERE id = $1',
				[businessId]
			);
			return result.rows[0]?.last_login || null;
		} catch (error) {
			console.error('❌ Error getting last_login:', error);
			return null;
		}
	}
}