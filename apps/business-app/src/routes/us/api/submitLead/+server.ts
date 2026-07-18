// src/routes/api/submitLead/+server.ts
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { syncLeadToUnified } from '$lib/server/unifiedSync';
import type { RequestHandler } from './$types';

interface SubmitLeadRequest {
	name: string;
	phone: string;
	pinCode: string;
	type: string;
	comment: string;
	urlParam: string;
	email?: string;
}

interface LeadInsertResult {
	id: number;
	reference_uuid: string;
}

interface CountyResult {
	district: string;
}

export const POST: RequestHandler = async ({ request, fetch }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const data = (await request.json()) as SubmitLeadRequest;
		const { name, phone, pinCode, type, comment, urlParam, email } = data;

		// Get county from pincode mapping
		let county: string | null = null;
		if (pinCode) {
			try {
				const countyQuery = `
					SELECT district FROM pincode_mapping
					WHERE pincode = $1
					LIMIT 1
				`;
				const countyResult = await pool.query<CountyResult>(countyQuery, [pinCode]);
				if (countyResult.rows.length > 0) {
					county = countyResult.rows[0].district;
				}
			} catch (countyError) {
				console.log('County lookup failed for pincode:', pinCode, countyError);
				// Continue with null county if lookup fails
			}
		}

		const insertQuery = `
            INSERT INTO us_leaddata (name, phone, zipcode, type, comment, urlparams, email, county)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `;

		const result = await pool.query<LeadInsertResult>(insertQuery, [
			name,
			phone,
			pinCode,
			type,
			comment,
			urlParam,
			email || null,
			county
		]);

		const leadId = result.rows[0].id;
		// us_leaddata has no reference_uuid column (the old RETURNING made this
		// endpoint fail outright); the unified leads table owns that concept.
		const referenceUuid = null;

		await syncLeadToUnified(pool, 'us', leadId);

		// Use `fetch` from event
		await fetch('/us/api/sendLeadSubmissionConfirmation', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: leadId,
				name,
				phone,
				pinCode,
				type,
				comment,
				urlParam,
				email
			})
		});

		return json({ success: true, reference_uuid: referenceUuid });
	} catch (error) {
		console.error('Error inserting lead data:', error);
		return json({ success: false, error: 'Failed to submit lead' }, { status: 500 });
	}
};
