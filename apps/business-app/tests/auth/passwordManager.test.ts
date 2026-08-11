// Characterization tests for PasswordManager (Phase 5.5).
//
// The query under test joins business_accounts to businesses on
// (country_code, source_id) and filters on the *slug* as well as the email.
// That join is the interesting part: it is what stops an email from
// authenticating against a business it does not belong to, and it is easy to
// weaken by accident when rewriting.

import { beforeEach, describe, expect, it } from 'vitest';
import bcrypt from 'bcrypt';
import { PasswordManager } from '$lib/auth/business/PasswordManager';
import type { Business } from '$lib/types/auth';
import { pool } from '../setup/testDb';
import { createBusiness, resetDatabase } from '../helpers/fixtures';

const manager = new PasswordManager('in');

const PASSWORD = 'CorrectHorse1!';

function businessRecord(overrides: Partial<Business> & { id: number; slug: string }): Business {
	return {
		businessname: 'Test Business',
		login_email: `${overrides.slug}@example.test`,
		isvisible: true,
		...overrides
	} as Business;
}

async function createBusinessWithPassword(slug: string, password: string | null) {
	const hash = password === null ? null : await bcrypt.hash(password, 4);
	const id = await createBusiness({ slug, loginPassword: hash });
	return id;
}

beforeEach(async () => {
	await resetDatabase();
});

describe('PasswordManager.validatePassword', () => {
	it('succeeds on the correct password', async () => {
		const id = await createBusinessWithPassword('acme-solar', PASSWORD);
		const business = businessRecord({ id, slug: 'acme-solar' });

		const result = await manager.validatePassword('acme-solar@example.test', PASSWORD, business);

		expect(result.success).toBe(true);
	});

	it('rejects the wrong password', async () => {
		const id = await createBusinessWithPassword('acme-solar', PASSWORD);
		const business = businessRecord({ id, slug: 'acme-solar' });

		const result = await manager.validatePassword('acme-solar@example.test', 'WrongPass1!', business);

		expect(result.success).toBe(false);
	});

	it('rejects when the email does not match the business record', async () => {
		const id = await createBusinessWithPassword('acme-solar', PASSWORD);
		const business = businessRecord({ id, slug: 'acme-solar' });

		// Correct password, but an email that is not this business's login_email.
		const result = await manager.validatePassword('someone-else@example.test', PASSWORD, business);

		expect(result.success).toBe(false);
	});

	it("does not authenticate one business's email against another's slug", async () => {
		await createBusinessWithPassword('acme-solar', PASSWORD);
		const otherId = await createBusinessWithPassword('rival-solar', PASSWORD);

		// The email belongs to acme, the slug to rival: the join must find nothing.
		const business = businessRecord({
			id: otherId,
			slug: 'rival-solar',
			login_email: 'acme-solar@example.test'
		});
		const result = await manager.validatePassword('acme-solar@example.test', PASSWORD, business);

		expect(result.success).toBe(false);
	});

	it('directs magic-link-only accounts away from password auth', async () => {
		const id = await createBusinessWithPassword('magic-only', null);
		const business = businessRecord({ id, slug: 'magic-only' });

		const result = await manager.validatePassword('magic-only@example.test', PASSWORD, business);

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error).toMatch(/magic link/i);
		}
	});

	it('never authenticates against a plaintext value stored in login_password', async () => {
		// 074's premise. 6472 live rows held the literal string
		// `businessadminzpassword` in login_password rather than a bcrypt hash —
		// a seeded placeholder, not something anyone chose. It is safe only
		// because bcrypt.compare() returns false for anything that is not a
		// valid hash, so the obvious guess cannot get in. That is a property of
		// bcrypt rather than of this code, which is exactly why it is worth a
		// test: a rewrite that added a `stored === password` fallback (a
		// plausible "support legacy passwords" change) would hand out 6472
		// accounts at once, and every other test here would still pass.
		const id = await createBusiness({ slug: 'plaintext-pw', loginPassword: 'plaintextsecret' });
		const business = businessRecord({ id, slug: 'plaintext-pw' });

		const result = await manager.validatePassword(
			'plaintext-pw@example.test',
			'plaintextsecret',
			business
		);

		expect(result.success).toBe(false);
	});

	it('rejects an unknown business rather than throwing', async () => {
		const business = businessRecord({ id: 999, slug: 'does-not-exist' });

		const result = await manager.validatePassword('does-not-exist@example.test', PASSWORD, business);

		expect(result.success).toBe(false);
	});

	it('reads the hash from business_accounts, not from the archived copy', async () => {
		const id = await createBusinessWithPassword('acme-solar', PASSWORD);
		const business = businessRecord({ id, slug: 'acme-solar' });

		// This used to poison businesses_1 to prove the read came from
		// business_accounts. Migration 062 archived that table, so the case it
		// guarded cannot arise from a stale projection any more — what is worth
		// pinning now is that business_accounts is sufficient on its own, with no
		// second copy of the hash anywhere for a fallback to reach.
		const { rows } = await pool.query<{ count: string }>(
			`SELECT count(*) AS count FROM information_schema.columns
			  WHERE table_name = 'business_profiles' AND column_name = 'login_password'`
		);
		expect(rows[0].count).toBe('0');

		const result = await manager.validatePassword('acme-solar@example.test', PASSWORD, business);
		expect(result.success).toBe(true);
	});
});

describe('PasswordManager.hashPassword', () => {
	it('produces a bcrypt hash that verifies against the original', async () => {
		const hash = await manager.hashPassword(PASSWORD);

		expect(hash).not.toBe(PASSWORD);
		expect(await bcrypt.compare(PASSWORD, hash)).toBe(true);
	});

	it('salts — the same password hashes differently each time', async () => {
		expect(await manager.hashPassword(PASSWORD)).not.toBe(await manager.hashPassword(PASSWORD));
	});
});
