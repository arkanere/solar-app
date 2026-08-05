import { and, eq, isNotNull, sql } from 'drizzle-orm';
import { schema } from '@solar/db';
import { db } from '$lib/server/db';
import crypto from 'crypto';
import {
	AUTH_ERRORS,
	SUCCESS_RESPONSE,
	ERROR_RESPONSE,
	type AuthResult,
	type AuthUser
} from './AuthTypes';

// The introspected schema types timestamptz as `mode: 'string'`, but the driver
// hands back Date objects and `AuthUser.created_at` is `Date | null`. Restate
// the real contract rather than widen AuthUser — the column is unchanged in the
// generated SQL. Same for `magic_link_token_expires_at`, which is fed straight
// into `new Date()` below.
const USER_SELECTION = {
	id: schema.inUser.id,
	email: schema.inUser.email,
	name: schema.inUser.name,
	created_at: sql<Date | null>`${schema.inUser.createdAt}`
};

export class TokenManager {
	/**
	 * Validate magic link token and get user
	 */
	static async validateMagicLinkToken(token: string): Promise<AuthResult<{ user: AuthUser }>> {
		try {
			// Tokens are stored hashed at rest; match against the hash of the
			// incoming raw token.
			const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
			const rows = await db
				.select({
					...USER_SELECTION,
					magic_link_token_expires_at: sql<
						Date | null
					>`${schema.inUser.magicLinkTokenExpiresAt}`
				})
				.from(schema.inUser)
				.where(
					and(
						eq(schema.inUser.magicLinkToken, tokenHash),
						isNotNull(schema.inUser.magicLinkToken)
					)
				);

			if (rows.length === 0) {
				return ERROR_RESPONSE('Invalid or expired magic link', AUTH_ERRORS.INVALID_TOKEN);
			}

			const user = rows[0];

			// Reject expired tokens (a NULL expiry is treated as expired).
			const expiresAt = user.magic_link_token_expires_at;
			if (!expiresAt || new Date() > new Date(expiresAt)) {
				return ERROR_RESPONSE('Invalid or expired magic link', AUTH_ERRORS.INVALID_TOKEN);
			}

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
	 */
	static async getUserByEmail(email: string): Promise<AuthResult<{ user: AuthUser }>> {
		try {
			// Previously checked out a dedicated client for a single SELECT and
			// released it in a `finally`; the shared pool does that itself.
			const rows = await db
				.select(USER_SELECTION)
				.from(schema.inUser)
				.where(eq(schema.inUser.email, email))
				.limit(1);

			if (rows.length === 0) {
				return ERROR_RESPONSE('User not found', AUTH_ERRORS.USER_NOT_FOUND);
			}

			return SUCCESS_RESPONSE({ user: rows[0] });
		} catch (error) {
			console.error('❌ Error getting user by email:', error);
			return ERROR_RESPONSE('Database error during user lookup', AUTH_ERRORS.DATABASE_ERROR);
		}
	}

	/**
	 * Get user by ID
	 */
	static async getUserById(userId: number): Promise<AuthResult<{ user: AuthUser }>> {
		try {
			const rows = await db
				.select(USER_SELECTION)
				.from(schema.inUser)
				.where(eq(schema.inUser.id, userId));

			if (rows.length === 0) {
				return ERROR_RESPONSE('User not found', AUTH_ERRORS.USER_NOT_FOUND);
			}

			return SUCCESS_RESPONSE({ user: rows[0] });
		} catch (error) {
			console.error('❌ Error getting user by ID:', error);
			return ERROR_RESPONSE('Database error during user lookup', AUTH_ERRORS.DATABASE_ERROR);
		}
	}
}
