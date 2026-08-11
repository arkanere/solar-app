// Migration 062 archived businesses_1 and turned business_accounts from a
// projection into a store. That inverts the standing rule the rest of the suite
// is built on ("write the store, then call sync*ToUnified"), and it creates one
// specific failure mode worth pinning: a writer that creates a business without
// its account row.
//
// Before 062 that was impossible. login_email lived on businesses_1, the id mint
// and the credential write were the same INSERT, and sv_sync_account fanned it
// out — so an account row always existed. Now the two are separate statements in
// three endpoints (submitBusiness, addBranch, claimLead's auto-branch), and
// forgetting the second one produces a business that looks completely healthy —
// it is in `businesses`, it appears in listings, it has a slug — and simply
// cannot log in, be sent a magic link, or reset its password. Nothing else in
// the suite would notice.
//
// These tests assert the invariant directly rather than through any one
// endpoint, so a fourth minting site added later is covered without being named.

import { beforeEach, describe, expect, it } from 'vitest';
import { pool } from '../setup/testDb';
import { createBusiness, createUsBusiness, resetDatabase } from '../helpers/fixtures';

beforeEach(async () => {
	await resetDatabase();
});

async function accountlessProfiles(): Promise<number[]> {
	const { rows } = await pool.query<{ business_id: number }>(
		`SELECT p.business_id
		   FROM business_profiles p
		   LEFT JOIN business_accounts a
		     ON a.source_id = p.account_business_id
		  WHERE a.id IS NULL
		  ORDER BY p.business_id`
	);
	return rows.map((r) => r.business_id);
}

describe('business_accounts is a store, not a projection', () => {
	it('has no function left that could rebuild it', async () => {
		// sv_sync_account was the projection. If it comes back, some writer can
		// quietly go back to depending on it instead of writing the row.
		const { rows } = await pool.query<{ proname: string }>(
			`SELECT proname FROM pg_proc WHERE proname IN ('sv_sync_account', 'sv_sync_in_split')`
		);
		expect(rows).toHaveLength(0);
	});

	it('every business created through a fixture has an account row', async () => {
		await createBusiness({ slug: 'in-one' });
		await createBusiness({ slug: 'in-two' });
		await createUsBusiness({ slug: 'us-one' });

		expect(await accountlessProfiles()).toEqual([]);
	});

	it('carries the country on the account, which is now the only copy', async () => {
		// 079 dropped business_profiles.country_code, so this row is where a
		// business's country lives. A row written with the wrong country is
		// invisible to login rather than wrong-tenant, and since the profile no
		// longer has a second copy to disagree with, this assertion is the only
		// thing standing between a US fixture and an IN-shaped one.
		const usId = await createUsBusiness({ slug: 'us-pairing' });

		const { rows } = await pool.query<{ country_code: string }>(
			'SELECT country_code FROM business_accounts WHERE source_id = $1',
			[usId]
		);
		expect(rows).toHaveLength(1);
		expect(rows[0].country_code.trim()).toBe('us');
	});

	it('mints ids from the sequence businesses_1 used, so they stay unique across countries', async () => {
		// businesses_1_id_seq was reassigned to business_profiles.business_id
		// rather than replaced. If a future change points business_id at
		// business_profiles_id_seq instead, ids restart low and collide with
		// (country_code, source_id) rows already in business_accounts.
		const inId = await createBusiness({ slug: 'seq-in' });
		const usId = await createUsBusiness({ slug: 'seq-us' });

		expect(usId).toBeGreaterThan(inId);
	});
});
