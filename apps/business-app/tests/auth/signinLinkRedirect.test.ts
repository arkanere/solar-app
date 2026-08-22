// An invalid or expired sign-in link used to *render* rather than redirect: the
// load returned `{ error }` and the page printed it. Because the route sits
// under [business_slug], that message came wrapped in the logged-in dashboard
// shell — sidebar, Dashboard/Leads/Branches, a Logout button — shown to someone
// who by definition has no session. The only way on was a link to
// /{slug}/login, a stub page whose entire content was `<p>Hello</p>` (deleted
// along with this fix; the assertion below outlives it, since the layout guard
// would otherwise be free to allowlist such a page again).
//
// Now every path out of the load is a redirect, and the failure paths carry a
// `reason` that /login turns into a notice.

import { beforeEach, describe, expect, it } from 'vitest';
import { createBusiness, resetDatabase } from '../helpers/fixtures';
import { createCookies } from '../helpers/request';
import { mintBusinessTokenById } from '$lib/server/magicLink';

const { load: signinLinkLoad } = await import(
	'../../src/routes/(layout-1)/[business_slug]/signin-link/[token]/+page.server'
);
const { load: loginLoad } = await import('../../src/routes/(layout-1)/login/+page.server');

/** Run the load and return the redirect it threw, failing if it returned instead. */
async function loadRedirect(slug: string, token: string) {
	try {
		const returned = await signinLinkLoad({
			params: { business_slug: slug, token },
			cookies: createCookies()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any);
		throw new Error(`expected a redirect, got: ${JSON.stringify(returned)}`);
	} catch (thrown) {
		const e = thrown as { status?: number; location?: string };
		if (typeof e.status !== 'number') throw thrown;
		return { status: e.status, location: e.location };
	}
}

/** The notice /login shows for a given ?reason=, or null. */
async function loginNotice(reason?: string) {
	const url = new URL(`http://localhost/login${reason ? `?reason=${reason}` : ''}`);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const data = (await loginLoad({ cookies: createCookies(), url } as any)) as {
		notice: string | null;
	};
	return data.notice;
}

describe('an invalid sign-in link redirects instead of rendering in the dashboard', () => {
	const slug = 'pune-solar';

	beforeEach(async () => {
		await resetDatabase();
		await createBusiness({ slug, loginEmail: 'owner@pune-solar.test' });
	});

	it('redirects a garbage token to /login with a reason', async () => {
		const { status, location } = await loadRedirect(slug, 'not-a-real-token');

		expect(status).toBe(302);
		expect(location).toBe('/login?reason=expired-link');
	});

	it('does not send the visitor to a per-business login page', async () => {
		const { location } = await loadRedirect(slug, 'not-a-real-token');

		// There is no such page — /{slug}/login is deleted — so a redirect there
		// would be a 404 rather than a way to get a new link.
		expect(location).not.toContain(`/${slug}/login`);
	});

	it('does not leak the slug into the redirect', async () => {
		// The request just proved the sender holds no valid token for this
		// business, so the destination must not name it.
		const { location } = await loadRedirect(slug, 'not-a-real-token');

		expect(location).not.toContain(slug);
	});

	it('redirects a token minted for another business the same way', async () => {
		const otherId = await createBusiness({
			slug: 'other-solar',
			loginEmail: 'owner@other.test'
		});
		const otherToken = await mintBusinessTokenById(otherId);

		const { location } = await loadRedirect(slug, otherToken!);

		expect(location).toBe('/login?reason=expired-link');
	});

	it('still signs a valid link in, and sends it to the dashboard', async () => {
		const businessId = await createBusiness({
			slug: 'valid-solar',
			loginEmail: 'owner@valid.test'
		});
		const token = await mintBusinessTokenById(businessId);

		const { status, location } = await loadRedirect('valid-solar', token!);

		expect(status).toBe(302);
		expect(location).toBe('/valid-solar');
	});
});

describe('/login turns the reason into a notice', () => {
	beforeEach(async () => {
		await resetDatabase();
	});

	it('explains why an expired link landed them here', async () => {
		expect(await loginNotice('expired-link')).toMatch(/expired or is no longer valid/i);
	});

	it('shows nothing when there is no reason', async () => {
		expect(await loginNotice()).toBeNull();
	});

	it('ignores an unknown reason rather than rendering it', async () => {
		// The notice is keyed, never taken from the query string: whatever is in
		// the URL gets rendered on a login form, so it must not be attacker-chosen.
		expect(await loginNotice('%3Cscript%3Ealert(1)%3C%2Fscript%3E')).toBeNull();
	});
});
