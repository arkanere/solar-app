//src/routes/api/updateLeadClaim/+server.js

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

export async function POST({ request, fetch }) {
	// ✅ Use `fetch` from event
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const { id, lead_id, business_id, isallotted, isresolved } = await request.json();

		// Step 1: Update leaddata_claimrequests
		await pool.query(
			'UPDATE leaddata_claimrequests SET isallotted = $1, isresolved = $2 WHERE id = $3',
			[isallotted, isresolved, id]
		);

		let newLeadId = null;

		// Step 2: If lead is allotted, create a new lead entry
		if (isallotted) {
			// Fetch original lead data
			const leadDataResult = await pool.query('SELECT * FROM leaddata WHERE id = $1', [lead_id]);

			if (leadDataResult.rows.length > 0) {
				const originalLead = leadDataResult.rows[0];

				// Insert new lead entry with business_id, category = 2, stage = 0, status = true
				const newLeadResult = await pool.query(
					`INSERT INTO leaddata 
            (name, phone, email, pin_code, type, comment, created_at, svnotes, urlparams, isvisible, category, district, stage, status, claim_count, original_id, business_id)
           VALUES 
            ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, true, 2, $9, 0, true, 0, $10, $11)  
           RETURNING id`, // ✅ Get the newly inserted lead's ID
					[
						originalLead.name,
						originalLead.phone,
						originalLead.email,
						originalLead.pin_code,
						originalLead.type,
						originalLead.comment,
						originalLead.svnotes,
						originalLead.urlparams,
						originalLead.district,
						originalLead.id, // Set original_id to the original lead's ID
						business_id // Set business_id from claim request
					]
				);

				newLeadId = newLeadResult.rows[0].id;
			}
		}

		// ✅ Call /api/sendLeadAllotmentStatus to notify the business
		await fetch('/api/sendLeadAllotmentStatus', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				business_id,
				isallotted
			})
		});

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		console.error('Error updating lead claim:', error);
		return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
	}
}
