import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/in/auth/business/index.js';

export async function POST({ request, fetch, cookies }) {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Validate session and authorization
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
		}

		const { lead_id, business_id } = await request.json(); // Capture business_id

		if (!lead_id || !business_id) {
			return json(
				{ success: false, error: 'Lead ID and Business ID are required' },
				{ status: 400 }
			);
		}

		// Verify the logged-in business is claiming for themselves
		if (sessionResult.session.businessId !== business_id) {
			return json(
				{ success: false, error: 'Forbidden - You can only claim leads for your own business' },
				{ status: 403 }
			);
		}

		// Start a transaction
		const client = await pool.connect();
		let emailData = null; // Store email data to send after transaction

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

			let claim_id = claimCountResult.rows[0].claim_count;

			// **Check if lead can still be claimed (Max = 5 claims)**
			if (claim_id >= 5) {
				await client.query('ROLLBACK');
				return json(
					{ success: false, error: 'Maximum claim limit reached for this lead' },
					{ status: 400 }
				);
			}

			// **Check if this business already claimed this lead (duplicate prevention)**
			const duplicateCheck = await client.query(
				'SELECT id FROM leaddata_claimrequests WHERE lead_id = $1 AND business_id = $2',
				[lead_id, business_id]
			);

			if (duplicateCheck.rows.length > 0) {
				await client.query('ROLLBACK');
				return json(
					{ success: false, error: 'You have already claimed this lead' },
					{ status: 400 }
				);
			}

			// Insert into leaddata_claimrequests
			// Note: UNIQUE constraint on (lead_id, business_id) provides additional protection
			const insertResult = await client.query(
				'INSERT INTO leaddata_claimrequests (lead_id, claim_id, business_id) VALUES ($1, $2, $3) RETURNING id',
				[lead_id, claim_id, business_id]
			).catch(error => {
				// Handle unique constraint violation (PostgreSQL error code 23505)
				if (error.code === '23505') {
					throw new Error('You have already claimed this lead');
				}
				throw error;
			});

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

			// Prepare email data but don't send yet (move outside transaction)
			emailData = { business_id, isallotted: true };

			await client.query('COMMIT');
		} catch (error) {
			await client.query('ROLLBACK');
			console.error('Error claiming lead:', error);
			return json({ success: false, error: error.message }, { status: 500 });
		} finally {
			client.release();
		}

		// Send email AFTER transaction commits (outside transaction for better performance)
		if (emailData) {
			try {
				const response = await fetch('/in/api/sendLeadAllotmentStatus', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(emailData)
				});

				const emailResult = await response.json();

				if (!emailResult.success) {
					console.error('Failed to send lead allotment email:', emailResult.error);
				}
			} catch (emailError) {
				console.error('Error sending lead allotment email:', emailError);
				// Don't fail the whole request if email fails - claim was successful
			}
		}

		return json({ success: true });
	} catch (error) {
		console.error('Database connection error:', error);
		return json({ success: false, error: 'Failed to claim lead' }, { status: 500 });
	}
}
