import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { AUTH_ERRORS, SUCCESS_RESPONSE, ERROR_RESPONSE } from './AuthTypes';
import { TokenSecurity } from './TokenSecurity';
import type {
	AuthErrorResponse,
	TokenValidationSuccess,
	BusinessLookupSuccess
} from '$lib/types/auth';

const pool = createPool({ connectionString: POSTGRES_URL });

export class TokenManager {
	static async validateMagicLinkToken(
		token: string,
		businessSlug: string
	): Promise<TokenValidationSuccess | AuthErrorResponse> {
		try {
			// Tokens are stored hashed at rest; match against the hash of the
			// incoming raw token.
			const tokenHash = TokenSecurity.hashToken(token);
			const result = await pool.query(
				`SELECT id, businessname, slug, login_email, magic_link_token, isvisible, magic_link_token_expires_at
				 FROM us_businesses
				 WHERE slug = $1 AND magic_link_token = $2 AND magic_link_token IS NOT NULL`,
				[businessSlug, tokenHash]
			);

			if (result.rows.length === 0) {
				return ERROR_RESPONSE('Invalid or expired magic link', AUTH_ERRORS.INVALID_TOKEN);
			}

			const business = result.rows[0];

			// Reject expired tokens (a NULL expiry is treated as expired).
			if (TokenSecurity.isTokenExpired(business.magic_link_token_expires_at)) {
				return ERROR_RESPONSE('Invalid or expired magic link', AUTH_ERRORS.INVALID_TOKEN);
			}

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
					isvisible: business.isvisible
				}
			});
		} catch (error) {
			console.error('❌ Error validating magic link token:', error);
			return ERROR_RESPONSE('Database error during token validation', AUTH_ERRORS.DATABASE_ERROR);
		}
	}

	static async getBusinessByEmail(
		email: string
	): Promise<BusinessLookupSuccess | AuthErrorResponse> {
		let client;
		try {
			client = await pool.connect();

			const result = await client.query(
				`SELECT id, businessname, slug, login_email, isvisible
				 FROM us_businesses b
				 WHERE b.login_email = $1 AND b.isvisible = true
				   AND NOT EXISTS (SELECT 1 FROM us_branches br WHERE br.branch_id = b.id AND br.isactive = true)
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
					isvisible: business.isvisible
				}
			});
		} catch (error) {
			console.error('❌ Error getting business by email:', error);
			return ERROR_RESPONSE('Database error during business lookup', AUTH_ERRORS.DATABASE_ERROR);
		} finally {
			if (client) client.release();
		}
	}

	static async getBusinessBySlug(
		businessSlug: string
	): Promise<BusinessLookupSuccess | AuthErrorResponse> {
		try {
			const result = await pool.query(
				`SELECT id, businessname, slug, login_email, isvisible
				 FROM us_businesses
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
					isvisible: business.isvisible
				}
			});
		} catch (error) {
			console.error('❌ Error getting business by slug:', error);
			return ERROR_RESPONSE('Database error during business lookup', AUTH_ERRORS.DATABASE_ERROR);
		}
	}
}
