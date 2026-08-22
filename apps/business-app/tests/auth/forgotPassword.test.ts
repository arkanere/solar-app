// Tests for POST /api/forgotPassword — the entry point the reset flow was
// missing. Nothing in the app ever wrote `reset_token`, so `resetPassword`
// worked but could not be reached by a user; these cover the new endpoint and,
// most importantly, that the token it mints is one resetPassword accepts.
//
// The enumeration guarantee is the other thing under test: a registered and an
// unregistered address must produce byte-identical responses.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import bcrypt from 'bcrypt';
import { pool } from '../setup/testDb';
import { createBusiness, createUsBusiness, resetDatabase } from '../helpers/fixtures';
import { jsonRequest } from '../helpers/request';
import { countryForLoginEmail } from '$lib/server/resolveCountry';
import { PasswordManager } from '$lib/auth/business/PasswordManager';
import { TokenManager } from '$lib/auth/business/TokenManager';
import type { Business } from '$lib/types/auth';

// Parameters are named so `sendEmail.mock.calls[i][n]` type-checks; a bare
// `vi.fn(async () => …)` types every call's args as the empty tuple, which makes
// any index into them an error.
const sendEmail = vi.fn(async (_to: string, _subject: string, _message: string, _options?: unknown) => ({
	success: true
}));

vi.mock('$lib/in/sendEmail', () => ({
	sendEmail: (...args: unknown[]) => sendEmail(...(args as [])),
	sendEmailIndividually: vi.fn(async () => ({ success: true })),
	sendTemplatedEmail: vi.fn(async () => ({ success: true }))
}));

const { POST: forgotPassword } = await import('../../src/routes/api/forgotPassword/+server');
const { POST: resetPassword } = await import('../../src/routes/api/resetPassword/+server');

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

/** The sign-in link out of the most recent email. Magic tokens are uuids, so
 * this cannot collide with the hex reset token above. */
function signInTokenFromEmail(): string {
	const message = sendEmail.mock.calls.at(-1)?.[2] as unknown as string;
	const match = message.match(/signin-link\/([0-9a-f-]{36})/);
	if (!match) throw new Error(`no sign-in link in email:\n${message}`);
	return match[1];
}

async function storedMagic(businessId: number, country = 'in') {
	const { rows } = await pool.query<{
		magic_link_token: string | null;
		magic_link_token_expires_at: Date | null;
	}>(
		'SELECT magic_link_token, magic_link_token_expires_at FROM business_accounts WHERE source_id = $1 AND country_code = $2',
		[businessId, country]
	);
	return rows[0];
}

async function storedReset(businessId: number) {
	const { rows } = await pool.query<{
		reset_token: string | null;
		reset_token_expires: Date | null;
		login_password: string | null;
	}>(
		'SELECT reset_token, reset_token_expires, login_password FROM business_accounts WHERE source_id = $1',
		[businessId]
	);
	return rows[0];
}

const STRONG_PASSWORD = 'Str0ng!Passw0rd';

describe('POST /api/forgotPassword', () => {
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

	it('issues a token for a US account too — the country comes from the email', async () => {
		// This used to assert the opposite. The endpoint was pinned to
		// COUNTRY = 'in', so a US address resolved to no target and silently got
		// nothing back; the test recorded that as intended isolation. It was not —
		// it was the one endpoint the country-resolution sweep missed, because it
		// takes an email rather than a slug. countryForLoginEmail closes it.
		const usEmail = 'owner@oakland-solar.test';
		const usBusinessId = await createUsBusiness({ slug: 'oakland-solar', loginEmail: usEmail });

		expect(await countryForLoginEmail(usEmail)).toBe('us');

		const { status, body } = await forgot({ email: usEmail });

		expect(status).toBe(200);
		expect(body.success).toBe(true);
		expect(sendEmail).toHaveBeenCalledTimes(1);
		expect(sendEmail.mock.calls[0][0]).toBe(usEmail);

		// business_accounts holds both countries, so this reads the US row by
		// source_id *and* country_code — asserting on the id alone would still pass
		// if the token had been written onto an IN row that happened to share it.
		const { rows } = await pool.query<{ reset_token: string | null }>(
			"SELECT reset_token FROM business_accounts WHERE source_id = $1 AND country_code = 'us'",
			[usBusinessId]
		);
		expect(rows).toHaveLength(1);
		expect(rows[0].reset_token).toBeTruthy();

		// No country segment in the link — business-app URLs are country-less, and
		// the slug already implies the country.
		const message = sendEmail.mock.calls[0][2];
		expect(message).toContain('business.solarvipani.com/oakland-solar/reset-password/');
	});

	it('the US link resets the US password end to end', async () => {
		const usEmail = 'owner@oakland-solar.test';
		const usBusinessId = await createUsBusiness({ slug: 'oakland-solar', loginEmail: usEmail });

		await forgot({ email: usEmail });
		const rawToken = tokenFromEmail();

		const { status, body } = await reset({
			business_slug: 'oakland-solar',
			token: rawToken,
			newPassword: STRONG_PASSWORD
		});

		expect(status).toBe(200);
		expect(body.success).toBe(true);

		const stored = await storedReset(usBusinessId);
		expect(stored.login_password).toBeTruthy();
		expect(stored.reset_token).toBeNull();
	});

	it('still leaves an IN account alone when a US address is used', async () => {
		// The two countries share businesses_1 now, so "resolved the country" has
		// to mean the *other* country's row is untouched, not merely that this one
		// worked.
		const usEmail = 'owner@oakland-solar.test';
		await createUsBusiness({ slug: 'oakland-solar', loginEmail: usEmail });

		await forgot({ email: usEmail });

		const inRow = await storedReset(businessId);
		expect(inRow.reset_token).toBeNull();
	});

	it('rejects a malformed email with 400', async () => {
		const { status, body } = await forgot({ email: 'not-an-email' });

		expect(status).toBe(400);
		expect(body.success).toBe(false);
		expect(sendEmail).not.toHaveBeenCalled();
	});

	it('emails a sign-in link alongside the reset link, and stores it hashed', async () => {
		await forgot({ email: loginEmail });

		// One email, both links — not two mails.
		expect(sendEmail).toHaveBeenCalledTimes(1);
		const message = sendEmail.mock.calls[0][2];
		expect(message).toContain('business.solarvipani.com/pune-solar/reset-password/');
		expect(message).toContain('business.solarvipani.com/pune-solar/signin-link/');

		const stored = await storedMagic(businessId);
		expect(stored.magic_link_token).toBeTruthy();
		expect(stored.magic_link_token_expires_at!.getTime()).toBeGreaterThan(Date.now());
		expect(stored.magic_link_token).not.toBe(signInTokenFromEmail());
	});

	it('the sign-in link it emails actually signs the account in', async () => {
		await forgot({ email: loginEmail });

		const result = await new TokenManager('in').validateMagicLinkToken(
			signInTokenFromEmail(),
			'pune-solar'
		);

		expect(result.success).toBe(true);
	});

	it('issues a sign-in link for a US account too', async () => {
		const usEmail = 'owner@oakland-solar.test';
		const usBusinessId = await createUsBusiness({ slug: 'oakland-solar', loginEmail: usEmail });

		await forgot({ email: usEmail });

		expect(sendEmail.mock.calls[0][2]).toContain(
			'business.solarvipani.com/oakland-solar/signin-link/'
		);
		expect((await storedMagic(usBusinessId, 'us')).magic_link_token).toBeTruthy();

		const result = await new TokenManager('us').validateMagicLinkToken(
			signInTokenFromEmail(),
			'oakland-solar'
		);
		expect(result.success).toBe(true);
	});

	it('mints no sign-in token for an unregistered address', async () => {
		await forgot({ email: 'nobody@example.test' });

		expect(sendEmail).not.toHaveBeenCalled();
		expect((await storedMagic(businessId)).magic_link_token).toBeNull();
	});

	it('rate limits after 5 requests from one IP', async () => {
		for (let i = 0; i < 5; i++) {
			expect((await forgot({ email: loginEmail })).status).toBe(200);
		}

		const sixth = await forgot({ email: loginEmail });
		expect(sixth.status).toBe(429);
		expect(sixth.body.success).toBe(false);
	});

	it('the rate limit covers the sign-in link too — a blocked request mints nothing', async () => {
		// The sign-in link is minted on the same endpoint, after the same check,
		// so there is no second door to walk through once the bucket is spent.
		for (let i = 0; i < 5; i++) await forgot({ email: loginEmail });
		const lastIssued = (await storedMagic(businessId)).magic_link_token;
		sendEmail.mockClear();

		const sixth = await forgot({ email: loginEmail });

		expect(sixth.status).toBe(429);
		expect(sendEmail).not.toHaveBeenCalled();
		// Unchanged: no fresh token, so no new link exists to have been emailed.
		expect((await storedMagic(businessId)).magic_link_token).toBe(lastIssued);
	});
});

// Live IN data has duplicate `businesses.slug` values (~25 of them, one slug ×5),
// and business_profiles has no unique constraint on slug — only a plain index —
// so it can never be assumed unique. resetPassword took the slug alone with `.limit(1)`,
// which meant a valid link could land on a *different* row than the one its token
// was minted against and report "invalid or expired". The token hash is what
// actually identifies the account, so the lookup matches on it.
//
// The country_code filter mintPasswordResetToken uses is not available here:
// business-app URLs carry no country segment, so the endpoint only ever sees the
// slug. Matching on the token instead is country-free and fixes the duplicate
// case outright.
describe('a reset link works when its slug is not unique', () => {
	const slug = 'spectrum-solar-power-kasaragod';
	const firstEmail = 'first@spectrum.test';
	const secondEmail = 'second@spectrum.test';

	beforeEach(async () => {
		await resetDatabase();
		sendEmail.mockClear();
		clientIp = `198.51.100.${Math.floor(Math.random() * 200) + 1}`;
	});

	it('resets the row the token was minted against, not the first row with that slug', async () => {
		// Inserted first, so a bare `WHERE slug = $1 LIMIT 1` returns this one.
		const firstId = await createBusiness({ slug, loginEmail: firstEmail });
		const secondId = await createBusiness({ slug, loginEmail: secondEmail });

		await forgot({ email: secondEmail });
		const rawToken = tokenFromEmail();

		const { status, body } = await reset({
			business_slug: slug,
			token: rawToken,
			newPassword: STRONG_PASSWORD
		});

		expect(status).toBe(200);
		expect(body.success).toBe(true);

		const second = await storedReset(secondId);
		expect(second.login_password).toBeTruthy();
		expect(await bcrypt.compare(STRONG_PASSWORD, second.login_password!)).toBe(true);
		expect(second.reset_token).toBeNull();

		// The namesake is untouched — the fix must not widen the write either.
		const first = await storedReset(firstId);
		expect(first.login_password).toBeNull();
	});

	it('still rejects a token that belongs to no row with that slug', async () => {
		await createBusiness({ slug, loginEmail: firstEmail });
		const otherId = await createBusiness({ slug: 'other-solar', loginEmail: 'other@solar.test' });

		// A genuine, unexpired token — but minted against a different slug.
		await forgot({ email: 'other@solar.test' });
		const rawToken = tokenFromEmail();

		const { status, body } = await reset({
			business_slug: slug,
			token: rawToken,
			newPassword: STRONG_PASSWORD
		});

		expect(status).toBe(400);
		expect(body.success).toBe(false);

		// Unconsumed: the mismatch must not clear the other business's token.
		const other = await storedReset(otherId);
		expect(other.reset_token).toBeTruthy();
	});
});

// The round-trip tests above used to assert on businesses_1, which is why they
// passed while a completed reset did not actually change what login accepts:
// PasswordManager reads business_accounts.login_password, which was then a
// projection that resetPassword forgot to refresh. Migration 062 made that table
// the store and both now write it, so the two halves can no longer disagree —
// but these still assert on the login that follows rather than on the write,
// which is the property that actually matters.
describe('a completed reset changes what login accepts', () => {
	const OLD_PASSWORD = '0ld!Passw0rd';

	function businessRecord(id: number, slug: string, loginEmail: string): Business {
		return {
			id,
			slug,
			businessname: 'Test Business',
			login_email: loginEmail,
			// 077: the account's flag, renamed from isvisible so it stops sharing a
			// name with the profile's per-location one.
			isActive: true
		} as Business;
	}

	beforeEach(async () => {
		await resetDatabase();
		sendEmail.mockClear();
		clientIp = `198.51.100.${Math.floor(Math.random() * 200) + 1}`;
	});

	it('the new password authenticates and the old one stops working (IN)', async () => {
		const loginEmail = 'owner@pune-solar.test';
		const businessId = await createBusiness({
			slug: 'pune-solar',
			loginEmail,
			loginPassword: await bcrypt.hash(OLD_PASSWORD, 4)
		});
		const business = businessRecord(businessId, 'pune-solar', loginEmail);
		const manager = new PasswordManager('in');

		await forgot({ email: loginEmail });
		const { status } = await reset({
			business_slug: 'pune-solar',
			token: tokenFromEmail(),
			newPassword: STRONG_PASSWORD
		});
		expect(status).toBe(200);

		expect((await manager.validatePassword(loginEmail, STRONG_PASSWORD, business)).success).toBe(
			true
		);
		expect((await manager.validatePassword(loginEmail, OLD_PASSWORD, business)).success).toBe(false);
	});

	it('projects the new hash into business_accounts (IN)', async () => {
		const loginEmail = 'owner@pune-solar.test';
		const businessId = await createBusiness({ slug: 'pune-solar', loginEmail });

		await forgot({ email: loginEmail });
		await reset({
			business_slug: 'pune-solar',
			token: tokenFromEmail(),
			newPassword: STRONG_PASSWORD
		});

		const { rows } = await pool.query<{ login_password: string | null }>(
			"SELECT login_password FROM business_accounts WHERE country_code = 'in' AND source_id = $1",
			[businessId]
		);
		expect(rows[0].login_password).toBeTruthy();
		expect(await bcrypt.compare(STRONG_PASSWORD, rows[0].login_password!)).toBe(true);
	});

	it('the new password authenticates on the US side too', async () => {
		const loginEmail = 'owner@oakland-solar.test';
		const businessId = await createUsBusiness({ slug: 'oakland-solar', loginEmail });
		const business = businessRecord(businessId, 'oakland-solar', loginEmail);

		await forgot({ email: loginEmail });
		const { status } = await reset({
			business_slug: 'oakland-solar',
			token: tokenFromEmail(),
			newPassword: STRONG_PASSWORD
		});
		expect(status).toBe(200);

		const result = await new PasswordManager('us').validatePassword(
			loginEmail,
			STRONG_PASSWORD,
			business
		);
		expect(result.success).toBe(true);
	});
});
