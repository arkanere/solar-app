// src/routes/api/us/submitLead/+server.js
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request, fetch }) {
	// ✅ Use `fetch` from event
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const data = await request.json();
		const { name, phone, zipCode, type, comment, urlParam, email, marketing_consent } = data;

		const insertQuery = `
            INSERT INTO us_leaddata (name, phone, zipcode, type, comment, urlparams, email, marketing_consent)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `;

		const result = await pool.query(insertQuery, [
			name,
			phone,
			zipCode,
			type,
			comment,
			urlParam,
			email || null,
			marketing_consent === true
		]);

		const leadId = result.rows[0].id;

		// ✅ Use `fetch` from event
		await fetch('/us/api/sendLeadSubmissionConfirmation', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: leadId,
				name,
				phone,
				zipCode,
				type,
				comment,
				urlParam,
				email
			})
		});

		return json({ success: true, id: leadId });
	} catch (error) {
		console.error('Error inserting lead data:', error);
		return json({ success: false, error: 'Failed to submit lead' }, { status: 500 });
	}
}
