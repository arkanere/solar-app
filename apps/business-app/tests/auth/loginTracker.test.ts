// Characterization tests for LoginTracker (Phase 5.5).
//
// The behavior worth pinning: the write is throttled (a login within the
// threshold must not touch the row), the write lands in the legacy table but
// the *read* comes from the unified one — a split that only holds because the
// handler explicitly syncs between them — and a tracking failure never fails
// the login.

import { beforeEach, describe, expect, it } from 'vitest';
import { LoginTracker } from '$lib/auth/business/LoginTracker';
import { pool } from '../setup/testDb';
import { createBusiness, resetDatabase } from '../helpers/fixtures';

const tracker = new LoginTracker('in');

async function lastLoginInLegacyTable(businessId: number): Promise<Date | null> {
	const { rows } = await pool.query<{ last_login: Date | null }>(
		'SELECT last_login FROM businesses_1 WHERE id = $1',
		[businessId]
	);
	return rows[0].last_login;
}

beforeEach(async () => {
	await resetDatabase();
});

describe('LoginTracker.updateLastLogin', () => {
	it('writes last_login when it has never been set', async () => {
		const businessId = await createBusiness({ lastLogin: null });

		const result = await tracker.updateLastLogin(businessId);

		expect(result.updated).toBe(true);
		expect(result.lastLogin).toBeInstanceOf(Date);
		expect(await lastLoginInLegacyTable(businessId)).not.toBeNull();
	});

	it('skips the write when the last login is inside the throttle window', async () => {
		// Default throttle is 48h; one hour ago is well inside it.
		const businessId = await createBusiness();
		await pool.query("UPDATE businesses_1 SET last_login = NOW() - INTERVAL '1 hour' WHERE id = $1", [
			businessId
		]);
		await pool.query('SELECT sv_sync_account($1, $2)', ['in', businessId]);
		const before = await lastLoginInLegacyTable(businessId);

		const result = await tracker.updateLastLogin(businessId);

		expect(result.updated).toBe(false);
		expect(await lastLoginInLegacyTable(businessId)).toEqual(before);
	});

	it('writes again once the last login is older than the throttle window', async () => {
		const businessId = await createBusiness();
		await pool.query("UPDATE businesses_1 SET last_login = NOW() - INTERVAL '49 hours' WHERE id = $1", [
			businessId
		]);
		const before = await lastLoginInLegacyTable(businessId);

		const result = await tracker.updateLastLogin(businessId);

		expect(result.updated).toBe(true);
		expect(await lastLoginInLegacyTable(businessId)).not.toEqual(before);
	});

	it('honors an explicit throttleHours override', async () => {
		const businessId = await createBusiness();
		await pool.query("UPDATE businesses_1 SET last_login = NOW() - INTERVAL '2 hours' WHERE id = $1", [
			businessId
		]);

		// 2h old: inside a 48h throttle, outside a 1h one.
		expect((await tracker.updateLastLogin(businessId, { throttleHours: 48 })).updated).toBe(false);
		expect((await tracker.updateLastLogin(businessId, { throttleHours: 1 })).updated).toBe(true);
	});

	it('projects the write into business_accounts, which is what getLastLogin reads', async () => {
		const businessId = await createBusiness({ lastLogin: null });

		await tracker.updateLastLogin(businessId);

		// The update targets businesses_1; the read path targets business_accounts.
		// They only agree because updateLastLogin syncs between them.
		const { rows } = await pool.query<{ last_login: Date | null }>(
			'SELECT last_login FROM business_accounts WHERE country_code = $1 AND source_id = $2',
			['in', businessId]
		);
		expect(rows[0].last_login).not.toBeNull();
		expect(await tracker.getLastLogin(businessId)).toBeInstanceOf(Date);
	});

	it('reports failure instead of throwing, so a login still succeeds', async () => {
		// No such business — the UPDATE matches nothing, and the fallback read
		// finds nothing either.
		const result = await tracker.updateLastLogin(999);

		expect(result.updated).toBe(false);
		expect(result.lastLogin).toBeNull();
	});
});

describe('LoginTracker.getLastLogin', () => {
	it('returns null for a business with no recorded login', async () => {
		const businessId = await createBusiness({ lastLogin: null });

		expect(await tracker.getLastLogin(businessId)).toBeNull();
	});

	it('returns null for an unknown business rather than throwing', async () => {
		expect(await tracker.getLastLogin(999)).toBeNull();
	});
});
