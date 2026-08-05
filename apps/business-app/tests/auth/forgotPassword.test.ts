// Tests for POST /in/api/forgotPassword — the entry point the reset flow was
// missing. Nothing in the app ever wrote `reset_token`, so `resetPassword`
// worked but could not be reached by a user; these cover the new endpoint and,
// most importantly, that the token it mints is one resetPassword accepts.
//
// The enumeration guarantee is the other thing under test: a registered and an
// unregistered address must produce byte-identical responses.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { pool } from '../setup/testDb';
import { createBusiness, createUsBusiness, resetDatabase } from '../helpers/fixtures';
import { jsonRequest } from '../helpers/request';
import { countryForLoginEmail } from '$lib/server/resolveCountry';

const sendEmail = vi.fn(async () => ({ success: true }));

vi.mock('$lib/in/sendEmail', () => ({
	sendEmail: (...args: unknown[]) => sendEmail(...(args as [])),
	sendEmailIndividually: vi.fn(async () => ({ success: true })),
	sendTemplatedEmail: vi.fn(async () => ({ success: true }))
}));

const { POST: forgotPassword } = await import('../../src/routes/in/api/forgotPassword/+server');
const { POST: resetPassword } = await import('../../src/routes/in/api/resetPassword/+server');

let clientIp = '198.51.100.1';

async function forgot(body: Record<string, unknown>) {
	const response = await forgotPassword({
		request: jsonRequest(body),
		getClientAddress: () => clientIp
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any);
	return { status: response.status, body: await response.json() };
}

async function reset(body: Record<string, unknown>) {
	const response = await resetPassword({
		request: jsonRequest(body),
		getClientAddress: () => clientIp
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any);
	return { status: response.status, body: await response.json() };
}

/** The reset link out of the most recent email. */
function tokenFromEmail(): string {
	const message = sendEmail.mock.calls.at(-1)?.[2] as unknown as string;
	const match = message.match(/reset-password\/([a-f0-9]+)/);
	if (!match) throw new Error(`no reset link in email:\n${message}`);
	return match[1];
}

async function storedReset(businessId: number) {
	const { rows } = await pool.query<{
		reset_token: string | null;
		reset_token_expires: Date | null;
		login_password: string | null;
	}>('SELECT reset_token, reset_token_expires, login_password FROM businesses_1 WHERE id = $1', [
		businessId
	]);
	return rows[0];
}

const STRONG_PASSWORD = 'Str0ng!Passw0rd';

describe('POST /in/api/forgotPassword', () => {
	let businessId: number;
	const loginEmail = 'owner@pune-solar.test';

	beforeEach(async () => {
		await resetDatabase();
		sendEmail.mockClear();
		// A distinct IP per test keeps the rate limiter from bleeding across them.
		clientIp = `198.51.100.${Math.floor(Math.random() * 200) + 1}`;
		businessId = await createBusiness({ slug: 'pune-solar', loginEmail });
	});

	it('mints a hashed token with an expiry and emails the raw one', async () => {
		const { status, body } = await forgot({ email: loginEmail });

		expect(status).toBe(200);
		expect(body.success).toBe(true);
		expect(sendEmail).toHaveBeenCalledTimes(1);

		// Only the account holder — no admin@ copy, unlike the allotment mails.
		expect(sendEmail.mock.calls[0][0]).toBe(loginEmail);

		const stored = await storedReset(businessId);
		expect(stored.reset_token).toBeTruthy();
		expect(stored.reset_token_expires).toBeInstanceOf(Date);
		expect(stored.reset_token_expires!.getTime()).toBeGreaterThan(Date.now());

		// Stored hashed, never raw.
		const rawToken = tokenFromEmail();
		expect(stored.reset_token).not.toBe(rawToken);
	});

	it('projects the token into business_accounts', async () => {
		await forgot({ email: loginEmail });

		const stored = await storedReset(businessId);
		const { rows } = await pool.query<{ reset_token: string | null }>(
			"SELECT reset_token FROM business_accounts WHERE country_code = 'in' AND source_id = $1",
			[businessId]
		);
		expect(rows[0].reset_token).toBe(stored.reset_token);
	});

	it('the minted token is accepted by resetPassword — the flow is reachable end to end', async () => {
		await forgot({ email: loginEmail });
		const rawToken = tokenFromEmail();

		const { status, body } = await reset({
			business_slug: 'pune-solar',
			token: rawToken,
			newPassword: STRONG_PASSWORD
		});

		expect(status).toBe(200);
		expect(body.success).toBe(true);

		const stored = await storedReset(businessId);
		expect(stored.login_password).toBeTruthy();
		// Consumed: cleared on success, which is what makes reuse fail.
		expect(stored.reset_token).toBeNull();
		expect(stored.reset_token_expires).toBeNull();
	});

	it('rejects a second use of the same token', async () => {
		await forgot({ email: loginEmail });
		const rawToken = tokenFromEmail();

		await reset({ business_slug: 'pune-solar', token: rawToken, newPassword: STRONG_PASSWORD });
		const second = await reset({
			business_slug: 'pune-solar',
			token: rawToken,
			newPassword: 'An0ther!Passw0rd'
		});

		expect(second.status).toBe(400);
		expect(second.body.success).toBe(false);
	});

	it('invalidates a previously issued token when a new one is minted', async () => {
		await forgot({ email: loginEmail });
		const firstToken = tokenFromEmail();

		await forgot({ email: loginEmail });
		const secondToken = tokenFromEmail();
		expect(secondToken).not.toBe(firstToken);

		const stale = await reset({
			business_slug: 'pune-solar',
			token: firstToken,
			newPassword: STRONG_PASSWORD
		});
		expect(stale.status).toBe(400);

		const fresh = await reset({
			business_slug: 'pune-solar',
			token: secondToken,
			newPassword: STRONG_PASSWORD
		});
		expect(fresh.status).toBe(200);
	});

	it('answers an unregistered address identically, and sends nothing', async () => {
		const known = await forgot({ email: loginEmail });
		sendEmail.mockClear();

		const unknown = await forgot({ email: 'nobody@example.test' });

		expect(unknown.status).toBe(known.status);
		expect(unknown.body).toEqual(known.body);
		expect(sendEmail).not.toHaveBeenCalled();
	});

	it('does not issue a token for an account in the other country', async () => {
		// Used to assert this by calling the /us endpoint, which Phase 7 deleted.
		// The isolation it was guarding is now enforced one level down: this
		// endpoint is bound to COUNTRY = 'in', and findResetTargetByEmail filters
		// on country_code, so a US address resolves to no target here.
		const usEmail = 'owner@oakland-solar.test';
		const usBusinessId = await createUsBusiness({ slug: 'oakland-solar', loginEmail: usEmail });

		// The address is real — it just belongs to the other country.
		expect(await countryForLoginEmail(usEmail)).toBe('us');

		const { status, body } = await forgot({ email: usEmail });

		// Indistinguishable from an unregistered address, per the enumeration rule.
		expect(status).toBe(200);
		expect(body.success).toBe(true);
		expect(sendEmail).not.toHaveBeenCalled();

		// businesses_1 holds both countries since 054, so this reads the US row by
		// id *and* country_code — asserting on the id alone would still pass if the
		// row had been written under the wrong country.
		const { rows } = await pool.query<{ reset_token: string | null }>(
			"SELECT reset_token FROM businesses_1 WHERE id = $1 AND country_code = 'us'",
			[usBusinessId]
		);
		expect(rows).toHaveLength(1);
		expect(rows[0].reset_token).toBeNull();
	});

	it('rejects a malformed email with 400', async () => {
		const { status, body } = await forgot({ email: 'not-an-email' });

		expect(status).toBe(400);
		expect(body.success).toBe(false);
		expect(sendEmail).not.toHaveBeenCalled();
	});

	it('rate limits after 5 requests from one IP', async () => {
		for (let i = 0; i < 5; i++) {
			expect((await forgot({ email: loginEmail })).status).toBe(200);
		}

		const sixth = await forgot({ email: loginEmail });
		expect(sixth.status).toBe(429);
		expect(sixth.body.success).toBe(false);
	});
});
