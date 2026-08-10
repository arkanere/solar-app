// Characterization tests for RateLimiter (Phase 5.5).
//
// Pins down the throttle's three behaviors that matter: the count is shared
// (it lives in Postgres, not in a per-instance Map), the window resets on its
// own schedule rather than on a timer the app controls, and a broken store
// fails OPEN. That last one is a deliberate product decision — the limiter is
// a throttle, not an auth boundary — and is exactly the kind of thing a
// refactor silently inverts into fail-closed, locking every user out.

import { beforeEach, describe, expect, it } from 'vitest';
import { RateLimiter } from '$lib/auth/business/RateLimiter';
import { pool } from '../setup/testDb';
import { resetDatabase } from '../helpers/fixtures';

const limiter = new RateLimiter();

beforeEach(async () => {
	await resetDatabase();
});

describe('RateLimiter.checkLimit', () => {
	it('allows exactly maxAttempts requests, then blocks', async () => {
		const results = [];
		for (let i = 0; i < 6; i++) {
			results.push(await limiter.checkLimit('user@example.test', 5));
		}

		expect(results.slice(0, 5).map((r) => r.allowed)).toEqual([true, true, true, true, true]);
		expect(results[5].allowed).toBe(false);
	});

	it('reports a retryAfter within the window when blocked', async () => {
		const windowMs = 15 * 60 * 1000;
		for (let i = 0; i < 5; i++) await limiter.checkLimit('user@example.test', 5, windowMs);

		const blocked = await limiter.checkLimit('user@example.test', 5, windowMs);

		expect(blocked.allowed).toBe(false);
		expect(blocked.retryAfter).toBeGreaterThan(0);
		expect(blocked.retryAfter).toBeLessThanOrEqual(windowMs / 1000);
	});

	it('counts each identifier separately', async () => {
		for (let i = 0; i < 6; i++) await limiter.checkLimit('noisy@example.test', 5);

		const other = await limiter.checkLimit('quiet@example.test', 5);

		expect(other.allowed).toBe(true);
	});

	it('persists the count across instances — the state is in Postgres, not in memory', async () => {
		for (let i = 0; i < 5; i++) await limiter.checkLimit('user@example.test', 5);

		// A different instance stands in for a different serverless invocation.
		const freshInstance = new RateLimiter();
		const result = await freshInstance.checkLimit('user@example.test', 5);

		expect(result.allowed).toBe(false);
	});

	it('starts a fresh window once the old one has elapsed', async () => {
		for (let i = 0; i < 6; i++) await limiter.checkLimit('user@example.test', 5);
		expect((await limiter.checkLimit('user@example.test', 5)).allowed).toBe(false);

		// Expire the window in the store rather than waiting 15 real minutes.
		await pool.query("UPDATE rate_limits SET reset_time = now() - interval '1 second'");

		const afterWindow = await limiter.checkLimit('user@example.test', 5);
		expect(afterWindow.allowed).toBe(true);

		// ...and the fresh window starts the count over at 1, not at 6.
		const { rows } = await pool.query<{ count: number }>('SELECT count FROM rate_limits');
		expect(rows[0].count).toBe(1);
	});

	it('fails OPEN when the store is unreachable', async () => {
		// Take the table out from under it: any store error must allow the
		// request through rather than block a login on a database hiccup.
		//
		// Renamed aside rather than dropped, so the real table comes back byte for
		// byte. This used to DROP and then CREATE the table by hand — a stub that
		// happened to match, but only until someone alters the real schema and
		// forgets this file. That is exactly how the same pattern in
		// updateLeadByBusiness.test.ts recreated a three-column
		// project_management against a five-column table and broke four tests, and
		// it stayed invisible until a new test file reordered the suite.
		await pool.query('ALTER TABLE rate_limits RENAME TO rate_limits_hidden');
		try {
			const result = await limiter.checkLimit('user@example.test', 5);
			expect(result).toEqual({ allowed: true, retryAfter: 0 });
		} finally {
			await pool.query('ALTER TABLE rate_limits_hidden RENAME TO rate_limits');
		}
	});
});

describe('RateLimiter.reset', () => {
	it('clears the count for that identifier', async () => {
		for (let i = 0; i < 6; i++) await limiter.checkLimit('user@example.test', 5);
		expect((await limiter.checkLimit('user@example.test', 5)).allowed).toBe(false);

		await limiter.reset('user@example.test');

		expect((await limiter.checkLimit('user@example.test', 5)).allowed).toBe(true);
	});

	it('leaves other identifiers alone', async () => {
		for (let i = 0; i < 6; i++) await limiter.checkLimit('a@example.test', 5);

		await limiter.reset('b@example.test');

		expect((await limiter.checkLimit('a@example.test', 5)).allowed).toBe(false);
	});
});
