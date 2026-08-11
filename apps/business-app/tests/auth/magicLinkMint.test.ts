// Minting a magic-link token must touch exactly one account.
//
// The bug these pin: admin-app minted with mintInBusinessTokenBySlug(), which
// ran `UPDATE business_accounts ... WHERE b.slug = $3`. business_profiles.slug
// is not unique — live IN data has 191 rows sharing a slug, the same fact
// tests/routing/duplicateSlug.test.ts exists for — so one mint wrote the same
// token hash onto every account on the slug. TokenManager then validates a link
// by (token, slug), which cannot tell those accounts apart either, so a single
// emailed link signed into whichever row the lookup returned first. Live held 6
// such pairs, 5 of them unexpired, when this was found; 072 revokes them.
//
// The mint being exercised here is business-app's. admin-app keeps its own copy
// in apps/admin-app/src/lib/server/magicLink.js (separate repo, `pool` rather
// than Drizzle) and that is where the slug-keyed variant lived — but both now
// key on business_id alone and both write this table, so what is asserted below
// is the property both have to hold. There is no suite on that side to assert
// it in.
//
// The second describe block covers the signature change 071 enables: the mint
// no longer takes a country. `business_accounts.source_id` is a
// business_profiles.business_id, which is globally unique, so the id names one
// account with no help — the country_code that used to accompany it was
// redundant, and the one hop of admin-app's welcome-mail chain that forgot to
// forward it is why that endpoint had been 400ing.

import { beforeEach, describe, expect, it } from 'vitest';
import { mintBusinessTokenById } from '$lib/server/magicLink';
import { TokenManager } from '$lib/auth/business/TokenManager';
import { TokenSecurity } from '$lib/auth/business/TokenSecurity';
import { pool } from '../setup/testDb';
import { createBusiness, createUsBusiness, resetDatabase } from '../helpers/fixtures';

const SLUG = 'shared-slug-solar';

interface StoredToken {
	magic_link_token: string | null;
	magic_link_token_expires_at: string | null;
}

async function tokenOf(businessId: number): Promise<StoredToken> {
	const { rows } = await pool.query<StoredToken>(
		`SELECT magic_link_token, magic_link_token_expires_at
		   FROM business_accounts WHERE source_id = $1`,
		[businessId]
	);
	return rows[0];
}

beforeEach(async () => {
	await resetDatabase();
});

describe('minting is scoped to one account', () => {
	it('leaves the slug twin without a token', async () => {
		const first = await createBusiness({ slug: SLUG, businessname: 'First On Slug' });
		const second = await createBusiness({ slug: SLUG, businessname: 'Second On Slug' });

		const raw = await mintBusinessTokenById(second);

		expect(raw).not.toBeNull();
		expect((await tokenOf(second)).magic_link_token).toBe(TokenSecurity.hashToken(raw!));
		// The bug: this row got the same hash, and the link below then admitted
		// its holder to either business.
		expect((await tokenOf(first)).magic_link_token).toBeNull();
	});

	it('the emailed link resolves to the business it was minted for', async () => {
		const first = await createBusiness({ slug: SLUG, businessname: 'First On Slug' });
		const second = await createBusiness({ slug: SLUG, businessname: 'Second On Slug' });

		// Validation matches on (token, slug), and both businesses carry the slug,
		// so scoping the mint is the only thing that makes this unambiguous.
		const raw = await mintBusinessTokenById(second);
		const result = await new TokenManager('in').validateMagicLinkToken(raw!, SLUG);

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.business.id).toBe(second);
			expect(result.business.id).not.toBe(first);
		}
	});

	it('re-minting for one twin does not revoke the other’s live link', async () => {
		const first = await createBusiness({ slug: SLUG, businessname: 'First On Slug' });
		const second = await createBusiness({ slug: SLUG, businessname: 'Second On Slug' });

		const firstRaw = await mintBusinessTokenById(first);
		await mintBusinessTokenById(second);

		// The slug-keyed mint overwrote both rows, so the second business asking
		// for a link silently expired the first's — last write wins is meant to
		// apply within an account, not across a slug.
		const stillValid = await new TokenManager('in').validateMagicLinkToken(firstRaw!, SLUG);
		expect(stillValid.success).toBe(true);
	});
});

describe('the id alone identifies the account', () => {
	it('mints for a US business without being told the country', async () => {
		const us = await createUsBusiness({ slug: 'us-solar-co' });

		const raw = await mintBusinessTokenById(us);

		expect(raw).not.toBeNull();
		expect((await tokenOf(us)).magic_link_token).toBe(TokenSecurity.hashToken(raw!));
	});

	it('mints for an IN and a US business independently', async () => {
		const inBusiness = await createBusiness({ slug: 'in-solar-co' });
		const usBusiness = await createUsBusiness({ slug: 'us-solar-co' });

		const inRaw = await mintBusinessTokenById(inBusiness);
		const usRaw = await mintBusinessTokenById(usBusiness);

		expect(inRaw).not.toBe(usRaw);
		expect((await tokenOf(inBusiness)).magic_link_token).toBe(TokenSecurity.hashToken(inRaw!));
		expect((await tokenOf(usBusiness)).magic_link_token).toBe(TokenSecurity.hashToken(usRaw!));
	});

	it('returns null for an id with no account, rather than minting nothing quietly', async () => {
		expect(await mintBusinessTokenById(999_999)).toBeNull();
	});
});
