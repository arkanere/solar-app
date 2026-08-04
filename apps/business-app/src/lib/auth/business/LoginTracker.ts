import { db, pool } from '$lib/server/db';
import { businessAccounts, businesses1, usBusinesses } from '@solar/db/schema';
import { and, eq, isNull, lt, or, sql } from 'drizzle-orm';
import { AUTH_CONFIG, type LoginTrackerResult } from './AuthTypes';
import type { AuthCountry } from './countryTables';
import { syncAccountToUnified, syncInSplitTables } from '$lib/server/unifiedSync';


export class LoginTracker {
	constructor(private readonly country: AuthCountry) {}

	async updateLastLogin(
		businessId: number,
		options: { throttleHours?: number } = {}
	): Promise<LoginTrackerResult> {
		const throttleHours = options.throttleHours || AUTH_CONFIG.LAST_LOGIN_THROTTLE_HOURS;

		try {
			// Update only if last_login is null or older than throttle threshold.
			// Writes still target the legacy table (phase-2 transition); the
			// explicit sync projects the row into business_accounts.
			// Bind the interval as a parameter via make_interval (no string interpolation).
			const table = this.country === 'in' ? businesses1 : usBusinesses;
			const rows = await db
				.update(table)
				.set({ lastLogin: sql`NOW()` })
				.where(
					and(
						eq(table.id, businessId),
						or(
							isNull(table.lastLogin),
							lt(table.lastLogin, sql`NOW() - make_interval(hours => ${throttleHours})`)
						)
					)
				)
				.returning({ lastLogin: table.lastLogin });

			if (rows.length > 0) {
				if (this.country === 'in') {
					await syncInSplitTables(db, businessId);
				}
				await syncAccountToUnified(db, this.country, businessId);
				return {
					updated: true,
					lastLogin: rows[0].lastLogin ? new Date(rows[0].lastLogin) : null
				};
			} else {
				// Get current last_login for reference
				const current = await db
					.select({ lastLogin: businessAccounts.lastLogin })
					.from(businessAccounts)
					.where(
						and(
							eq(businessAccounts.countryCode, this.country),
							eq(businessAccounts.sourceId, businessId)
						)
					);

				return {
					updated: false,
					lastLogin: current[0]?.lastLogin ? new Date(current[0].lastLogin) : null
				};
			}
		} catch (error) {
			console.error('❌ Error updating last_login:', error);
			// Don't throw - login should still succeed even if tracking fails
			return {
				updated: false,
				lastLogin: null,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	async getLastLogin(businessId: number): Promise<Date | null> {
		try {
			const rows = await db
				.select({ lastLogin: businessAccounts.lastLogin })
				.from(businessAccounts)
				.where(
					and(
						eq(businessAccounts.countryCode, this.country),
						eq(businessAccounts.sourceId, businessId)
					)
				);
			return rows[0]?.lastLogin ? new Date(rows[0].lastLogin) : null;
		} catch (error) {
			console.error('❌ Error getting last_login:', error);
			return null;
		}
	}
}
