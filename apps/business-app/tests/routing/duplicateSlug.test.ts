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
//
// The second describe block covers the write side, which was the same bug and
// outlived the read fix: POST /api/updateBusinessDetails UPDATEd
// business_profiles by slug with no id filter, so one business saving its
// profile overwrote *every* row on the slug — its twin's included.

import { beforeEach, describe, expect, it } from 'vitest';
import { pool } from '../setup/testDb';
import {
	createBranch,
	createBusiness,
	createLead,
	createProject,
	resetDatabase,
	seedLeadDataPolicy
} from '../helpers/fixtures';
import { createSessionCookies, jsonRequest } from '../helpers/request';

const { POST: updateBusinessDetails } = await import(
	'../../src/routes/api/updateBusinessDetails/+server'
);

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

interface UpdateResponse {
	success: boolean;
	error?: string;
	id?: number;
}

/** The whole form, so the schema is satisfied and only businessname varies. */
function updateBody(slug: string, businessname: string) {
	return {
		businessname,
		address: '1 Test Road',
		phonenumber: '9999999999',
		whatsapp: '9999999999',
		email: 'owner@example.test',
		website: 'https://example.test',
		description: 'Solar panel installer',
		instagram_id: '',
		google_maps_link: '',
		services: [],
		brands: [],
		business_slug: slug
	};
}

async function saveProfile(
	session: { id: number; slug: string; businessname: string },
	slug: string,
	businessname: string
) {
	const response = await updateBusinessDetails({
		request: jsonRequest(updateBody(slug, businessname)),
		cookies: createSessionCookies(session)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any);
	return { status: response.status, body: (await response.json()) as UpdateResponse };
}

async function nameOf(businessId: number): Promise<string> {
	const { rows } = await pool.query<{ businessname: string }>(
		'SELECT businessname FROM business_profiles WHERE business_id = $1',
		[businessId]
	);
	return rows[0].businessname;
}

describe('saving a profile writes one row, resolved by session', () => {
	beforeEach(async () => {
		await resetDatabase();
	});

	it('updates the session holder and leaves its slug twin untouched', async () => {
		const { first, second } = await createTwinsOnOneSlug();

		const { status, body } = await saveProfile(
			{ id: second, slug: SLUG, businessname: 'Second On Slug' },
			SLUG,
			'Renamed By Second'
		);

		expect(status).toBe(200);
		expect(body.success).toBe(true);
		expect(body.id).toBe(second);
		expect(await nameOf(second)).toBe('Renamed By Second');
		// The bug: this row was overwritten too, because the UPDATE matched on
		// slug alone and both rows carry it.
		expect(await nameOf(first)).toBe('First On Slug');
	});

	it('updates a branch by its own id, not by every row on the branch slug', async () => {
		const main = await createBusiness({ slug: 'main-business', businessname: 'Main Business' });
		const branch = await createBusiness({ slug: 'branch-slug', businessname: 'Branch' });
		await createBranch(main, branch);

		// An unrelated business squatting the branch's slug. The parent is
		// authorized for its branch, so authorization passes and the write
		// itself has to be the thing that stays scoped.
		const squatter = await createBusiness({ slug: 'branch-slug', businessname: 'Squatter' });

		const { status, body } = await saveProfile(
			{ id: main, slug: 'main-business', businessname: 'Main Business' },
			'branch-slug',
			'Renamed Branch'
		);

		expect(status).toBe(200);
		expect(body.id).toBe(branch);
		expect(await nameOf(branch)).toBe('Renamed Branch');
		expect(await nameOf(squatter)).toBe('Squatter');
		expect(await nameOf(main)).toBe('Main Business');
	});

	it('still refuses a slug that is neither the business nor one of its branches', async () => {
		const main = await createBusiness({ slug: 'main-business', businessname: 'Main Business' });
		const stranger = await createBusiness({ slug: 'stranger', businessname: 'Stranger' });

		const { status, body } = await saveProfile(
			{ id: main, slug: 'main-business', businessname: 'Main Business' },
			'stranger',
			'Renamed By Stranger'
		);

		expect(status).toBe(403);
		expect(body.success).toBe(false);
		expect(await nameOf(stranger)).toBe('Stranger');
	});

	it('refuses a branch that has been deactivated', async () => {
		const main = await createBusiness({ slug: 'main-business', businessname: 'Main Business' });
		const branch = await createBusiness({ slug: 'branch-slug', businessname: 'Branch' });
		await createBranch(main, branch, false);

		const { status } = await saveProfile(
			{ id: main, slug: 'main-business', businessname: 'Main Business' },
			'branch-slug',
			'Renamed Branch'
		);

		expect(status).toBe(403);
		expect(await nameOf(branch)).toBe('Branch');
	});
});
