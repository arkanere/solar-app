// Characterization tests for POST /api/submitLead (Phase 5.5).
//
// Small endpoint, but two behaviors are load-bearing and easy to lose in a
// rewrite: the pincode -> district lookup is best-effort (a lookup failure must
// still produce a lead, with a null district), and the confirmation email is
// dispatched through the event's own `fetch`.

import { beforeEach, describe, expect, it } from 'vitest';
import { pool } from '../setup/testDb';
import { createPincodeMapping, resetDatabase } from '../helpers/fixtures';
import { jsonRequest, recordingFetch } from '../helpers/request';

const { POST } = await import('../../src/routes/api/submitLead/+server');

interface SubmitResponse {
	success: boolean;
	reference_uuid?: string;
	error?: string;
}

async function submit(body: Record<string, unknown>, fetchImpl = recordingFetch()) {
	const response = await POST({
		request: jsonRequest(body),
		fetch: fetchImpl
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any);
	return {
		status: response.status,
		body: (await response.json()) as SubmitResponse,
		fetchImpl
	};
}

const VALID = {
	name: 'Priya Sharma',
	phone: '9876543210',
	pinCode: '411001',
	type: 'Residential',
	comment: 'Interested in a 3kW system',
	urlParam: 'utm_source=google'
};

beforeEach(async () => {
	await resetDatabase();
});

describe('POST /api/submitLead', () => {
	it('inserts the lead and returns its reference uuid', async () => {
		await createPincodeMapping('411001', 'Pune');

		const { body } = await submit(VALID);

		expect(body.success).toBe(true);
		expect(body.reference_uuid).toMatch(/^[0-9a-f-]{36}$/);

		const { rows } = await pool.query(
			'SELECT name, phone, pin_code, type, comment, urlparams, email, district FROM leaddata'
		);
		expect(rows).toHaveLength(1);
		expect(rows[0]).toMatchObject({
			name: 'Priya Sharma',
			phone: '9876543210',
			pin_code: '411001',
			type: 'Residential',
			comment: 'Interested in a 3kW system',
			urlparams: 'utm_source=google',
			email: null,
			district: 'Pune'
		});
	});

	it('resolves the district from the pincode mapping', async () => {
		await createPincodeMapping('422001', 'Nashik');

		await submit({ ...VALID, pinCode: '422001' });

		const { rows } = await pool.query<{ district: string }>('SELECT district FROM leaddata');
		expect(rows[0].district).toBe('Nashik');
	});

	it('still creates the lead with a null district when the pincode is unmapped', async () => {
		// Best-effort lookup: an unknown pincode must not cost the customer their
		// enquiry.
		const { body } = await submit({ ...VALID, pinCode: '999999' });

		expect(body.success).toBe(true);
		const { rows } = await pool.query<{ district: string | null }>('SELECT district FROM leaddata');
		expect(rows[0].district).toBeNull();
	});

	it('stores the email when given, and null when omitted', async () => {
		await createPincodeMapping('411001', 'Pune');

		await submit({ ...VALID, email: 'priya@example.test' });
		await submit(VALID);

		const { rows } = await pool.query<{ email: string | null }>(
			'SELECT email FROM leaddata ORDER BY id'
		);
		expect(rows.map((r) => r.email)).toEqual(['priya@example.test', null]);
	});

	it('applies the table defaults a fresh enquiry relies on', async () => {
		await createPincodeMapping('411001', 'Pune');

		await submit(VALID);

		// An unclaimed enquiry: visible, no category, stage 0, no owner.
		const { rows } = await pool.query(
			'SELECT isvisible, category, stage, status, claim_count, business_id, original_id FROM leaddata'
		);
		expect(rows[0]).toMatchObject({
			isvisible: true,
			category: null,
			stage: 0,
			status: true,
			claim_count: 0,
			business_id: null,
			original_id: null
		});
	});

	it('dispatches the confirmation through the request-scoped fetch', async () => {
		await createPincodeMapping('411001', 'Pune');

		const { fetchImpl, body } = await submit({ ...VALID, email: 'priya@example.test' });

		expect(fetchImpl.calls).toHaveLength(1);
		expect(fetchImpl.calls[0].url).toBe('/api/sendLeadSubmissionConfirmation');
		expect(fetchImpl.calls[0].body).toMatchObject({
			name: 'Priya Sharma',
			email: 'priya@example.test'
		});
		expect(body.success).toBe(true);
	});

	it('fails cleanly when a required field is missing', async () => {
		// name is NOT NULL — the insert must fail as a 500, not throw uncaught.
		const { status, body } = await submit({ ...VALID, name: undefined });

		expect(status).toBe(500);
		expect(body.success).toBe(false);
		expect(await pool.query('SELECT id FROM leaddata').then((r) => r.rows)).toHaveLength(0);
	});
});
