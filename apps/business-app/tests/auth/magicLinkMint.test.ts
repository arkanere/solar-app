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
import { createBranch, createBusiness, createUsBusiness, resetDatabase } from '../helpers/fixtures';

const SLUG = 'shared-slug-solar';

const LINK = { purpose: 'lead_allotted' } as const;

interface StoredLink {
	token_hash: string;
	purpose: string;
	lead_id: number | null;
	expires_at: Date;
	last_used_at: Date | null;
}

/** The business_magic_links rows on a business's account, oldest first. */
async function linksOf(businessId: number): Promise<StoredLink[]> {
	const { rows } = await pool.query<StoredLink>(
		`SELECT token_hash, purpose, lead_id, expires_at, last_used_at
		   FROM business_magic_links WHERE account_business_id = $1 ORDER BY id`,
		[businessId]
	);
	return rows;
}

beforeEach(async () => {
	await resetDatabase();
});

describe('minting is scoped to one account', () => {
	it('leaves the slug twin without a token', async () => {
		const first = await createBusiness({ slug: SLUG, businessname: 'First On Slug' });
		const second = await createBusiness({ slug: SLUG, businessname: 'Second On Slug' });

		const raw = await mintBusinessTokenById(second, LINK);

		expect(raw).not.toBeNull();
		expect((await linksOf(second)).map((l) => l.token_hash)).toEqual([TokenSecurity.hashToken(raw!)]);
		// The bug: this row got the same hash, and the link below then admitted
		// its holder to either business.
		expect(await linksOf(first)).toEqual([]);
	});

	it('the emailed link resolves to the business it was minted for', async () => {
		const first = await createBusiness({ slug: SLUG, businessname: 'First On Slug' });
		const second = await createBusiness({ slug: SLUG, businessname: 'Second On Slug' });

		// Validation matches on (token, slug), and both businesses carry the slug,
		// so scoping the mint is the only thing that makes this unambiguous.
		const raw = await mintBusinessTokenById(second, LINK);
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

		const firstRaw = await mintBusinessTokenById(first, LINK);
		await mintBusinessTokenById(second, LINK);

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

		const raw = await mintBusinessTokenById(us, LINK);

		expect(raw).not.toBeNull();
		expect((await linksOf(us)).map((l) => l.token_hash)).toEqual([TokenSecurity.hashToken(raw!)]);
	});

	it('mints for an IN and a US business independently', async () => {
		const inBusiness = await createBusiness({ slug: 'in-solar-co' });
		const usBusiness = await createUsBusiness({ slug: 'us-solar-co' });

		const inRaw = await mintBusinessTokenById(inBusiness, LINK);
		const usRaw = await mintBusinessTokenById(usBusiness, LINK);

		expect(inRaw).not.toBe(usRaw);
		expect((await linksOf(inBusiness)).map((l) => l.token_hash)).toEqual([TokenSecurity.hashToken(inRaw!)]);
		expect((await linksOf(usBusiness)).map((l) => l.token_hash)).toEqual([TokenSecurity.hashToken(usRaw!)]);
	});

	it('returns null for an id with no account, rather than minting nothing quietly', async () => {
		expect(await mintBusinessTokenById(999_999, LINK)).toBeNull();
	});
});

describe('one row per link (088)', () => {
	it('a new link does not revoke the one sent before it', async () => {
		const id = await createBusiness({ slug: 'acme-solar' });
		const manager = new TokenManager('in');

		const mailed = await mintBusinessTokenById(id, { purpose: 'lead_allotted', leadId: 7 });
		const whatsapp = await mintBusinessTokenById(id, { purpose: 'forgot_password' });

		expect((await manager.validateMagicLinkToken(mailed!, 'acme-solar')).success).toBe(true);
		expect((await manager.validateMagicLinkToken(whatsapp!, 'acme-solar')).success).toBe(true);
		expect(await linksOf(id)).toHaveLength(2);
	});

	it('records the purpose and lead, and returns the lead on sign-in', async () => {
		const id = await createBusiness({ slug: 'acme-solar' });

		const raw = await mintBusinessTokenById(id, { purpose: 'lead_allotted', leadId: 7 });
		const [link] = await linksOf(id);
		expect(link.purpose).toBe('lead_allotted');
		expect(link.lead_id).toBe(7);

		const result = await new TokenManager('in').validateMagicLinkToken(raw!, 'acme-solar');
		expect(result.success && result.leadId).toBe(7);
	});

	it('marks the link used', async () => {
		const id = await createBusiness({ slug: 'acme-solar' });
		const raw = await mintBusinessTokenById(id, LINK);
		expect((await linksOf(id))[0].last_used_at).toBeNull();

		await new TokenManager('in').validateMagicLinkToken(raw!, 'acme-solar');

		expect((await linksOf(id))[0].last_used_at).not.toBeNull();
	});

	it('defaults to a 15-day expiry and honours a shorter one', async () => {
		const id = await createBusiness({ slug: 'acme-solar' });
		await mintBusinessTokenById(id, LINK);
		await mintBusinessTokenById(id, { purpose: 'forgot_password', ttlMs: 60 * 60 * 1000 });

		const [long, short] = await linksOf(id);
		const day = 24 * 60 * 60 * 1000;
		expect(long.expires_at.getTime() - Date.now()).toBeGreaterThan(14 * day);
		expect(short.expires_at.getTime() - Date.now()).toBeLessThanOrEqual(60 * 60 * 1000);
	});

	it('rejects an expired link', async () => {
		const id = await createBusiness({ slug: 'acme-solar' });
		const raw = await mintBusinessTokenById(id, LINK);
		await pool.query(
			`UPDATE business_magic_links SET expires_at = NOW() - INTERVAL '1 minute'`
		);

		const result = await new TokenManager('in').validateMagicLinkToken(raw!, 'acme-solar');
		expect(result.success).toBe(false);
	});

	it('signs in at an active branch’s slug, on the parent’s account', async () => {
		const mainId = await createBusiness({ slug: 'acme-solar' });
		const branchId = await createBusiness({ slug: 'acme-solar-branch-2' });
		await createBranch(mainId, branchId);

		const raw = await mintBusinessTokenById(branchId, LINK);
		const result = await new TokenManager('in').validateMagicLinkToken(raw!, 'acme-solar-branch-2');

		expect(result.success).toBe(true);
		if (result.success) expect(result.business.id).toBe(branchId);
	});
});
