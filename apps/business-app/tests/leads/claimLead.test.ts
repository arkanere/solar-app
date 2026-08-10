// Characterization tests for POST /api/claimLead (Phase 5.5).
//
// This is the endpoint Phase 6 has to rewrite and the one where a silent
// regression is most expensive: it runs a transaction, takes a FOR UPDATE row
// lock, writes across four tables and auto-creates a branch. Everything here
// describes what the raw-SQL version does *today*, so the Drizzle rewrite can
// be judged against it rather than against a reading of the code.
//
// Only the outbound email is mocked. The transaction, the lock, the compliance
// gate and the sv_sync_* projections all run for real against Postgres.

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { pool } from '../setup/testDb';
import {
	createBranch,
	createBusiness,
	createLead,
	createProject,
	resetDatabase,
	seedLeadDataPolicy
} from '../helpers/fixtures';
import { createCookies, createSessionCookies, jsonRequest } from '../helpers/request';

// Outbound mail only. Everything else is the real thing.
vi.mock('$lib/in/sendEmail', () => ({
	sendEmail: vi.fn(async () => ({ success: true })),
	sendEmailIndividually: vi.fn(async () => ({ success: true })),
	sendTemplatedEmail: vi.fn(async () => ({ success: true }))
}));

const { POST } = await import('../../src/routes/api/claimLead/+server');

interface ClaimResponse {
	success: boolean;
	error?: string;
	needsBranchConfirmation?: boolean;
	district?: string;
	newLead?: { id: number; business_id: number; original_id: number; category: number } | null;
}

async function claim(
	session: { id: number; slug: string; businessname: string } | null,
	body: Record<string, unknown>
) {
	const cookies = session ? createSessionCookies(session) : createCookies();
	const response = await POST({
		request: jsonRequest(body),
		cookies
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any);
	return { status: response.status, body: (await response.json()) as ClaimResponse };
}

async function claimCount(leadId: number): Promise<number> {
	const { rows } = await pool.query<{ claim_count: number }>(
		'SELECT claim_count FROM leaddata WHERE id = $1',
		[leadId]
	);
	return rows[0].claim_count;
}

/** A business serving Pune, compliant, with a Pune lead available to claim. */
async function arrangeClaimable() {
	const businessId = await createBusiness({ slug: 'acme-solar', district: 'Pune' });
	await seedLeadDataPolicy(businessId);
	const leadId = await createLead({ district: 'Pune' });
	return {
		businessId,
		leadId,
		session: { id: businessId, slug: 'acme-solar', businessname: 'Test Business' }
	};
}

beforeEach(async () => {
	await resetDatabase();
	vi.clearAllMocks();
});

describe('authorization', () => {
	it('401s without a session', async () => {
		const { businessId, leadId } = await arrangeClaimable();

		const { status, body } = await claim(null, { lead_id: leadId, business_id: businessId });

		expect(status).toBe(401);
		expect(body.success).toBe(false);
	});

	it('400s when lead_id or business_id is missing', async () => {
		const { session, businessId } = await arrangeClaimable();

		expect((await claim(session, { business_id: businessId })).status).toBe(400);
		expect((await claim(session, { lead_id: 1 })).status).toBe(400);
	});

	it('403s when claiming on behalf of another business', async () => {
		const { session, leadId } = await arrangeClaimable();
		const otherId = await createBusiness({ slug: 'rival-solar' });

		const { status, body } = await claim(session, { lead_id: leadId, business_id: otherId });

		expect(status).toBe(403);
		expect(body.error).toMatch(/your own business/i);
	});
});

describe('compliance gate', () => {
	it('403s with compliance_required when the policy was never accepted', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar', district: 'Pune' });
		await seedLeadDataPolicy(businessId, { skipAcceptance: true });
		const leadId = await createLead({ district: 'Pune' });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test Business' };

		const { status, body } = await claim(session, { lead_id: leadId, business_id: businessId });

		expect(status).toBe(403);
		expect(body.error).toBe('compliance_required');
	});

	it('403s when the acceptance is older than 90 days', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar', district: 'Pune' });
		await seedLeadDataPolicy(businessId, { acceptedAt: new Date(Date.now() - 91 * 864e5).toISOString() });
		const leadId = await createLead({ district: 'Pune' });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test Business' };

		const { body } = await claim(session, { lead_id: leadId, business_id: businessId });

		expect(body.error).toBe('compliance_required');
	});

	it('allows a claim when the acceptance is inside the 90-day window', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar', district: 'Pune' });
		await seedLeadDataPolicy(businessId, { acceptedAt: new Date(Date.now() - 89 * 864e5).toISOString() });
		const leadId = await createLead({ district: 'Pune' });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test Business' };

		const { body } = await claim(session, { lead_id: leadId, business_id: businessId });

		expect(body.success).toBe(true);
	});
});

describe('a successful claim', () => {
	it('records the claim, bumps the count and allocates a copy of the lead', async () => {
		const { session, businessId, leadId } = await arrangeClaimable();

		const { body } = await claim(session, { lead_id: leadId, business_id: businessId });

		expect(body.success).toBe(true);
		expect(await claimCount(leadId)).toBe(1);

		const { rows: claims } = await pool.query(
			'SELECT claim_id, business_id, isallotted, isresolved FROM leaddata_claimrequests WHERE lead_id = $1',
			[leadId]
		);
		expect(claims).toHaveLength(1);
		// claim_id is the count *before* the increment, and every claim within
		// the limit is auto-allotted.
		expect(claims[0]).toMatchObject({
			claim_id: 0,
			business_id: businessId,
			isallotted: true,
			isresolved: true
		});

		// The allocated copy is a new leaddata row, category 2, pointing back at
		// the original — not an update of the original row.
		expect(body.newLead).toBeTruthy();
		expect(body.newLead).toMatchObject({
			category: 2,
			original_id: leadId,
			business_id: businessId
		});
		expect(body.newLead!.id).not.toBe(leadId);
	});

	it('copies the customer details onto the allocated lead', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar', district: 'Pune' });
		await seedLeadDataPolicy(businessId);
		const leadId = await createLead({
			name: 'Priya Sharma',
			phone: '9876543210',
			email: 'priya@example.test',
			pinCode: '411001',
			district: 'Pune'
		});
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test Business' };

		const { body } = await claim(session, { lead_id: leadId, business_id: businessId });

		const { rows } = await pool.query(
			'SELECT name, phone, email, pin_code, district, stage, status, claim_count FROM leaddata WHERE id = $1',
			[body.newLead!.id]
		);
		expect(rows[0]).toMatchObject({
			name: 'Priya Sharma',
			phone: '9876543210',
			email: 'priya@example.test',
			pin_code: '411001',
			district: 'Pune',
			stage: 0,
			status: true,
			claim_count: 0
		});
	});

	it('projects both the original and the allocated lead into the unified leads table', async () => {
		const { session, businessId, leadId } = await arrangeClaimable();

		const { body } = await claim(session, { lead_id: leadId, business_id: businessId });

		// syncLeadToUnified is called for the original (its claim_count changed)
		// and for the new copy. Losing either call is a silent data-drift bug.
		const { rows } = await pool.query<{ source_id: number; claim_count: number }>(
			'SELECT source_id, claim_count FROM leads WHERE country_code = $1 ORDER BY source_id',
			['in']
		);
		const bySource = new Map(rows.map((r) => [r.source_id, r]));
		expect(bySource.get(leadId)?.claim_count).toBe(1);
		expect(bySource.has(body.newLead!.id)).toBe(true);
	});
});

describe('claim limits', () => {
	it('rejects a claim once the lead has been claimed 5 times', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar', district: 'Pune' });
		await seedLeadDataPolicy(businessId);
		const leadId = await createLead({ district: 'Pune', claimCount: 5 });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test Business' };

		const { status, body } = await claim(session, { lead_id: leadId, business_id: businessId });

		expect(status).toBe(400);
		expect(body.error).toMatch(/maximum claim limit/i);
		expect(await claimCount(leadId)).toBe(5);
	});

	it('allows the 5th claim but not the 6th', async () => {
		const leadId = await createLead({ district: 'Pune', claimCount: 4 });
		const first = await createBusiness({ slug: 'first-solar', district: 'Pune' });
		const second = await createBusiness({ slug: 'second-solar', district: 'Pune' });
		await seedLeadDataPolicy(first);
		await seedLeadDataPolicy(second);

		const ok = await claim(
			{ id: first, slug: 'first-solar', businessname: 'First' },
			{ lead_id: leadId, business_id: first }
		);
		const rejected = await claim(
			{ id: second, slug: 'second-solar', businessname: 'Second' },
			{ lead_id: leadId, business_id: second }
		);

		expect(ok.body.success).toBe(true);
		expect(rejected.status).toBe(400);
		expect(await claimCount(leadId)).toBe(5);
	});

	it('rejects the same business claiming the same lead twice', async () => {
		const { session, businessId, leadId } = await arrangeClaimable();

		const first = await claim(session, { lead_id: leadId, business_id: businessId });
		const second = await claim(session, { lead_id: leadId, business_id: businessId });

		expect(first.body.success).toBe(true);
		expect(second.status).toBe(400);
		expect(second.body.error).toMatch(/already claimed/i);
		// The rejected attempt must not have bumped the count.
		expect(await claimCount(leadId)).toBe(1);
	});

	it('404-style errors when the lead does not exist', async () => {
		const { session, businessId } = await arrangeClaimable();

		const { body } = await claim(session, { lead_id: 99999, business_id: businessId });

		expect(body.success).toBe(false);
		expect(body.error).toMatch(/lead not found/i);
	});
});

describe('concurrent claims (the FOR UPDATE lock)', () => {
	it('lets exactly one of two simultaneous claims through on the last slot', async () => {
		// claim_count 4 means one slot left. Both requests read the count under
		// FOR UPDATE; the lock is what makes the second see 5 rather than 4.
		const leadId = await createLead({ district: 'Pune', claimCount: 4 });
		const first = await createBusiness({ slug: 'first-solar', district: 'Pune' });
		const second = await createBusiness({ slug: 'second-solar', district: 'Pune' });
		await seedLeadDataPolicy(first);
		await seedLeadDataPolicy(second);

		const [a, b] = await Promise.all([
			claim({ id: first, slug: 'first-solar', businessname: 'First' }, { lead_id: leadId, business_id: first }),
			claim({ id: second, slug: 'second-solar', businessname: 'Second' }, { lead_id: leadId, business_id: second })
		]);

		const succeeded = [a, b].filter((r) => r.body.success);
		expect(succeeded).toHaveLength(1);
		expect(await claimCount(leadId)).toBe(5);

		const { rows } = await pool.query('SELECT id FROM leaddata_claimrequests WHERE lead_id = $1', [
			leadId
		]);
		expect(rows).toHaveLength(1);
	});

	it('serializes two simultaneous claims when slots remain, without losing an increment', async () => {
		const leadId = await createLead({ district: 'Pune', claimCount: 0 });
		const first = await createBusiness({ slug: 'first-solar', district: 'Pune' });
		const second = await createBusiness({ slug: 'second-solar', district: 'Pune' });
		await seedLeadDataPolicy(first);
		await seedLeadDataPolicy(second);

		const [a, b] = await Promise.all([
			claim({ id: first, slug: 'first-solar', businessname: 'First' }, { lead_id: leadId, business_id: first }),
			claim({ id: second, slug: 'second-solar', businessname: 'Second' }, { lead_id: leadId, business_id: second })
		]);

		expect(a.body.success).toBe(true);
		expect(b.body.success).toBe(true);
		// Both increments land: a lost update would leave this at 1.
		expect(await claimCount(leadId)).toBe(2);
	});
});

describe('branch auto-creation', () => {
	it('asks for confirmation when the business serves no branch in the lead district', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar', district: 'Pune' });
		await seedLeadDataPolicy(businessId);
		const leadId = await createLead({ district: 'Nashik', state: 'Maharashtra' });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test Business' };

		const { body } = await claim(session, { lead_id: leadId, business_id: businessId });

		expect(body.needsBranchConfirmation).toBe(true);
		expect(body.district).toBe('Nashik');
		// Rolled back: nothing recorded.
		expect(await claimCount(leadId)).toBe(0);
		const { rows } = await pool.query('SELECT id FROM leaddata_claimrequests');
		expect(rows).toHaveLength(0);
	});

	it('creates a branch in the lead district once confirmed, and allocates to it', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar', district: 'Pune' });
		await seedLeadDataPolicy(businessId);
		const leadId = await createLead({ district: 'Nashik', state: 'Maharashtra' });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test Business' };

		const { body } = await claim(session, {
			lead_id: leadId,
			business_id: businessId,
			confirm_branch_creation: true
		});

		expect(body.success).toBe(true);

		const { rows: branchRows } = await pool.query<{ branch_id: number }>(
			'SELECT branch_id FROM branches WHERE main_id = $1 AND isactive = true',
			[businessId]
		);
		expect(branchRows).toHaveLength(1);
		const branchId = branchRows[0].branch_id;

		// The branch is a real business in the lead's district, and it — not the
		// main business — owns the allocated lead. Since migration 062 that means
		// a row in each half of the split: the profile carries the district and
		// slug, the account the login it shares with its parent.
		const { rows: bizRows } = await pool.query<{ level2: string; slug: string; login_email: string }>(
			`SELECT p.level2, p.slug, a.login_email
			   FROM business_profiles p
			   JOIN business_accounts a
			     ON a.country_code = p.country_code AND a.source_id = p.business_id
			  WHERE p.business_id = $1`,
			[branchId]
		);
		expect(bizRows[0].level2).toBe('Nashik');
		expect(bizRows[0].slug).toMatch(/^acme-solar-branch-/);
		expect(bizRows[0].login_email).toBe('acme-solar@example.test');
		expect(body.newLead!.business_id).toBe(branchId);
	});

	it('claims through an existing branch that already serves the district', async () => {
		const mainId = await createBusiness({ slug: 'acme-solar', district: 'Pune' });
		const branchId = await createBusiness({ slug: 'acme-solar-nashik', district: 'Nashik' });
		await createBranch(mainId, branchId);
		await seedLeadDataPolicy(mainId);
		const leadId = await createLead({ district: 'Nashik' });
		const session = { id: mainId, slug: 'acme-solar', businessname: 'Test Business' };

		const { body } = await claim(session, { lead_id: leadId, business_id: mainId });

		expect(body.success).toBe(true);
		expect(body.needsBranchConfirmation).toBeUndefined();
		expect(body.newLead!.business_id).toBe(branchId);
		// No new branch was created.
		const { rows } = await pool.query('SELECT id FROM branches WHERE main_id = $1', [mainId]);
		expect(rows).toHaveLength(1);
	});

	it('does not ask for confirmation when the lead has no district', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar', district: 'Pune' });
		await seedLeadDataPolicy(businessId);
		const leadId = await createLead({ district: null });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test Business' };

		const { body } = await claim(session, { lead_id: leadId, business_id: businessId });

		expect(body.success).toBe(true);
		expect(body.newLead!.business_id).toBe(businessId);
	});
});

describe('the 10-claim quality gate', () => {
	/** Give `businessId` `count` claimed leads, `stale` of them untouched. */
	async function giveClaimedLeads(businessId: number, count: number, stale: number) {
		for (let i = 0; i < count; i++) {
			await createLead({
				district: 'Pune',
				category: 2,
				isvisible: true,
				businessId,
				// stage 0 + status true is what the gate counts as stale.
				stage: i < stale ? 0 : 1,
				status: true
			});
		}
	}

	it('lets a business under 10 claimed leads through regardless of profile', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar', district: 'Pune' });
		await seedLeadDataPolicy(businessId);
		await giveClaimedLeads(businessId, 9, 9);
		const leadId = await createLead({ district: 'Pune' });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test Business' };

		const { body } = await claim(session, { lead_id: leadId, business_id: businessId });

		expect(body.success).toBe(true);
	});

	it('blocks at 10+ claimed leads when more than half are stale', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar', district: 'Pune' });
		await seedLeadDataPolicy(businessId);
		await giveClaimedLeads(businessId, 10, 9);
		const leadId = await createLead({ district: 'Pune' });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test Business' };

		const { status, body } = await claim(session, { lead_id: leadId, business_id: businessId });

		expect(status).toBe(403);
		expect(body.error).toMatch(/claiming paused/i);
	});

	it('blocks at 10+ claimed leads when the profile is incomplete', async () => {
		// Not stale, 6 projects, one recent — but no description/brands/maps link.
		const businessId = await createBusiness({
			slug: 'acme-solar',
			district: 'Pune',
			description: null,
			brands: null,
			googleMapsLink: null
		});
		await seedLeadDataPolicy(businessId);
		await giveClaimedLeads(businessId, 10, 0);
		for (let i = 0; i < 6; i++) await createProject('acme-solar');
		const leadId = await createLead({ district: 'Pune' });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test Business' };

		const { status } = await claim(session, { lead_id: leadId, business_id: businessId });

		expect(status).toBe(403);
	});

	it('blocks at 10+ claimed leads with fewer than 6 projects', async () => {
		const businessId = await createBusiness({
			slug: 'acme-solar',
			district: 'Pune',
			description: 'We install solar',
			brands: [1],
			googleMapsLink: 'https://maps.example/acme'
		});
		await seedLeadDataPolicy(businessId);
		await giveClaimedLeads(businessId, 10, 0);
		for (let i = 0; i < 5; i++) await createProject('acme-solar');
		const leadId = await createLead({ district: 'Pune' });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test Business' };

		expect((await claim(session, { lead_id: leadId, business_id: businessId })).status).toBe(403);
	});

	it('blocks at 10+ claimed leads when no project is newer than 60 days', async () => {
		const businessId = await createBusiness({
			slug: 'acme-solar',
			district: 'Pune',
			description: 'We install solar',
			brands: [1],
			googleMapsLink: 'https://maps.example/acme'
		});
		await seedLeadDataPolicy(businessId);
		await giveClaimedLeads(businessId, 10, 0);
		const old = new Date(Date.now() - 61 * 864e5).toISOString();
		for (let i = 0; i < 6; i++) await createProject('acme-solar', { createdAt: old });
		const leadId = await createLead({ district: 'Pune' });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test Business' };

		expect((await claim(session, { lead_id: leadId, business_id: businessId })).status).toBe(403);
	});

	it('lets a business through at 10+ claimed leads when every requirement is met', async () => {
		const businessId = await createBusiness({
			slug: 'acme-solar',
			district: 'Pune',
			description: 'We install solar',
			brands: [1],
			googleMapsLink: 'https://maps.example/acme'
		});
		await seedLeadDataPolicy(businessId);
		await giveClaimedLeads(businessId, 10, 0);
		for (let i = 0; i < 6; i++) await createProject('acme-solar');
		const leadId = await createLead({ district: 'Pune' });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test Business' };

		const { body } = await claim(session, { lead_id: leadId, business_id: businessId });

		expect(body.success).toBe(true);
	});

	it('counts claimed leads across the business and its active branches', async () => {
		const mainId = await createBusiness({ slug: 'acme-solar', district: 'Pune' });
		const branchId = await createBusiness({ slug: 'acme-solar-nashik', district: 'Nashik' });
		await createBranch(mainId, branchId);
		await seedLeadDataPolicy(mainId);
		// Split across main and branch: neither alone reaches 10, together they do.
		await giveClaimedLeads(mainId, 5, 5);
		await giveClaimedLeads(branchId, 5, 5);
		const leadId = await createLead({ district: 'Pune' });
		const session = { id: mainId, slug: 'acme-solar', businessname: 'Test Business' };

		const { status } = await claim(session, { lead_id: leadId, business_id: mainId });

		expect(status).toBe(403);
	});
});
