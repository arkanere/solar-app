// src/routes/api/submitLead/+server.js
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request, fetch }) {
	// ✅ Use `fetch` from event
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const data = await request.json();
		const { name, phone, pinCode, type, comment, urlParam, email } = data;

		// Get county from pincode mapping
		let county = null;
		if (pinCode) {
			try {
				const countyQuery = `
					SELECT district FROM pincode_mapping
					WHERE pincode = $1
					LIMIT 1
				`;
				const countyResult = await pool.query(countyQuery, [pinCode]);
				if (countyResult.rows.length > 0) {
					county = countyResult.rows[0].district;
				}
			} catch (countyError) {
				console.log('County lookup failed for pincode:', pinCode, countyError);
				// Continue with null county if lookup fails
			}
		}

		const insertQuery = `
            INSERT INTO us_leaddata (name, phone, pin_code, type, comment, urlparams, email, county)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, reference_uuid
        `;

		const result = await pool.query(insertQuery, [
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
		const referenceUuid = result.rows[0].reference_uuid;

		// ✅ Use `fetch` from event
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
}
