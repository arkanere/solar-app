import { db } from '$lib/server/db';
import { branches, businessAccounts, businesses } from '@solar/db/schema';
import { and, eq, isNotNull, notExists } from 'drizzle-orm';
import { AUTH_ERRORS, SUCCESS_RESPONSE, ERROR_RESPONSE } from './AuthTypes';
import { TokenSecurity } from './TokenSecurity';
import type { AuthCountry } from './countryTables';
import type {
	AuthErrorResponse,
	TokenValidationSuccess,
	BusinessLookupSuccess
} from '$lib/types/auth';


export class TokenManager {
	constructor(private readonly country: AuthCountry) {}

	async validateMagicLinkToken(
		token: string,
		businessSlug: string
	): Promise<TokenValidationSuccess | AuthErrorResponse> {
		try {
			// Tokens are stored hashed at rest; match against the hash of the
			// incoming raw token.
			const tokenHash = TokenSecurity.hashToken(token);
			const rows = await db
				.select({
					id: businessAccounts.sourceId,
					businessname: businesses.businessname,
					slug: businesses.slug,
					login_email: businessAccounts.loginEmail,
					magic_link_token: businessAccounts.magicLinkToken,
					isvisible: businessAccounts.isvisible,
					magic_link_token_expires_at: businessAccounts.magicLinkTokenExpiresAt
				})
				.from(businessAccounts)
				.innerJoin(
					businesses,
					and(
						eq(businesses.countryCode, businessAccounts.countryCode),
						eq(businesses.sourceId, businessAccounts.sourceId)
					)
				)
				.where(
					and(
						eq(businessAccounts.countryCode, this.country),
						eq(businesses.slug, businessSlug),
						eq(businessAccounts.magicLinkToken, tokenHash),
						isNotNull(businessAccounts.magicLinkToken)
					)
				);

			if (rows.length === 0) {
				return ERROR_RESPONSE('Invalid or expired magic link', AUTH_ERRORS.INVALID_TOKEN);
			}

			const business = rows[0];

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

	async getBusinessByEmail(email: string): Promise<BusinessLookupSuccess | AuthErrorResponse> {
		try {
			// `branches` covers both countries: it keys on businesses_1 ids, which
			// are global since 054, and it already held the single US row that
			// `us_branches` had. There is no unified branches table, so this stays
			// on the legacy one.
			const rows = await db
				.select({
					id: businessAccounts.sourceId,
					businessname: businesses.businessname,
					slug: businesses.slug,
					login_email: businessAccounts.loginEmail,
					isvisible: businessAccounts.isvisible
				})
				.from(businessAccounts)
				.innerJoin(
					businesses,
					and(
						eq(businesses.countryCode, businessAccounts.countryCode),
						eq(businesses.sourceId, businessAccounts.sourceId)
					)
				)
				.where(
					and(
						eq(businessAccounts.countryCode, this.country),
						eq(businessAccounts.loginEmail, email),
						eq(businessAccounts.isvisible, true),
						notExists(
							db
								.select({ one: branches.id })
								.from(branches)
								.where(
									and(
										eq(branches.branchId, businessAccounts.sourceId),
										eq(branches.isactive, true)
									)
								)
						)
					)
				)
				.limit(1);

			if (rows.length === 0) {
				return ERROR_RESPONSE('Business not found', AUTH_ERRORS.BUSINESS_NOT_FOUND);
			}

			const business = rows[0];

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
		}
	}

	async getBusinessBySlug(businessSlug: string): Promise<BusinessLookupSuccess | AuthErrorResponse> {
		try {
			const rows = await db
				.select({
					id: businessAccounts.sourceId,
					businessname: businesses.businessname,
					slug: businesses.slug,
					login_email: businessAccounts.loginEmail,
					isvisible: businessAccounts.isvisible
				})
				.from(businessAccounts)
				.innerJoin(
					businesses,
					and(
						eq(businesses.countryCode, businessAccounts.countryCode),
						eq(businesses.sourceId, businessAccounts.sourceId)
					)
				)
				.where(
					and(
						eq(businessAccounts.countryCode, this.country),
						eq(businesses.slug, businessSlug),
						eq(businessAccounts.isvisible, true)
					)
				);

			if (rows.length === 0) {
				return ERROR_RESPONSE('Business not found', AUTH_ERRORS.BUSINESS_NOT_FOUND);
			}

			const business = rows[0];

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
