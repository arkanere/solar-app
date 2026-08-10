// A US business claiming a lead through the country-less endpoint.
//
// This began as a regression test for the Phase 6 /us/api/claimLead email bug
// (both post-commit lookups read the IN table for a /us business id, so neither
// mail was sent). Phase 7 deleted /us, so it is repointed here at the single
// endpoint — which is also what makes it the acceptance test for the rest of
// the phase, and the "US write" coverage that step A needs before it ships.
//
// Step A is done, so the reasons this was originally skipped are mostly gone.
// For the record, they were:
//
//   - every read and write went to `leaddata` / `businesses_1` /
//     `business_profiles` unconditionally, so a US lead id matched no row and
//     the claim died at "Lead not found". FIXED: migration 054 united those
//     tables under a country_code discriminator and the handler now writes it;
//   - mintBusinessTokenById took the literal 'businesses_1'. FIXED: it takes a
//     country;
//   - both email URLs hardcoded /in/. FIXED: the cross-app profile link
//     interpolates the resolved country and points at main-app's canonical
//     /installer/ path, and step C dropped the country segment from
//     business-app's own signin-link URL.
//
// Only outbound mail is mocked; the transaction and the sv_sync_* projections
// run for real.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { pool } from '../setup/testDb';
import {
	createUsBusiness,
	createUsLead,
	resetDatabase,
	seedLeadDataPolicy
} from '../helpers/fixtures';
import { createSessionCookies, jsonRequest } from '../helpers/request';

// Declared with a rest parameter so `sendEmail.mock.calls` entries are typed
// `unknown[]` rather than the empty tuple `[]` — indexing a `[]` is a type
// error, which is what the assertions below all have to do.
const sendEmail = vi.fn(async (..._args: unknown[]) => ({ success: true }));

// $lib/us/sendEmail went with the /us tree; there is one mailer now.
vi.mock('$lib/in/sendEmail', () => ({
	sendEmail: (...args: unknown[]) => sendEmail(...args),
	sendEmailIndividually: vi.fn(async () => ({ success: true })),
	sendTemplatedEmail: vi.fn(async () => ({ success: true }))
}));

const { POST } = await import('../../src/routes/api/claimLead/+server');

async function claim(
	session: { id: number; slug: string; businessname: string },
	body: Record<string, unknown>
) {
	const response = await POST({
		request: jsonRequest(body),
		cookies: createSessionCookies(session)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any);
	return { status: response.status, body: await response.json() };
}

// The handler dispatches both mails with `await Promise.all([allotment,
// customer])`, so their sendEmail calls RACE — indexing mock.calls[0]/[1] is
// order-dependent and fails intermittently depending on which path's queries
// finish first. Select the call by who it is addressed to instead.
function callTo(recipient: string): { recipients: string[]; body: string } | undefined {
	const call = sendEmail.mock.calls.find((c) =>
		(c[0] as unknown as string[])?.includes(recipient)
	);
	if (!call) return undefined;
	return {
		recipients: call[0] as unknown as string[],
		body: call[2] as unknown as string
	};
}

/** The recipient list of the nth sendEmail call. Order-independent lookups
 *  should use callTo(); this stays for assertions about call *count*. */
function recipientsOf(callIndex: number): string[] {
	return sendEmail.mock.calls[callIndex]?.[0] as unknown as string[];
}

// STEPS A, B AND C HAVE LANDED, so this runs. It is the acceptance test for the
// phase: the US claim writes the united tables, mints a token on the US row,
// projects it into business_accounts, and sends both mails with the right
// recipients, a country-correct main-app profile link, and a country-less
// business-app signin-link URL.
describe('POST /api/claimLead — a US business — emails', () => {
	let businessId: number;
	let leadId: number;
	const slug = 'oakland-solar';
	const loginEmail = 'oakland-solar@example.test';

	beforeEach(async () => {
		await resetDatabase();
		sendEmail.mockClear();

		businessId = await createUsBusiness({
			slug,
			loginEmail,
			businessname: 'Oakland Solar Co',
			phonenumber: '+1-555-0142',
			email: 'hello@oaklandsolar.test'
		});
		leadId = await createUsLead({ name: 'Dana Reyes', email: 'dana@example.test' });
		await seedLeadDataPolicy(businessId, { country: 'us' });
	});

	it('claims the lead against the US tables, not the IN ones', async () => {
		// The step A guarantee: country is resolved from the slug and decides
		// which legacy table the claim is written to. Today this 500s with
		// "Lead not found" because the handler reads `leaddata`.
		const { status, body } = await claim(
			{ id: businessId, slug, businessname: 'Oakland Solar Co' },
			{ lead_id: leadId, business_id: businessId }
		);

		expect(status).toBe(200);
		expect(body.success).toBe(true);

		const { rows } = await pool.query<{ claim_count: number }>(
			"SELECT claim_count FROM leaddata WHERE id = $1 AND country_code = 'us'",
			[leadId]
		);
		expect(rows).toHaveLength(1);
		expect(rows[0].claim_count).toBe(1);
	});

	it('sends both the allotment and the customer notification on a successful claim', async () => {
		await claim(
			{ id: businessId, slug, businessname: 'Oakland Solar Co' },
			{ lead_id: leadId, business_id: businessId }
		);

		expect(sendEmail).toHaveBeenCalledTimes(2);
	});

	it('addresses the allotment email to the business login_email', async () => {
		await claim(
			{ id: businessId, slug, businessname: 'Oakland Solar Co' },
			{ lead_id: leadId, business_id: businessId }
		);

		const allotment = callTo(loginEmail);
		expect(allotment?.recipients).toEqual([loginEmail, 'admin@solarvipani.com']);
		expect(allotment?.body).toContain('Oakland Solar Co');
	});

	it('mints a magic-link token on the US row and puts it in the allotment email', async () => {
		await claim(
			{ id: businessId, slug, businessname: 'Oakland Solar Co' },
			{ lead_id: leadId, business_id: businessId }
		);

		// The token is stored hashed in business_accounts — written directly since
		// migration 062, rather than staged in businesses_1 and projected. That
		// table holds both countries, so this asserts on source_id AND
		// country_code: matching on the id alone would still pass if the row had
		// been written as an IN row.
		const { rows } = await pool.query<{ magic_link_token: string | null }>(
			"SELECT magic_link_token FROM business_accounts WHERE source_id = $1 AND country_code = 'us'",
			[businessId]
		);
		expect(rows).toHaveLength(1);
		expect(rows[0].magic_link_token).toBeTruthy();

		const projected = await pool.query<{ magic_link_token: string | null }>(
			"SELECT magic_link_token FROM business_accounts WHERE country_code = 'us' AND source_id = $1",
			[businessId]
		);
		expect(projected.rows[0].magic_link_token).toBe(rows[0].magic_link_token);

		// business-app's own URL: the country segment is gone in Phase 7. Unlike
		// the profile link above, this one is *not* country-branched — the slug
		// already implies the country within this app.
		const allotment = callTo(loginEmail);
		expect(allotment?.body).toContain(`https://business.solarvipani.com/${slug}/signin-link/`);
	});

	it('addresses the customer notification to the lead and names the installer', async () => {
		await claim(
			{ id: businessId, slug, businessname: 'Oakland Solar Co' },
			{ lead_id: leadId, business_id: businessId }
		);

		const customer = callTo('dana@example.test');
		expect(customer?.recipients).toEqual(['dana@example.test', 'admin@solarvipani.com']);
		const message = customer?.body ?? '';
		expect(message).toContain('Dana Reyes');
		expect(message).toContain('Oakland Solar Co');
		expect(message).toContain('+1-555-0142');
		expect(message).toContain('hello@oaklandsolar.test');

		// This one is a *main-app* URL, and main-app still has [country]. It must
		// keep its segment, and the segment must come from the resolved country —
		// getting this wrong hands US customers an India profile link.
		//
		// The canonical path is /installer/ for BOTH countries. This originally
		// expected /us/solar-panel-installer/, but that is only a legacy redirect:
		// main-app's hooks.server.ts 301s it to /us/installer/. Emitting the
		// redirect source in an email would cost every US recipient a needless
		// hop, so the handler emits the canonical form and this asserts it.
		expect(message).toContain(`https://solarvipani.com/us/installer/${slug}`);
	});

	it('skips only the customer notification when the lead has no email on file', async () => {
		const noEmailLead = await createUsLead({ email: null });

		await claim(
			{ id: businessId, slug, businessname: 'Oakland Solar Co' },
			{ lead_id: noEmailLead, business_id: businessId }
		);

		// The allotment mail to the installer still goes out.
		expect(sendEmail).toHaveBeenCalledTimes(1);
		expect(recipientsOf(0)).toEqual([loginEmail, 'admin@solarvipani.com']);
	});
});
