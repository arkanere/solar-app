import { createPool } from '@vercel/postgres';
import type { VercelPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { LeadData } from '$lib/types/api';

export const POST: RequestHandler = async ({ request, fetch }) => {
	const pool: VercelPool = createPool({ connectionString: POSTGRES_URL });

	try {
		const data: LeadData = await request.json();
		const { name, phone, pinCode, type, comment, urlParam, email } = data;

		// Get district from pincode mapping
		let district = null;
		if (pinCode) {
			try {
				const districtQuery = `
					SELECT district FROM pincode_mapping
					WHERE pincode = $1
					LIMIT 1
				`;
				const districtResult = await pool.query<{ district: string }>(districtQuery, [pinCode]);
				if (districtResult.rows.length > 0) {
					district = districtResult.rows[0].district;
				}
			} catch (districtError) {
				console.log('District lookup failed for pincode:', pinCode, districtError);
				// Continue with null district if lookup fails
			}
		}

		const insertQuery = `
            INSERT INTO LeadData (name, phone, pin_code, type, comment, urlparams, email, district)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, reference_uuid
        `;

		const result = await pool.query<{ id: number; reference_uuid: string }>(insertQuery, [
			name,
			phone,
			pinCode,
			type,
			comment,
			urlParam,
			email || null,
			district
		]);

		const leadId = result.rows[0].id;
		const referenceUuid = result.rows[0].reference_uuid;

		// ✅ Use `fetch` from event
		await fetch('/api/sendLeadSubmissionConfirmation', {
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
