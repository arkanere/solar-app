// A US business claiming a lead through the country-less endpoint.
//
// This began as a regression test for the Phase 6 /us/api/claimLead email bug
// (both post-commit lookups read the IN table for a /us business id, so neither
// mail was sent). Phase 7 deleted /us, so it is repointed here at the single
// endpoint — which is also what makes it the acceptance test for the rest of
// the phase, and the "US write" coverage that step A needs before it ships.
//
// It is SKIPPED because the endpoint cannot serve a US business yet. Three
// things in src/routes/in/api/claimLead/+server.ts are still IN-bound:
//
//   - every read and write goes to `leaddata` / `businesses_1` /
//     `in_business_profiles` unconditionally. `country` is resolved and used for
//     the compliance gate and the sv_sync_* calls, but never for table
//     selection, and $lib/server/writeTargets.ts is not imported here at all.
//     us_leaddata draws its ids from leaddata_id_seq, so a US lead id simply
//     matches no row and the claim dies at "Lead not found" (step A);
//   - mintBusinessTokenById is called with the literal 'businesses_1' (step A);
//   - both email URLs hardcode /in/ — including the cross-app profile link,
//     which points at main-app and must therefore branch on the *resolved*
//     country rather than drop its segment (step C's trap).
//
// The assertions below are written against the intended post-A/C behaviour, so
// unskipping this is the check that both steps landed. Only outbound mail is
// mocked; the transaction and the sv_sync_* projections run for real.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { pool } from '../setup/testDb';
import {
	createUsBusiness,
	createUsLead,
	resetDatabase,
	seedLeadDataPolicy
} from '../helpers/fixtures';
import { createSessionCookies, jsonRequest } from '../helpers/request';

const sendEmail = vi.fn(async () => ({ success: true }));

// $lib/us/sendEmail went with the /us tree; there is one mailer now.
vi.mock('$lib/in/sendEmail', () => ({
	sendEmail: (...args: unknown[]) => sendEmail(...(args as [])),
	sendEmailIndividually: vi.fn(async () => ({ success: true })),
	sendTemplatedEmail: vi.fn(async () => ({ success: true }))
}));

const { POST } = await import('../../src/routes/in/api/claimLead/+server');

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

/** The recipient list of the nth sendEmail call. */
function recipientsOf(callIndex: number): string[] {
	return sendEmail.mock.calls[callIndex]?.[0] as unknown as string[];
}

function bodyOf(callIndex: number): string {
	return sendEmail.mock.calls[callIndex]?.[2] as unknown as string;
}

// Unskip once step A makes the write path country-aware and step C fixes the
// URLs. See the header for exactly what is missing.
describe.skip('POST /api/claimLead — a US business — emails', () => {
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
			'SELECT claim_count FROM us_leaddata WHERE id = $1',
			[leadId]
		);
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

		expect(recipientsOf(0)).toEqual([loginEmail, 'admin@solarvipani.com']);
		expect(bodyOf(0)).toContain('Oakland Solar Co');
	});

	it('mints a us_businesses magic-link token and puts it in the allotment email', async () => {
		await claim(
			{ id: businessId, slug, businessname: 'Oakland Solar Co' },
			{ lead_id: leadId, business_id: businessId }
		);

		// The token is stored hashed on the write-side table and projected into
		// business_accounts. mintBusinessTokenById currently takes the literal
		// 'businesses_1', so step A has to pass it the country's table.
		const { rows } = await pool.query<{ magic_link_token: string | null }>(
			'SELECT magic_link_token FROM us_businesses WHERE id = $1',
			[businessId]
		);
		expect(rows[0].magic_link_token).toBeTruthy();

		const projected = await pool.query<{ magic_link_token: string | null }>(
			"SELECT magic_link_token FROM business_accounts WHERE country_code = 'us' AND source_id = $1",
			[businessId]
		);
		expect(projected.rows[0].magic_link_token).toBe(rows[0].magic_link_token);

		// business-app's own URL: the country segment is gone in Phase 7.
		expect(bodyOf(0)).toContain(`https://business.solarvipani.com/${slug}/signin-link/`);
	});

	it('addresses the customer notification to the lead and names the installer', async () => {
		await claim(
			{ id: businessId, slug, businessname: 'Oakland Solar Co' },
			{ lead_id: leadId, business_id: businessId }
		);

		expect(recipientsOf(1)).toEqual(['dana@example.test', 'admin@solarvipani.com']);
		const message = bodyOf(1);
		expect(message).toContain('Dana Reyes');
		expect(message).toContain('Oakland Solar Co');
		expect(message).toContain('+1-555-0142');
		expect(message).toContain('hello@oaklandsolar.test');

		// This one is a *main-app* URL, and main-app still has [country]. It must
		// keep its segment, and the segment must come from the resolved country —
		// getting this wrong hands US customers an India profile link. This is
		// the guard for step C.
		expect(message).toContain(`https://solarvipani.com/us/solar-panel-installer/${slug}`);
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
