// api/addBranch resolves the acting business's country and syncs the new branch
// with it, but the businesses_1 insert never set country_code — which defaults
// to 'in'. For a US business that made the row IN-tagged, so
// sv_sync_business('us', branchId) matched nothing and returned silently: the
// endpoint reported success, the branches join row existed, and the branch was
// absent from unified and therefore from the branch list forever.
//
// The IN cases pass either way (the default happened to be right for them);
// they are here so a future change to the default cannot break them unnoticed.

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
	// Read business_profiles rather than the `businesses` projection: 063 gave
	// this table the country-neutral names and 064 drops the projection, so the
	// branch row itself is what there is to assert on. The country tagging this
	// file exists to pin lives here — it was always the source column that was
	// wrong, and the projection only made the symptom visible.
	const { rows } = await pool.query<{ slug: string; country_code: string }>(
		`SELECT p.slug, p.country_code
		   FROM branches br
		   JOIN business_profiles p
		     ON p.business_id = br.branch_id AND p.country_code = $1
		  WHERE br.main_id = $2`,
		[country, mainId]
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

	it('tags the legacy row itself, not just the projection', async () => {
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

		// The projection is rebuilt from business_profiles on every sync, so an
		// IN-tagged source row would silently un-project the branch again on the
		// next resync even if the unified row were somehow correct.
		const { rows } = await pool.query<{ country_code: string }>(
			`SELECT country_code FROM business_profiles WHERE city = 'Berkeley'`
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
