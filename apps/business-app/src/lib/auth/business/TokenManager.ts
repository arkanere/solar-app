import { db } from '$lib/server/db';
import { businessAccounts, businessProfiles } from '@solar/db/schema';
import { and, eq, isNotNull } from 'drizzle-orm';
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
			// 075: the slug names the profile, the profile names the account. For a
			// main those are the same row and this is unchanged; for a branch the
			// token lives on its main's account, which is where the link was minted.
			// `id` is the profile matched by the slug, not the account's own — a
			// branch link goes on identifying the branch, exactly as it did when the
			// branch had a duplicate account of its own.
			const rows = await db
				.select({
					id: businessProfiles.businessId,
					businessname: businessProfiles.businessname,
					slug: businessProfiles.slug,
					login_email: businessAccounts.loginEmail,
					magic_link_token: businessAccounts.magicLinkToken,
					isvisible: businessAccounts.isvisible,
					profileIsvisible: businessProfiles.isvisible,
					magic_link_token_expires_at: businessAccounts.magicLinkTokenExpiresAt
				})
				.from(businessAccounts)
				.innerJoin(
					businessProfiles,
					and(
						eq(businessProfiles.countryCode, businessAccounts.countryCode),
						eq(businessProfiles.accountBusinessId, businessAccounts.sourceId)
					)
				)
				.where(
					and(
						eq(businessAccounts.countryCode, this.country),
						eq(businessProfiles.slug, businessSlug),
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

			// Check if business is visible/active. Both flags: the account's says the
			// login is live, the profile's says *this location* is. They are kept in
			// step for a main, but a deactivated branch keeps its parent's live
			// account — so without the profile check, deleteBranch would stop listing
			// a branch while still letting a link sign in at its slug.
			if (!business.isvisible || !business.profileIsvisible) {
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
			// This used to exclude accounts whose id was an active branch, because a
			// branch carried a duplicate account holding its main's login_email — so
			// one address matched several accounts and the wrong one could win. 075
			// removed the duplicates: an account belongs to the profile that owns it,
			// and a branch has none, so the exclusion has nothing left to exclude and
			// the join below reaches the main directly.
			//
			// The limit(1) stays, and it is not yet redundant: 45 live addresses are
			// shared by two or more genuinely *different* businesses, so an email
			// still does not always name one account. That ambiguity predates this
			// and is untouched by it — the branch duplicates were a separate cause
			// with the same symptom.
			const rows = await db
				.select({
					id: businessAccounts.sourceId,
					businessname: businessProfiles.businessname,
					slug: businessProfiles.slug,
					login_email: businessAccounts.loginEmail,
					isvisible: businessAccounts.isvisible
				})
				.from(businessAccounts)
				.innerJoin(
					businessProfiles,
					and(
						eq(businessProfiles.countryCode, businessAccounts.countryCode),
						eq(businessProfiles.businessId, businessAccounts.sourceId)
					)
				)
				.where(
					and(
						eq(businessAccounts.countryCode, this.country),
						eq(businessAccounts.loginEmail, email),
						eq(businessAccounts.isvisible, true)
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
			// Looked up by slug, so the answer is the profile that slug names, with
			// its account reached through account_business_id. A branch slug used to
			// find the branch's duplicate account; now it finds its main's, and `id`
			// stays the branch either way.
			const rows = await db
				.select({
					id: businessProfiles.businessId,
					businessname: businessProfiles.businessname,
					slug: businessProfiles.slug,
					login_email: businessAccounts.loginEmail,
					isvisible: businessAccounts.isvisible
				})
				.from(businessAccounts)
				.innerJoin(
					businessProfiles,
					and(
						eq(businessProfiles.countryCode, businessAccounts.countryCode),
						eq(businessProfiles.accountBusinessId, businessAccounts.sourceId)
					)
				)
				.where(
					and(
						eq(businessAccounts.countryCode, this.country),
						eq(businessProfiles.slug, businessSlug),
						eq(businessAccounts.isvisible, true),
						// Same reason as validateMagicLinkToken: a hidden branch shares
						// its parent's live account, so the profile has to be asked too.
						eq(businessProfiles.isvisible, true)
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
