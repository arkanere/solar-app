// A non-exclusive lead that a business had already claimed kept showing up on
// the dashboard and in the CRM with a "Claim Now (Free)" button, next to the
// claimed copy of itself — and the claimed copy was rendered twice.
//
// The three lists the loads merge overlap. `exclusiveLeads` matches on
// `urlparams`, so a lead submitted from a business's own installer page lands
// there whatever its category, and the claimed copy inherits the original's
// urlparams (see api/claimLead). So the original arrived through the exclusive
// arm, where the `claimedOriginalIds` filter never ran — that filter only
// covered `nonExclusiveLeads` — and the claimed copy arrived through both the
// exclusive arm and `nonExclusiveClaimedLeads`.
//
// Both loads now drop already-claimed originals and de-duplicate by lead id
// over the merged list. These call the loads directly, as pageCountry.test.ts
// does; the `parent()` stub stands in for [business_slug]/+layout.server.ts.

import { beforeEach, describe, expect, it } from 'vitest';
import { createBusiness, createLead, resetDatabase } from '../helpers/fixtures';

const { load: dashboardLoad } = await import(
	'../../src/routes/(layout-1)/[business_slug]/+page.server'
);
const { load: crmLoad } = await import(
	'../../src/routes/(layout-1)/[business_slug]/crm/+page.server'
);

function context(business_slug: string, businessId: number) {
	return {
		params: { business_slug },
		parent: async () => ({
			business_session: { businessSlug: business_slug, businessId },
			country: 'in'
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any;
}

describe('a claimed lead is listed once and cannot be claimed again', () => {
	const slug = 'hardoi-installer';
	let businessId: number;
	let originalId: number;
	let claimedId: number;

	beforeEach(async () => {
		await resetDatabase();

		businessId = await createBusiness({
			slug,
			district: 'Hardoi',
			state: 'Uttar Pradesh',
			city: 'Hardoi'
		});

		// Submitted from this business's own installer page, so it matches the
		// urlparams arm as well as the state-wide non-exclusive arm.
		originalId = await createLead({
			name: 'Shiv Kumar',
			category: 1,
			district: 'Hardoi',
			state: 'Uttar Pradesh',
			claimCount: 1,
			urlparams: `/in/installer/${slug}`
		});

		// The copy api/claimLead writes: category 2, owned by the claiming
		// business, pointing back at the original, same urlparams.
		claimedId = await createLead({
			name: 'Shiv Kumar',
			category: 2,
			district: 'Hardoi',
			state: 'Uttar Pradesh',
			businessId,
			originalId,
			urlparams: `/in/installer/${slug}`
		});
	});

	it('does not re-offer the claimed original on the dashboard', async () => {
		const data = await dashboardLoad(context(slug, businessId));
		const ids = (data.leads ?? []).map((lead) => lead.id);

		expect(ids).not.toContain(originalId);
		expect(ids.filter((id) => id === claimedId)).toHaveLength(1);
	});

	it('does not re-offer the claimed original in the CRM', async () => {
		const data = await crmLoad(context(slug, businessId));
		const ids = (data.leads ?? []).map((lead) => lead.id);

		expect(ids).not.toContain(originalId);
		expect(ids.filter((id) => id === claimedId)).toHaveLength(1);
	});

	it('still lists an unclaimed lead from the same page exactly once', async () => {
		const unclaimedId = await createLead({
			category: 1,
			district: 'Hardoi',
			state: 'Uttar Pradesh',
			urlparams: `/in/installer/${slug}`
		});

		const data = await dashboardLoad(context(slug, businessId));
		const ids = (data.leads ?? []).map((lead) => lead.id);

		expect(ids.filter((id) => id === unclaimedId)).toHaveLength(1);
	});
});
