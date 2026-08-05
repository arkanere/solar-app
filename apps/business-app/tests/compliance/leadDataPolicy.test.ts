// Regression tests for the country-scoping of legal_acceptances (migration 053).
//
// legal_acceptances.business_id used to reference businesses_1(id) — the IN
// table — which made the entire /us compliance path impossible:
//
//   * recordLeadDataAcceptance() threw a FK violation for any US business, so
//     no US business could ever accept the policy;
//   * checkLeadDataPolicy() therefore always returned compliant:false, and
//   * /us/api/claimLead returned 403 compliance_required on every request.
//
// The acceptance is now keyed (country_code, business_id) against
// business_accounts, the same way every other unified table is keyed. These
// tests run the real compliance functions, not the fixture insert.

import { beforeEach, describe, expect, it } from 'vitest';
import {
	createBusiness,
	createUsBusiness,
	resetDatabase,
	seedLeadDataPolicy
} from '../helpers/fixtures';

const { checkLeadDataPolicy, recordLeadDataAcceptance, getAcceptanceHistory } = await import(
	'../../src/lib/compliance'
);

describe('lead-data policy acceptance is country-scoped', () => {
	beforeEach(async () => {
		await resetDatabase();
	});

	it('records and reads back an acceptance for a US business', async () => {
		const businessId = await createUsBusiness();
		await seedLeadDataPolicy(null); // policy only, no acceptance

		const policy = await recordLeadDataAcceptance(businessId, 'us', '203.0.113.7');
		expect(policy).not.toBeNull();

		const status = await checkLeadDataPolicy(businessId, 'us');
		expect(status.compliant).toBe(true);
		expect(status.acceptedAt).toBeInstanceOf(Date);
	});

	it('records and reads back an acceptance for an IN business', async () => {
		const businessId = await createBusiness();
		await seedLeadDataPolicy(null);

		await recordLeadDataAcceptance(businessId, 'in', null);

		const status = await checkLeadDataPolicy(businessId, 'in');
		expect(status.compliant).toBe(true);
	});

	it('does not let one country see the other country acceptance', async () => {
		// us_businesses and businesses_1 share an id sequence, so these two ids
		// are always distinct — but the point stands regardless: an acceptance is
		// scoped to the country it was recorded under.
		const usId = await createUsBusiness();
		await seedLeadDataPolicy(null);
		await recordLeadDataAcceptance(usId, 'us', null);

		expect((await checkLeadDataPolicy(usId, 'us')).compliant).toBe(true);
		expect((await checkLeadDataPolicy(usId, 'in')).compliant).toBe(false);
	});

	it('reports non-compliant for a business that never accepted', async () => {
		const businessId = await createUsBusiness();
		await seedLeadDataPolicy(null);

		const status = await checkLeadDataPolicy(businessId, 'us');
		expect(status.compliant).toBe(false);
		expect(status.acceptedAt).toBeNull();
	});

	it('returns the acceptance history for a US business', async () => {
		const businessId = await createUsBusiness();
		await seedLeadDataPolicy(null);
		await recordLeadDataAcceptance(businessId, 'us', null);

		const history = await getAcceptanceHistory(businessId, 'us');
		expect(history).toHaveLength(1);
		expect(history[0].policyVersion).toBe('v1');

		// Scoped: the same id under 'in' has no history.
		expect(await getAcceptanceHistory(businessId, 'in')).toHaveLength(0);
	});
});
