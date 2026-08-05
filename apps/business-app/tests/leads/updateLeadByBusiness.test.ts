// Characterization tests for POST /api/updateLeadByBusiness (Phase 5.5).
//
// The two things most at risk in a rewrite:
//  - the update is a *dynamically built* partial UPDATE. Only the fields the
//    caller sent may be written; a rewrite that always sets all three would
//    silently blank out notes or reset a stage.
//  - ownership is checked against the business AND its active branches, so a
//    lead allocated to a branch is editable by the parent's session.
//
// Also pinned: reaching stage 3 (Won) creates a project_management row, exactly
// once, and never fails the update if that side effect breaks.

import { beforeEach, describe, expect, it } from 'vitest';
import { pool } from '../setup/testDb';
import { createBranch, createBusiness, createLead, resetDatabase } from '../helpers/fixtures';
import { createCookies, createSessionCookies, jsonRequest } from '../helpers/request';

const { POST } = await import('../../src/routes/api/updateLeadByBusiness/+server');

interface UpdateResponse {
	success: boolean;
	error?: string;
	lead?: { id: number; stage: number; status: boolean; business_notes: string | null };
}

async function update(
	session: { id: number; slug: string; businessname: string } | null,
	body: Record<string, unknown>
) {
	const cookies = session ? createSessionCookies(session) : createCookies();
	const response = await POST({
		request: jsonRequest(body),
		cookies
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any);
	return { status: response.status, body: (await response.json()) as UpdateResponse };
}

async function leadRow(id: number) {
	const { rows } = await pool.query(
		'SELECT stage, status, business_notes FROM leaddata WHERE id = $1',
		[id]
	);
	return rows[0];
}

beforeEach(async () => {
	await resetDatabase();
});

describe('authorization', () => {
	it('401s without a session', async () => {
		const { status } = await update(null, { id: 1, stage: 1 });

		expect(status).toBe(401);
	});

	it('400s without a lead id', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar' });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test' };

		expect((await update(session, { stage: 1 })).status).toBe(400);
	});

	it('404s for a lead that does not exist', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar' });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test' };

		expect((await update(session, { id: 99999, stage: 1 })).status).toBe(404);
	});

	it("403s on another business's lead", async () => {
		const mine = await createBusiness({ slug: 'acme-solar' });
		const theirs = await createBusiness({ slug: 'rival-solar' });
		const leadId = await createLead({ businessId: theirs, category: 2 });
		const session = { id: mine, slug: 'acme-solar', businessname: 'Test' };

		const { status, body } = await update(session, { id: leadId, stage: 1 });

		expect(status).toBe(403);
		expect(body.error).toMatch(/your own leads/i);
	});

	it("allows updating a lead allocated to one of the session's active branches", async () => {
		const mainId = await createBusiness({ slug: 'acme-solar' });
		const branchId = await createBusiness({ slug: 'acme-solar-nashik', district: 'Nashik' });
		await createBranch(mainId, branchId);
		const leadId = await createLead({ businessId: branchId, category: 2 });
		const session = { id: mainId, slug: 'acme-solar', businessname: 'Test' };

		const { body } = await update(session, { id: leadId, stage: 2 });

		expect(body.success).toBe(true);
		expect((await leadRow(leadId)).stage).toBe(2);
	});

	it('403s for a lead on an inactive branch', async () => {
		const mainId = await createBusiness({ slug: 'acme-solar' });
		const branchId = await createBusiness({ slug: 'old-branch' });
		await createBranch(mainId, branchId, false);
		const leadId = await createLead({ businessId: branchId, category: 2 });
		const session = { id: mainId, slug: 'acme-solar', businessname: 'Test' };

		expect((await update(session, { id: leadId, stage: 1 })).status).toBe(403);
	});

	it('allows updating an unowned lead — business_id null passes the check', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar' });
		const leadId = await createLead({ businessId: null });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test' };

		expect((await update(session, { id: leadId, stage: 1 })).body.success).toBe(true);
	});
});

describe('partial updates', () => {
	it('400s when no updatable field is supplied', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar' });
		const leadId = await createLead({ businessId, category: 2 });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test' };

		const { status, body } = await update(session, { id: leadId });

		expect(status).toBe(400);
		expect(body.error).toMatch(/no fields to update/i);
	});

	it('writes only the field supplied, leaving the others untouched', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar' });
		const leadId = await createLead({ businessId, category: 2, stage: 1, status: true });
		await pool.query("UPDATE leaddata SET business_notes = 'existing note' WHERE id = $1", [leadId]);
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test' };

		await update(session, { id: leadId, stage: 2 });

		expect(await leadRow(leadId)).toMatchObject({
			stage: 2,
			status: true,
			business_notes: 'existing note'
		});
	});

	it('updates status on its own', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar' });
		const leadId = await createLead({ businessId, category: 2, stage: 1, status: true });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test' };

		await update(session, { id: leadId, status: false });

		expect(await leadRow(leadId)).toMatchObject({ stage: 1, status: false });
	});

	it('updates business_notes on its own', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar' });
		const leadId = await createLead({ businessId, category: 2, stage: 1 });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test' };

		await update(session, { id: leadId, business_notes: 'Called, quoted 3kW' });

		expect(await leadRow(leadId)).toMatchObject({ stage: 1, business_notes: 'Called, quoted 3kW' });
	});

	it('updates all three together', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar' });
		const leadId = await createLead({ businessId, category: 2 });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test' };

		const { body } = await update(session, {
			id: leadId,
			stage: 2,
			status: false,
			business_notes: 'Negotiating'
		});

		expect(body.success).toBe(true);
		expect(await leadRow(leadId)).toMatchObject({
			stage: 2,
			status: false,
			business_notes: 'Negotiating'
		});
	});

	it('accepts an explicit null for business_notes as a real clear', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar' });
		const leadId = await createLead({ businessId, category: 2 });
		await pool.query("UPDATE leaddata SET business_notes = 'old' WHERE id = $1", [leadId]);
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test' };

		// null is `!== undefined`, so it is treated as a supplied value.
		await update(session, { id: leadId, business_notes: null });

		expect((await leadRow(leadId)).business_notes).toBeNull();
	});

	it('returns the updated row to the caller', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar' });
		const leadId = await createLead({ businessId, category: 2 });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test' };

		const { body } = await update(session, { id: leadId, stage: 2 });

		expect(body.lead).toMatchObject({ id: leadId, stage: 2 });
	});
});

describe('unified sync', () => {
	it('projects the update into the leads table', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar' });
		const leadId = await createLead({ businessId, category: 2, stage: 0 });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test' };

		await update(session, { id: leadId, stage: 2 });

		const { rows } = await pool.query<{ stage: number }>(
			'SELECT stage FROM leads WHERE country_code = $1 AND source_id = $2',
			['in', leadId]
		);
		expect(rows[0].stage).toBe(2);
	});
});

describe('stage 3 (Won) creates a project', () => {
	it('creates a project_management row when the lead is marked Won', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar' });
		const leadId = await createLead({ businessId, category: 2, stage: 2 });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test' };

		const { body } = await update(session, { id: leadId, stage: 3 });

		expect(body.success).toBe(true);
		const { rows } = await pool.query<{ lead_id: number; stage: number }>(
			'SELECT lead_id, stage FROM project_management'
		);
		expect(rows).toHaveLength(1);
		expect(rows[0]).toMatchObject({ lead_id: leadId, stage: 3 });
	});

	it('does not create a second project when marked Won again', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar' });
		const leadId = await createLead({ businessId, category: 2 });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test' };

		await update(session, { id: leadId, stage: 3 });
		await update(session, { id: leadId, stage: 3 });

		const { rows } = await pool.query('SELECT id FROM project_management');
		expect(rows).toHaveLength(1);
	});

	it('creates no project for any other stage', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar' });
		const leadId = await createLead({ businessId, category: 2 });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test' };

		await update(session, { id: leadId, stage: 2 });
		await update(session, { id: leadId, stage: 4 });

		expect(await pool.query('SELECT id FROM project_management').then((r) => r.rows)).toHaveLength(0);
	});

	it('still reports success when project creation fails', async () => {
		const businessId = await createBusiness({ slug: 'acme-solar' });
		const leadId = await createLead({ businessId, category: 2 });
		const session = { id: businessId, slug: 'acme-solar', businessname: 'Test' };
		await pool.query('DROP TABLE project_management');

		try {
			const { body } = await update(session, { id: leadId, stage: 3 });

			// The lead update is the contract; the project is a side effect.
			expect(body.success).toBe(true);
			expect((await leadRow(leadId)).stage).toBe(3);
		} finally {
			await pool.query(`
				CREATE TABLE project_management (
					id serial PRIMARY KEY NOT NULL,
					lead_id integer,
					stage smallint
				)
			`);
		}
	});
});
