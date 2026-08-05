// The /branch and /referral page loads used to filter on a literal
// `country_code = 'in'`, so a US business could not load either page — it was
// told its own profile did not exist. Their *links* were country-correct since
// Phase 7; only their reads were not.
//
// These call the loads directly, the same way the API tests call handlers. The
// `parent()` stub stands in for [business_slug]/+layout.server.ts, which is what
// actually resolves the country from the slug.

import { beforeEach, describe, expect, it } from 'vitest';
import {
	createBranch,
	createBusiness,
	createLead,
	createUsBusiness,
	createUsLead,
	resetDatabase
} from '../helpers/fixtures';

const { load: branchLoad } = await import(
	'../../src/routes/(layout-1)/[business_slug]/branch/+page.server'
);
const { load: referralLoad } = await import(
	'../../src/routes/(layout-1)/[business_slug]/referral/+page.server'
);
const { load: dashboardLoad } = await import(
	'../../src/routes/(layout-1)/[business_slug]/+page.server'
);

/** Stands in for the layout, which resolves country from the slug. */
function context(business_slug: string, country: 'in' | 'us' | undefined) {
	return {
		params: { business_slug },
		parent: async () => ({
			business_session: { businessSlug: business_slug },
			country
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any;
}

describe('country resolution in the /branch and /referral loads', () => {
	beforeEach(async () => {
		await resetDatabase();
	});

	it('loads a US business and its branches', async () => {
		const mainId = await createUsBusiness({ slug: 'oakland-solar' });
		const branchId = await createUsBusiness({ slug: 'oakland-solar-berkeley' });
		await createBranch(mainId, branchId);

		const data = await branchLoad(context('oakland-solar', 'us'));

		// Before the fix this was 'Business not found' — the literal 'in' filter
		// matched no row for a US slug.
		expect(data.errorMessage).toBeUndefined();
		expect(data.mainBusiness?.slug).toBe('oakland-solar');
		expect(data.branches?.map((b) => b.slug)).toEqual(['oakland-solar-berkeley']);
	});

	it('still loads an IN business and its branches', async () => {
		const mainId = await createBusiness({ slug: 'pune-solar' });
		const branchId = await createBusiness({ slug: 'pune-solar-kothrud' });
		await createBranch(mainId, branchId);

		const data = await branchLoad(context('pune-solar', 'in'));

		expect(data.mainBusiness?.slug).toBe('pune-solar');
		expect(data.branches?.map((b) => b.slug)).toEqual(['pune-solar-kothrud']);
	});

	it('does not return the other country’s business for a matching slug', async () => {
		// businesses_1 holds both countries since 054, so the country filter is the
		// only thing separating two rows that share a slug.
		await createBusiness({ slug: 'shared-slug' });
		await createUsBusiness({ slug: 'shared-slug' });

		const asUs = await branchLoad(context('shared-slug', 'us'));
		const asIn = await branchLoad(context('shared-slug', 'in'));

		expect(asUs.mainBusiness?.id).not.toBe(asIn.mainBusiness?.id);
	});

	it('reports not-found rather than guessing when the layout has no country', async () => {
		await createBusiness({ slug: 'pune-solar' });

		// The layout omits country only on its DB-error fallback. Falling back to
		// 'in' there would render an India-shaped page for a US business.
		const data = await branchLoad(context('pune-solar', undefined));

		expect(data.errorMessage).toBe('Business not found');
		expect(data.mainBusiness).toBeUndefined();
	});

	it('loads the referral page for a US business, with no referrers', async () => {
		await createUsBusiness({ slug: 'oakland-solar' });

		const data = await referralLoad(context('oakland-solar', 'us'));

		// Loads at all — it used to throw 404. `in_referrers` has no US
		// counterpart, so an empty list is the correct answer, not a bug.
		expect(data.business?.slug).toBe('oakland-solar');
		expect(data.referrers).toEqual([]);
	});

	it('still loads the referral page for an IN business', async () => {
		await createBusiness({ slug: 'pune-solar' });

		const data = await referralLoad(context('pune-solar', 'in'));

		expect(data.business?.slug).toBe('pune-solar');
		expect(data.referrers).toEqual([]);
	});
});

// The dashboard is the page a login actually lands on, and it carried the same
// literal 'in' on five reads — the business lookup, the branch join and three
// lead queries. A US login therefore reached its own dashboard and was told the
// business did not exist.
describe('country resolution in the dashboard load', () => {
	beforeEach(async () => {
		await resetDatabase();
	});

	it('loads a US business, its branches and its claimed leads', async () => {
		const mainId = await createUsBusiness({ slug: 'oakland-solar' });
		const branchId = await createUsBusiness({ slug: 'oakland-solar-berkeley' });
		await createBranch(mainId, branchId);
		await createUsLead({ businessId: mainId, category: 2 });

		const data = await dashboardLoad(context('oakland-solar', 'us'));

		// Before the fix: 'Business not found'.
		expect(data.errorMessage).toBeUndefined();
		expect(data.business?.slug).toBe('oakland-solar');
		expect(data.branches?.map((b) => b.slug)).toEqual(['oakland-solar-berkeley']);
		// Guards the lead reads specifically: with the literal left on the
		// category-2 query the business loads but this list comes back empty.
		expect(data.leads).toHaveLength(1);
	});

	it('finds a US business’s exclusive leads by urlparams', async () => {
		const mainId = await createUsBusiness({ slug: 'oakland-solar' });
		await createUsLead({ urlparams: '/us/installer/oakland-solar?utm_source=test' });

		const data = await dashboardLoad(context('oakland-solar', 'us'));

		expect(mainId).toBeGreaterThan(0);
		expect(data.leads).toHaveLength(1);
	});

	it('still loads an IN business and its claimed leads', async () => {
		const mainId = await createBusiness({ slug: 'pune-solar' });
		await createLead({ businessId: mainId, category: 2 });

		const data = await dashboardLoad(context('pune-solar', 'in'));

		expect(data.business?.slug).toBe('pune-solar');
		expect(data.leads).toHaveLength(1);
	});

	it('does not return the other country’s business for a matching slug', async () => {
		await createBusiness({ slug: 'shared-slug' });
		await createUsBusiness({ slug: 'shared-slug' });

		const asUs = await dashboardLoad(context('shared-slug', 'us'));
		const asIn = await dashboardLoad(context('shared-slug', 'in'));

		expect(asUs.business?.id).not.toBe(asIn.business?.id);
	});

	it('reports not-found rather than guessing when the layout has no country', async () => {
		await createBusiness({ slug: 'pune-solar' });

		const data = await dashboardLoad(context('pune-solar', undefined));

		expect(data.errorMessage).toBe('Business not found');
		expect(data.business).toBeUndefined();
	});
});
