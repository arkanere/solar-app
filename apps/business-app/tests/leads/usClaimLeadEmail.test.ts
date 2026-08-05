// Regression test for the /us/api/claimLead email bug found during Phase 6.
//
// The endpoint claimed leads correctly but never sent either of its two emails:
// the allotment mail to the installer and the notification to the customer.
// Both post-commit lookups, and the mintBusinessTokenById call between them,
// read `businesses_1` — the **IN** table — for a /us business id. us_businesses
// shares businesses_1's id sequence, so the id could never collide into a real
// row: the lookup returned nothing, the handler logged "business not found",
// and both mails were silently skipped.
//
// Per the CLAUDE.md rule, this reproduces the bug before the fix. Only outbound
// mail is mocked; the transaction and the sv_sync_* projections run for real.

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

// The /us endpoint uses $lib/us/sendEmail, not the /in one.
vi.mock('$lib/us/sendEmail', () => ({
	sendEmail: (...args: unknown[]) => sendEmail(...(args as [])),
	sendEmailIndividually: vi.fn(async () => ({ success: true })),
	sendTemplatedEmail: vi.fn(async () => ({ success: true }))
}));

const { POST } = await import('../../src/routes/us/api/claimLead/+server');

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

describe('POST /us/api/claimLead — emails', () => {
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

	it('sends both the allotment and the customer notification on a successful claim', async () => {
		const { status, body } = await claim(
			{ id: businessId, slug, businessname: 'Oakland Solar Co' },
			{ lead_id: leadId, business_id: businessId }
		);

		expect(status).toBe(200);
		expect(body).toEqual({ success: true });

		// This is the assertion that fails before the fix: zero calls, because
		// both business lookups came back empty.
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

		// The token is stored hashed on the write-side table, and projected into
		// business_accounts — the same contract mintBusinessTokenById has on the
		// IN side. Before the fix it was written to businesses_1 (0 rows) and the
		// mail was skipped entirely.
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

		expect(bodyOf(0)).toContain(`https://business.solarvipani.com/us/${slug}/signin-link/`);
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
