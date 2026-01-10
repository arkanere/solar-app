import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request, fetch }) {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const { lead_id, business_id } = await request.json(); // Capture business_id

		if (!lead_id || !business_id) {
			return json(
				{ success: false, error: 'Lead ID and Business ID are required' },
				{ status: 400 }
			);
		}

		// Start a transaction
		const client = await pool.connect();
		try {
			await client.query('BEGIN');

			// Lock the row to prevent race conditions & fetch claim count
			const claimCountResult = await client.query(
				'SELECT claim_count FROM leaddata WHERE id = $1 FOR UPDATE',
				[lead_id]
			);

			if (claimCountResult.rows.length === 0) {
				throw new Error('Lead not found');
			}

			const claim_id = claimCountResult.rows[0].claim_count;

			// **Check if lead can still be claimed (Max = 5 claims)**
			if (claim_id >= 5) {
				await client.query('ROLLBACK');
				return json(
					{ success: false, error: 'Maximum claim limit reached for this lead' },
					{ status: 400 }
				);
			}

			// Insert into leaddata_claimrequests
			const insertResult = await client.query(
				'INSERT INTO leaddata_claimrequests (lead_id, claim_id, business_id) VALUES ($1, $2, $3) RETURNING id',
				[lead_id, claim_id, business_id]
			);

			const claimRequestId = insertResult.rows[0].id;

			// Increment claim_count in leaddata
			await client.query('UPDATE leaddata SET claim_count = claim_count + 1 WHERE id = $1', [
				lead_id
			]);

			// Auto-allocate ALL successful claims (within 5-claim limit)
			let isAutoAllocated = false;
			// Since we passed the claim limit check, auto-allocate this claim

			// Set this claim as allotted
			await client.query(
				'UPDATE leaddata_claimrequests SET isallotted = true, isresolved = true WHERE id = $1',
				[claimRequestId]
			);

			// Fetch original lead data to create allocated lead
			const leadDataResult = await client.query('SELECT * FROM leaddata WHERE id = $1', [lead_id]);

			if (leadDataResult.rows.length > 0) {
				const originalLead = leadDataResult.rows[0];

				// Create new lead entry for the allocated business
				await client.query(
					`INSERT INTO leaddata 
                      (name, phone, email, pin_code, type, comment, created_at, svnotes, sv_comment_for_businesses, urlparams, isvisible, category, district, stage, status, claim_count, original_id, business_id)
                     VALUES 
                      ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, $9, true, 2, $10, 0, true, 0, $11, $12)`,
					[
						originalLead.name,
						originalLead.phone,
						originalLead.email,
						originalLead.pin_code,
						originalLead.type,
						originalLead.comment,
						originalLead.svnotes,
						originalLead.sv_comment_for_businesses,
						originalLead.urlparams,
						originalLead.district,
						originalLead.id, // Set original_id to the original lead's ID
						business_id // Set business_id from claim request
					]
				);

				isAutoAllocated = true;
			}

			await client.query('COMMIT');

			// Send lead allotment email (since all successful claims are auto-allocated)
			try {
				const response = await fetch('/api/sendLeadAllotmentStatus', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ business_id, isallotted: true })
				});

				const emailResult = await response.json();

				if (!emailResult.success) {
					console.error('Failed to send lead allotment email:', emailResult.error);
				}
			} catch (emailError) {
				console.error('Error sending lead allotment email:', emailError);
				// Continue despite email error - the claim itself was successful
			}

			return json({ success: true });
		} catch (error) {
			await client.query('ROLLBACK');
			console.error('Error claiming lead:', error);
			return json({ success: false, error: error.message }, { status: 500 });
		} finally {
			client.release();
		}
	} catch (error) {
		console.error('Database connection error:', error);
		return json({ success: false, error: 'Failed to claim lead' }, { status: 500 });
	}
}
