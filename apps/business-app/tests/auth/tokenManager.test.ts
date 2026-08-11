// Characterization tests for TokenManager (Phase 5.5).
//
// Three properties worth locking down:
//  - tokens are matched by HASH, never by the raw value at rest;
//  - a NULL expiry counts as expired (fail-closed), which is the opposite of
//    what a naive `expires_at > now()` rewrite would do;
//  - getBusinessByEmail resolves a shared login_email to the main business,
//    which since 076 is a property of the data (a branch has no account) rather
//    than of a filter in the query.

import { beforeEach, describe, expect, it } from 'vitest';
import { TokenManager } from '$lib/auth/business/TokenManager';
import { TokenSecurity } from '$lib/auth/business/TokenSecurity';
import { pool } from '../setup/testDb';
import { createBranch, createBusiness, resetDatabase } from '../helpers/fixtures';

const manager = new TokenManager('in');

const RAW_TOKEN = 'raw-magic-link-token-abc123';

/** Store a magic-link token the way the app does: hashed, with an expiry. */
async function storeMagicToken(
	businessId: number,
	rawToken: string,
	expiresAt: string | null = "NOW() + INTERVAL '1 hour'"
) {
	await pool.query(
		`UPDATE business_accounts
		 SET magic_link_token = $1,
		     magic_link_token_expires_at = ${expiresAt === null ? 'NULL' : expiresAt}
		 WHERE country_code = 'in' AND source_id = $2`,
		[TokenSecurity.hashToken(rawToken), businessId]
	);
}

beforeEach(async () => {
	await resetDatabase();
});

describe('TokenManager.validateMagicLinkToken', () => {
	it('accepts a valid unexpired token for the right slug', async () => {
		const id = await createBusiness({ slug: 'acme-solar' });
		await storeMagicToken(id, RAW_TOKEN);

		const result = await manager.validateMagicLinkToken(RAW_TOKEN, 'acme-solar');

		expect(result.success).toBe(true);
		if (result.success) expect(result.business.id).toBe(id);
	});

	it('matches on the hash — the raw token is never what is stored', async () => {
		const id = await createBusiness({ slug: 'acme-solar' });
		await storeMagicToken(id, RAW_TOKEN);

		const { rows } = await pool.query<{ magic_link_token: string }>(
			'SELECT magic_link_token FROM business_accounts WHERE source_id = $1',
			[id]
		);
		expect(rows[0].magic_link_token).not.toBe(RAW_TOKEN);
		expect(rows[0].magic_link_token).toBe(TokenSecurity.hashToken(RAW_TOKEN));

		// Presenting the stored hash as if it were the token must not work.
		const result = await manager.validateMagicLinkToken(rows[0].magic_link_token, 'acme-solar');
		expect(result.success).toBe(false);
	});

	it('rejects an expired token', async () => {
		const id = await createBusiness({ slug: 'acme-solar' });
		await storeMagicToken(id, RAW_TOKEN, "NOW() - INTERVAL '1 minute'");

		const result = await manager.validateMagicLinkToken(RAW_TOKEN, 'acme-solar');

		expect(result.success).toBe(false);
	});

	it('treats a NULL expiry as expired', async () => {
		const id = await createBusiness({ slug: 'acme-solar' });
		await storeMagicToken(id, RAW_TOKEN, null);

		const result = await manager.validateMagicLinkToken(RAW_TOKEN, 'acme-solar');

		expect(result.success).toBe(false);
	});

	it('rejects a valid token presented against a different slug', async () => {
		const id = await createBusiness({ slug: 'acme-solar' });
		await createBusiness({ slug: 'rival-solar' });
		await storeMagicToken(id, RAW_TOKEN);

		const result = await manager.validateMagicLinkToken(RAW_TOKEN, 'rival-solar');

		expect(result.success).toBe(false);
	});

	it('rejects a token for an invisible business', async () => {
		const id = await createBusiness({ slug: 'hidden-solar', isvisible: false });
		await storeMagicToken(id, RAW_TOKEN);

		const result = await manager.validateMagicLinkToken(RAW_TOKEN, 'hidden-solar');

		expect(result.success).toBe(false);
		if (!result.success) expect(result.error).toMatch(/not active/i);
	});

	it('rejects a token for a deactivated branch, whose parent account is still live', async () => {
		// 075/076. A branch used to hold its own account row, so deleteBranch hid
		// the branch by setting isvisible = false on both halves. The branch now
		// shares its parent's account outright — deleteBranch must not touch it, or
		// hiding one location would lock the whole business out — so the profile's
		// flag is the only thing that says this location is off. Validation has to
		// read it, or a magic link would still sign in at a deleted branch's slug.
		const mainId = await createBusiness({ slug: 'acme-solar' });
		const branchId = await createBusiness({ slug: 'acme-solar-branch-1', isvisible: false });
		await createBranch(mainId, branchId);

		// The token is on the parent's account, which is live and stays live.
		await storeMagicToken(mainId, RAW_TOKEN);

		const atBranch = await manager.validateMagicLinkToken(RAW_TOKEN, 'acme-solar-branch-1');
		expect(atBranch.success).toBe(false);

		// The same token at the parent's own slug still works — the account was
		// never deactivated, only that one location.
		const atMain = await manager.validateMagicLinkToken(RAW_TOKEN, 'acme-solar');
		expect(atMain.success).toBe(true);
		if (atMain.success) expect(atMain.business.id).toBe(mainId);
	});

	it('accepts a token at an active branch’s slug, on the parent’s account', async () => {
		// The other half: an active branch has no account of its own, so this only
		// resolves because account_business_id points at the parent.
		const mainId = await createBusiness({ slug: 'acme-solar' });
		const branchId = await createBusiness({ slug: 'acme-solar-branch-2' });
		await createBranch(mainId, branchId);
		await storeMagicToken(mainId, RAW_TOKEN);

		const result = await manager.validateMagicLinkToken(RAW_TOKEN, 'acme-solar-branch-2');

		expect(result.success).toBe(true);
		// Identity stays the branch — the session is about the location the link
		// named, not the account behind it.
		if (result.success) expect(result.business.id).toBe(branchId);
	});

	it('rejects an unknown token', async () => {
		await createBusiness({ slug: 'acme-solar' });

		const result = await manager.validateMagicLinkToken('never-issued', 'acme-solar');

		expect(result.success).toBe(false);
	});
});

describe('TokenManager.getBusinessByEmail', () => {
	it('finds a visible business by login email', async () => {
		const id = await createBusiness({ slug: 'acme-solar' });

		const result = await manager.getBusinessByEmail('acme-solar@example.test');

		expect(result.success).toBe(true);
		if (result.success) expect(result.business.id).toBe(id);
	});

	it('resolves a shared email to the main business, because only it has an account', async () => {
		// This used to test an *exclusion*: a branch carried a duplicate account
		// holding its main's login_email, so one address matched several rows and
		// getBusinessByEmail had to filter the branches back out. 076 deleted those
		// duplicates and createBranch now models that — the branch has no account —
		// so the answer is unambiguous at the data level rather than by filtering.
		const mainId = await createBusiness({ slug: 'acme-solar', loginEmail: 'shared@example.test' });
		const branchId = await createBusiness({
			slug: 'acme-solar-branch-1',
			loginEmail: 'shared@example.test'
		});
		await createBranch(mainId, branchId);

		const result = await manager.getBusinessByEmail('shared@example.test');

		expect(result.success).toBe(true);
		if (result.success) expect(result.business.id).toBe(mainId);
	});

	it('does not resolve an email that belonged to a branch before it became one', async () => {
		// The counterpart of the test above, and the reason deleteBranch must not
		// clear credentials: a branch has no account at all since 076, so an address
		// that only ever existed on its own row is gone with that row. If this
		// starts passing, something has re-created per-branch accounts and the
		// duplicate-credential drift 074/076 cleaned up is back.
		const mainId = await createBusiness({ slug: 'acme-solar', loginEmail: 'a@example.test' });
		const branchId = await createBusiness({
			slug: 'old-branch',
			loginEmail: 'old-branch@example.test'
		});
		await createBranch(mainId, branchId, false);

		const result = await manager.getBusinessByEmail('old-branch@example.test');

		expect(result.success).toBe(false);
	});

	it('does not find an invisible business', async () => {
		await createBusiness({ slug: 'hidden-solar', isvisible: false });

		const result = await manager.getBusinessByEmail('hidden-solar@example.test');

		expect(result.success).toBe(false);
	});

	it('reports not-found for an unknown email', async () => {
		const result = await manager.getBusinessByEmail('nobody@example.test');

		expect(result.success).toBe(false);
	});
});

describe('TokenManager.getBusinessBySlug', () => {
	it('finds a visible business by slug', async () => {
		const id = await createBusiness({ slug: 'acme-solar' });

		const result = await manager.getBusinessBySlug('acme-solar');

		expect(result.success).toBe(true);
		if (result.success) expect(result.business.id).toBe(id);
	});

	it('does not find an invisible business', async () => {
		await createBusiness({ slug: 'hidden-solar', isvisible: false });

		expect((await manager.getBusinessBySlug('hidden-solar')).success).toBe(false);
	});

	it('reports not-found for an unknown slug', async () => {
		expect((await manager.getBusinessBySlug('nope')).success).toBe(false);
	});
});
