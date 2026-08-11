// api/addBranch resolves the acting business's country and tags the new branch
// with it. The bug this file was written for: the insert never set country_code,
// which defaulted to 'in', so a US business's branch was IN-tagged and vanished
// from its own branch list forever.
//
// 079 removed the column that bug lived in. A branch has no country of its own
// any more — it shares its main's account, and the account is where country is
// stored — so the mistake is now unrepresentable rather than merely fixed. These
// tests are kept and rewritten to assert the property through the join, because
// what has to stay true is the outcome (a US main's branch is a US branch), and
// that could still break if addBranch ever mis-set account_business_id.

import { beforeEach, describe, expect, it } from 'vitest';
import { pool } from '../setup/testDb';
import { createBusiness, createUsBusiness, resetDatabase } from '../helpers/fixtures';
import { createSessionCookies, jsonRequest } from '../helpers/request';

const { POST: addBranch } = await import('../../src/routes/api/addBranch/+server');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function event(body: unknown, cookies: ReturnType<typeof createSessionCookies>): any {
	return { request: jsonRequest(body), cookies };
}

async function branchesOf(country: 'in' | 'us', mainId: number) {
	// Both halves of what this file pins, in one query. `branches` is gone (078),
	// so a branch is a profile naming `mainId` in account_business_id but not
	// itself; country is gone from business_profiles (079), so it comes from the
	// account that link reaches. That account is the main's, which is exactly why
	// a branch can no longer disagree with its main about what country it is in.
	const { rows } = await pool.query<{ slug: string; country_code: string }>(
		`SELECT p.slug, a.country_code
		   FROM business_profiles p
		   JOIN business_accounts a ON a.source_id = p.account_business_id
		  WHERE p.account_business_id = $1 AND p.business_id <> $1 AND a.country_code = $2`,
		[mainId, country]
	);
	return rows;
}

describe('api/addBranch country tagging', () => {
	beforeEach(async () => {
		await resetDatabase();
	});

	it('projects a US business’s new branch into the unified tables', async () => {
		const mainId = await createUsBusiness({
			slug: 'oakland-solar',
			state: 'California',
			county: 'Alameda',
			city: 'Oakland'
		});
		const cookies = createSessionCookies({
			id: mainId,
			slug: 'oakland-solar',
			businessname: 'Test US Business'
		});

		const response = await addBranch(
			event(
				{ businessId: mainId, state: 'California', district: 'Alameda', city: 'Berkeley' },
				cookies
			)
		);
		const result = await response.json();

		expect(result.success).toBe(true);

		// Before the fix the row landed in businesses_1 with country_code 'in',
		// so the 'us' sync was a no-op and this came back empty.
		const branches = await branchesOf('us', mainId);
		expect(branches).toHaveLength(1);
		expect(branches[0].country_code.trim()).toBe('us');
	});

	it('reaches the right country from the branch row itself', async () => {
		const mainId = await createUsBusiness({ slug: 'oakland-solar', city: 'Oakland' });
		const cookies = createSessionCookies({
			id: mainId,
			slug: 'oakland-solar',
			businessname: 'Test US Business'
		});

		await addBranch(
			event(
				{ businessId: mainId, state: 'California', district: 'Alameda', city: 'Berkeley' },
				cookies
			)
		);

		// Asserted from the branch row outward, not from the main inward: start at
		// the profile the endpoint created and follow account_business_id. If
		// addBranch ever wrote the wrong link, this is where it shows up — the
		// branch would reach some other business's account, or none at all.
		const { rows } = await pool.query<{ country_code: string }>(
			`SELECT a.country_code
			   FROM business_profiles p
			   JOIN business_accounts a ON a.source_id = p.account_business_id
			  WHERE p.city = 'Berkeley'`
		);
		expect(rows).toHaveLength(1);
		expect(rows[0].country_code.trim()).toBe('us');
	});

	it('still projects an IN business’s new branch', async () => {
		const mainId = await createBusiness({ slug: 'pune-solar', city: 'Pune' });
		const cookies = createSessionCookies({
			id: mainId,
			slug: 'pune-solar',
			businessname: 'Test Business'
		});

		const response = await addBranch(
			event(
				{ businessId: mainId, state: 'Maharashtra', district: 'Pune', city: 'Kothrud' },
				cookies
			)
		);
		const result = await response.json();

		expect(result.success).toBe(true);
		const branches = await branchesOf('in', mainId);
		expect(branches).toHaveLength(1);
		expect(branches[0].country_code.trim()).toBe('in');
	});

	it('points the new branch at its main as the account holder', async () => {
		// 075. business_accounts is one row per business rather than one per
		// profile, so a branch has to name the profile whose account it uses. Since
		// 078 this column is also the ONLY record of the relationship — `branches`
		// is gone — so if addBranch stops writing it, the branch is not merely
		// mislinked but invisible as a branch to every query in the app.
		const mainId = await createBusiness({ slug: 'pune-solar', businessname: 'Pune Solar' });
		const cookies = createSessionCookies({
			id: mainId,
			slug: 'pune-solar',
			businessname: 'Pune Solar'
		});

		await addBranch(
			event(
				{ businessId: mainId, state: 'Maharashtra', district: 'Pune', city: 'Kothrud' },
				cookies
			)
		);

		const { rows } = await pool.query<{ business_id: number; account_business_id: number }>(
			`SELECT business_id, account_business_id
			   FROM business_profiles
			  WHERE account_business_id = $1 AND business_id <> $1`,
			[mainId]
		);

		expect(rows).toHaveLength(1);
		expect(rows[0].account_business_id).toBe(mainId);
		expect(rows[0].account_business_id).not.toBe(rows[0].business_id);
	});

	it('leaves a main business owning its own account', async () => {
		const mainId = await createBusiness({ slug: 'pune-solar' });

		const { rows } = await pool.query<{ account_business_id: number }>(
			'SELECT account_business_id FROM business_profiles WHERE business_id = $1',
			[mainId]
		);

		expect(rows[0].account_business_id).toBe(mainId);
	});

	it('does not cross-project a branch into the other country', async () => {
		const mainId = await createUsBusiness({ slug: 'oakland-solar', city: 'Oakland' });
		const cookies = createSessionCookies({
			id: mainId,
			slug: 'oakland-solar',
			businessname: 'Test US Business'
		});

		await addBranch(
			event(
				{ businessId: mainId, state: 'California', district: 'Alameda', city: 'Berkeley' },
				cookies
			)
		);

		expect(await branchesOf('in', mainId)).toEqual([]);
	});
});
