// Every page load under [business_slug] used to resolve the business by *slug*,
// even though the session already carries an authoritative `businessId` that
// login resolved from the account's login email.
//
// `businesses.slug` is not unique and cannot be made unique — live IN data has
// 24 slugs on two or more rows, plus the sentinel `incorrect` on 125 (see
// next-steps.md item 1). So the slug lookup, with `.limit(1)` or without an
// ordering, returned an arbitrary row from the group: a logged-in business could
// be served its twin's id, and lead counts, CRM, the claim gate and the
// compliance record were then computed for the wrong business.
//
// Worse, the layout and the page issue separate queries, so nothing guaranteed
// the two even agreed within a single request.
//
// These tests pin the fix: every load must resolve the business by
// `business_session.businessId`, never by the slug in the URL. Each one creates
// two businesses sharing a slug, sessions as the *second*, and asserts the load
// returns the second. Before the fix they returned the first — the lower id,
// which Postgres happens to return first on a sequential scan.

import { beforeEach, describe, expect, it } from 'vitest';
import {
	createBranch,
	createBusiness,
	createLead,
	createProject,
	resetDatabase,
	seedLeadDataPolicy
} from '../helpers/fixtures';
import { createSessionCookies } from '../helpers/request';

const { load: layoutLoad } = await import(
	'../../src/routes/(layout-1)/[business_slug]/+layout.server'
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
const { load: branchLoad } = await import(
	'../../src/routes/(layout-1)/[business_slug]/branch/+page.server'
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

const SLUG = 'shared-slug-solar';

/**
 * Two businesses on the same slug. Returns the ids in creation order, so
 * `second` is the one with the higher id — the one a slug lookup does *not*
 * return first.
 */
async function createTwinsOnOneSlug(): Promise<{ first: number; second: number }> {
	const first = await createBusiness({ slug: SLUG, businessname: 'First On Slug' });
	const second = await createBusiness({ slug: SLUG, businessname: 'Second On Slug' });
	return { first, second };
}

/** Stands in for the layout, carrying the session's authoritative businessId. */
function context(businessId: number) {
	return {
		params: { business_slug: SLUG },
		parent: async () => ({
			business_session: { businessSlug: SLUG, businessId },
			country: 'in' as const
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any;
}

describe('a slug shared by two businesses resolves by session, not by slug', () => {
	beforeEach(async () => {
		await resetDatabase();
	});

	it('the layout loads the sessionholder, not the first row on the slug', async () => {
		const { first, second } = await createTwinsOnOneSlug();

		// Only the session holder has a claimed lead, so the counts the layout
		// computes are enough to tell the two apart on their own.
		await createLead({ businessId: second, category: 2, district: 'Pune' });

		const cookies = createSessionCookies({
			id: second,
			slug: SLUG,
			businessname: 'Second On Slug'
		});

		const data = await layoutLoad({
			cookies,
			params: { business_slug: SLUG },
			url: new URL(`http://localhost/${SLUG}`)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);

		expect(data.business?.id).toBe(second);
		expect(data.business?.id).not.toBe(first);
		expect(data.setupProgress?.claimedLeadsCount).toBe(1);
	});

	it('the dashboard loads the session holder', async () => {
		const { first, second } = await createTwinsOnOneSlug();

		const data = await dashboardLoad(context(second));

		expect(data.errorMessage).toBeUndefined();
		expect(data.business?.id).toBe(second);
		expect(data.business?.id).not.toBe(first);
	});

	it('/crm loads the session holder', async () => {
		const { first, second } = await createTwinsOnOneSlug();

		const data = await crmLoad(context(second));

		expect(data.errorMessage).toBeUndefined();
		expect(data.business?.id).toBe(second);
		expect(data.business?.id).not.toBe(first);
	});

	it('/project-management loads the session holder', async () => {
		const { first, second } = await createTwinsOnOneSlug();

		const data = await projectManagementLoad(context(second));

		expect(data.business_id).toBe(second);
		expect(data.business_id).not.toBe(first);
	});

	it('/branch loads the session holder and only its own branches', async () => {
		const { first, second } = await createTwinsOnOneSlug();

		// A branch under each twin. Branches key off the main business id, so
		// resolving the wrong twin shows the wrong company's branches.
		const firstBranch = await createBusiness({ slug: `${SLUG}-first-branch` });
		await createBranch(first, firstBranch);
		const secondBranch = await createBusiness({ slug: `${SLUG}-second-branch` });
		await createBranch(second, secondBranch);

		const data = await branchLoad(context(second));

		expect(data.errorMessage).toBeUndefined();
		expect(data.mainBusiness?.id).toBe(second);
		expect(data.branches?.map((b) => b.slug)).toEqual([`${SLUG}-second-branch`]);
	});

	it('/proposal loads the session holder', async () => {
		const { first, second } = await createTwinsOnOneSlug();

		const data = await proposalLoad(context(second));

		expect(data.business?.id).toBe(second);
		expect(data.business?.id).not.toBe(first);
	});

	it('/recent-projects loads the session holder', async () => {
		const { first, second } = await createTwinsOnOneSlug();
		await createProject(SLUG);

		const data = await recentProjectsLoad(context(second));

		expect(data.errorMessage).toBeUndefined();
		expect(data.mainBusiness?.id).toBe(second);
		expect(data.mainBusiness?.id).not.toBe(first);
	});

	it('/compliance reads the session holder’s acceptance, not the twin’s', async () => {
		const { first, second } = await createTwinsOnOneSlug();

		// Only the first twin has accepted. Resolving by slug returns that row and
		// reports the session holder as compliant when it has accepted nothing.
		await seedLeadDataPolicy(first);

		const data = await complianceLoad(context(second));

		expect(data.errorMessage).toBeUndefined();
		expect(data.history).toEqual([]);
		expect(data.status?.state).not.toBe('current');
	});
});
