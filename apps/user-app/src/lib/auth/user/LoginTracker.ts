import { and, eq, isNull, lt, or, sql } from 'drizzle-orm';
import { schema } from '@solar/db';
import { db } from '$lib/server/db';
import { AUTH_CONFIG } from './AuthTypes';

// `last_login` is a `mode: 'string'` timestamp in the introspected schema, but
// the driver returns a Date and `LastLoginUpdate.lastLogin` is `Date | null`.
// Restate the existing contract; renders as the bare column.
const LAST_LOGIN = sql<Date | null>`${schema.svUser.lastLogin}`;

export interface LastLoginUpdate {
	updated: boolean;
	lastLogin: Date | null;
	/** Only set when the update threw; tracking failures never fail the login. */
	error?: string;
}

export class LoginTracker {
	/**
	 * Update last_login for a user with throttling
	 */
	static async updateLastLogin(
		userId: number,
		options: { throttleHours?: number } = {}
	): Promise<LastLoginUpdate> {
		const throttleHours = options.throttleHours || AUTH_CONFIG.LAST_LOGIN_THROTTLE_HOURS;

		try {
			// Update only if last_login is null or older than throttle threshold.
			//
			// `sql` escape hatch for NOW() and the interval. The raw SQL built the
			// interval by string interpolation (`INTERVAL '${throttleHours} hours'`)
			// of a caller-supplied number — the one unparameterised value in this
			// app. make_interval() takes it as a real bind parameter instead.
			const rows = await db
				.update(schema.svUser)
				.set({ lastLogin: sql`NOW()` })
				.where(
					and(
						eq(schema.svUser.id, userId),
						or(
							isNull(schema.svUser.lastLogin),
							lt(schema.svUser.lastLogin, sql`NOW() - make_interval(hours => ${throttleHours})`)
						)
					)
				)
				.returning({ last_login: LAST_LOGIN });

			if (rows.length > 0) {
				console.log(`✅ Updated last_login for user ID: ${userId}`);
				return {
					updated: true,
					lastLogin: rows[0].last_login
				};
			} else {
				// Get current last_login for reference
				const current = await db
					.select({ last_login: LAST_LOGIN })
					.from(schema.svUser)
					.where(eq(schema.svUser.id, userId));

				return {
					updated: false,
					lastLogin: current[0]?.last_login || null
				};
			}
		} catch (error) {
			console.error('❌ Error updating last_login:', error);
			// Don't throw - login should still succeed even if tracking fails
			return {
				updated: false,
				lastLogin: null,
				error: error instanceof Error ? error.message : String(error)
			};
		}
	}

	/**
	 * Get last login time for a user
	 */
	static async getLastLogin(userId: number): Promise<Date | null> {
		try {
			const rows = await db
				.select({ last_login: LAST_LOGIN })
				.from(schema.svUser)
				.where(eq(schema.svUser.id, userId));
			return rows[0]?.last_login || null;
		} catch (error) {
			console.error('❌ Error getting last_login:', error);
			return null;
		}
	}
}
