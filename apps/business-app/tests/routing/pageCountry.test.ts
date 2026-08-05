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
	createProject,
	createProjectManagement,
	createUsBusiness,
	createUsLead,
	resetDatabase,
	seedLeadDataPolicy
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
const { load: crmLoad } = await import(
	'../../src/routes/(layout-1)/[business_slug]/crm/+page.server'
);
const { load: projectManagementLoad } = await import(
	'../../src/routes/(layout-1)/[business_slug]/project-management/+page.server'
);
const { load: proposalLoad } = await import(
	'../../src/routes/(layout-1)/[business_slug]/proposal/+page.server'
);
const { load: recentProjectsLoad } = await import(
	'../../src/routes/(layout-1)/[business_slug]/recent-projects/+page.server'
);
const { load: complianceLoad } = await import(
	'../../src/routes/(layout-1)/[business_slug]/compliance/+page.server'
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

	// The third lead read — category 1, matched by state rather than by
	// business_id or urlparams. It was the one read no US case reached, because
	// createUsLead had no way to set a state.
	it('finds a US business’s non-exclusive leads by state, masked', async () => {
		await createUsBusiness({ slug: 'oakland-solar', state: 'California' });
		await createUsLead({ category: 1, state: 'California' });

		const data = await dashboardLoad(context('oakland-solar', 'us'));

		expect(data.leads).toHaveLength(1);
		// Masking is what distinguishes this read from the other two: only the
		// non-exclusive list gets it, so an unmasked address would mean the lead
		// arrived by some other branch.
		expect(data.leads?.[0].email).toContain('*');
		expect(data.leads?.[0].phone).toContain('*');
	});

	it('does not match a US lead from another state', async () => {
		await createUsBusiness({ slug: 'oakland-solar', state: 'California' });
		await createUsLead({ category: 1, state: 'Texas' });

		const data = await dashboardLoad(context('oakland-solar', 'us'));

		expect(data.leads).toEqual([]);
	});

	// Documents the production gap rather than hiding it: no US write path sets
	// leaddata.state (pincode_mapping is IN-only), so every live US lead has a
	// null level1 and this read returns nothing for any US business. The test
	// above passes only because its fixture sets a state by hand. See
	// next-steps.md — closing the gap needs a US postal-code-to-state source.
	it('matches no US lead when state is null, as every live US lead is', async () => {
		await createUsBusiness({ slug: 'oakland-solar', state: 'California' });
		await createUsLead({ category: 1 });

		const data = await dashboardLoad(context('oakland-solar', 'us'));

		expect(data.leads).toEqual([]);
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

// /crm repeats the dashboard's five reads almost verbatim — same business
// lookup, same branch join, same three lead queries — so it failed for a US
// business the same way.
describe('country resolution in the /crm load', () => {
	beforeEach(async () => {
		await resetDatabase();
	});

	it('loads a US business, its branches and both kinds of lead', async () => {
		const mainId = await createUsBusiness({ slug: 'oakland-solar' });
		const branchId = await createUsBusiness({ slug: 'oakland-solar-berkeley' });
		await createBranch(mainId, branchId);
		// One claimed (business_id + category 2) and one exclusive (urlparams),
		// which are the two lead filters this load can reach for a US business.
		await createUsLead({ businessId: mainId, category: 2 });
		await createUsLead({ urlparams: '/us/installer/oakland-solar?utm_source=test' });

		const data = await crmLoad(context('oakland-solar', 'us'));

		// This load's business selection has no `slug` column, unlike the
		// dashboard's — assert on the id the fixture returned instead.
		expect(data.errorMessage).toBeUndefined();
		expect(data.business?.id).toBe(mainId);
		expect(data.branches?.map((b) => b.slug)).toEqual(['oakland-solar-berkeley']);
		expect(data.leads).toHaveLength(2);
	});

	// /crm's category-1 read is the dashboard's verbatim, down to the 15-day
	// window, so it carried the same untested US path.
	it('finds a US business’s non-exclusive leads by state, masked', async () => {
		await createUsBusiness({ slug: 'oakland-solar', state: 'California' });
		await createUsLead({ category: 1, state: 'California' });

		const data = await crmLoad(context('oakland-solar', 'us'));

		expect(data.leads).toHaveLength(1);
		expect(data.leads?.[0].email).toContain('*');
	});

	it('matches no US lead when state is null, as every live US lead is', async () => {
		await createUsBusiness({ slug: 'oakland-solar', state: 'California' });
		await createUsLead({ category: 1 });

		const data = await crmLoad(context('oakland-solar', 'us'));

		expect(data.leads).toEqual([]);
	});

	it('still loads an IN business and its claimed leads', async () => {
		const mainId = await createBusiness({ slug: 'pune-solar' });
		await createLead({ businessId: mainId, category: 2 });

		const data = await crmLoad(context('pune-solar', 'in'));

		expect(data.business?.id).toBe(mainId);
		expect(data.leads).toHaveLength(1);
	});

	it('does not return the other country’s business for a matching slug', async () => {
		await createBusiness({ slug: 'shared-slug' });
		await createUsBusiness({ slug: 'shared-slug' });

		const asUs = await crmLoad(context('shared-slug', 'us'));
		const asIn = await crmLoad(context('shared-slug', 'in'));

		expect(asUs.business?.id).not.toBe(asIn.business?.id);
	});

	it('reports not-found rather than guessing when the layout has no country', async () => {
		await createBusiness({ slug: 'pune-solar' });

		const data = await crmLoad(context('pune-solar', undefined));

		expect(data.errorMessage).toBe('Business not found');
		expect(data.business).toBeUndefined();
	});
});

// /project-management filtered a literal 'in' on two tables: the business
// lookup and the join that attaches each pipeline row to its lead. Unlike the
// loads above it signals failure by throwing, not by returning errorMessage.
describe('country resolution in the /project-management load', () => {
	beforeEach(async () => {
		await resetDatabase();
	});

	it('loads a US business and its pipeline rows', async () => {
		const mainId = await createUsBusiness({ slug: 'oakland-solar' });
		const leadId = await createUsLead({ businessId: mainId, category: 2 });
		await createProjectManagement(leadId);

		const data = await projectManagementLoad(context('oakland-solar', 'us'));

		expect(data.business?.id).toBe(mainId);
		// Guards the lead join specifically: with the literal left on it the
		// business loads but the pipeline comes back empty.
		expect(data.projects).toHaveLength(1);
		expect(data.projects?.[0].lead_id).toBe(leadId);
	});

	it('still loads an IN business and its pipeline rows', async () => {
		const mainId = await createBusiness({ slug: 'pune-solar' });
		const leadId = await createLead({ businessId: mainId, category: 2 });
		await createProjectManagement(leadId);

		const data = await projectManagementLoad(context('pune-solar', 'in'));

		expect(data.business?.id).toBe(mainId);
		expect(data.projects).toHaveLength(1);
	});

	it('does not return the other country’s business for a matching slug', async () => {
		const inId = await createBusiness({ slug: 'shared-slug' });
		const usId = await createUsBusiness({ slug: 'shared-slug' });

		const asUs = await projectManagementLoad(context('shared-slug', 'us'));
		const asIn = await projectManagementLoad(context('shared-slug', 'in'));

		expect(asUs.business?.id).toBe(usId);
		expect(asIn.business?.id).toBe(inId);
	});

	it('404s rather than guessing when the layout has no country', async () => {
		await createBusiness({ slug: 'pune-solar' });

		await expect(projectManagementLoad(context('pune-solar', undefined))).rejects.toMatchObject({
			status: 404
		});
	});

	// The absent-country 404 above was hoisted above the try when the country
	// checks went in; this one is thrown from inside it, and the catch turned it
	// into a 500 — so a bogus slug reported a server error rather than "not
	// found". Pre-existing, and the same shape in /proposal below.
	it('404s a slug that does not exist, rather than 500ing', async () => {
		await expect(projectManagementLoad(context('no-such-business', 'in'))).rejects.toMatchObject({
			status: 404
		});
	});
});

// The last three loads each filter the literal on a single business lookup, so
// one US case and one absent-country case cover each. /compliance is the
// exception: it passes the country to checkLeadDataPolicy and
// getAcceptanceHistory as well, which read a per-country acceptance record.
describe('country resolution in the remaining [business_slug] loads', () => {
	beforeEach(async () => {
		await resetDatabase();
	});

	it('loads /proposal for a US business, with no proposals', async () => {
		const mainId = await createUsBusiness({ slug: 'oakland-solar' });

		const data = await proposalLoad(context('oakland-solar', 'us'));

		// `in_proposals` has no US counterpart, so empty is the right answer.
		expect(data.business?.id).toBe(mainId);
		expect(data.proposals).toEqual([]);
	});

	it('404s /proposal rather than guessing when the layout has no country', async () => {
		await createBusiness({ slug: 'pune-solar' });

		await expect(proposalLoad(context('pune-solar', undefined))).rejects.toMatchObject({
			status: 404
		});
	});

	it('404s /proposal for a slug that does not exist, rather than 500ing', async () => {
		await expect(proposalLoad(context('no-such-business', 'in'))).rejects.toMatchObject({
			status: 404
		});
	});

	it('loads /recent-projects for a US business and its projects', async () => {
		const mainId = await createUsBusiness({ slug: 'oakland-solar' });
		await createProject('oakland-solar');

		const data = await recentProjectsLoad(context('oakland-solar', 'us'));

		expect(data.errorMessage).toBeUndefined();
		expect(data.mainBusiness?.id).toBe(mainId);
		expect(data.projects).toHaveLength(1);
	});

	it('reports not-found on /recent-projects when the layout has no country', async () => {
		await createBusiness({ slug: 'pune-solar' });

		const data = await recentProjectsLoad(context('pune-solar', undefined));

		expect(data.errorMessage).toBe('Business not found');
	});

	it('loads /compliance for a US business, including its US acceptance', async () => {
		const mainId = await createUsBusiness({ slug: 'oakland-solar' });
		await seedLeadDataPolicy(mainId, { country: 'us' });

		const data = await complianceLoad(context('oakland-solar', 'us'));

		expect(data.errorMessage).toBeUndefined();
		// The acceptance row carries country_code = 'us'. With the literal left on
		// checkLeadDataPolicy/getAcceptanceHistory the business resolves but its
		// acceptance does not, so this reads as never-accepted.
		expect(data.status?.acceptedAt).not.toBeNull();
		expect(data.history).toHaveLength(1);
	});

	it('reports not-found on /compliance when the layout has no country', async () => {
		await createBusiness({ slug: 'pune-solar' });

		const data = await complianceLoad(context('pune-solar', undefined));

		expect(data.errorMessage).toBe('Business not found');
	});
});
