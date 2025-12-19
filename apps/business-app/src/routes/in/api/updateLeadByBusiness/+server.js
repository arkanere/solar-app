// api/updateLeadByBusiness/server.js
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/in/auth/business/index.js';

export async function POST({ request, cookies }) {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Validate session and authorization
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
		}

		const { id, stage, status, business_notes } = await request.json();

		if (!id) {
			return json({ success: false, error: 'Lead ID is required' }, { status: 400 });
		}

		// First, verify the lead belongs to the logged-in business
		const verifyQuery = `
            SELECT business_id FROM leaddata WHERE id = $1
        `;
		const verifyResult = await pool.query(verifyQuery, [id]);

		if (verifyResult.rows.length === 0) {
			return json({ success: false, error: 'Lead not found' }, { status: 404 });
		}

		// Check if the lead belongs to this business
		const leadBusinessId = verifyResult.rows[0].business_id;
		if (leadBusinessId && leadBusinessId !== sessionResult.session.businessId) {
			return json(
				{ success: false, error: 'Forbidden - You can only update your own leads' },
				{ status: 403 }
			);
		}

		// ✅ Build dynamic update query based on provided fields
		const updates = [];
		const values = [];
		let paramIndex = 1;

		if (stage !== undefined) {
			updates.push(`stage = $${paramIndex++}`);
			values.push(stage);
		}
		if (status !== undefined) {
			updates.push(`status = $${paramIndex++}`);
			values.push(status);
		}
		if (business_notes !== undefined) {
			updates.push(`business_notes = $${paramIndex++}`);
			values.push(business_notes);
		}

		if (updates.length === 0) {
			return json({ success: false, error: 'No fields to update' }, { status: 400 });
		}

		values.push(id); // Add id as the last parameter
		const updateQuery = `
            UPDATE leaddata
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *;
        `;

		const result = await pool.query(updateQuery, values);

		if (result.rows.length === 0) {
			return json({ success: false, error: 'Lead not found' }, { status: 404 });
		}

		const updatedLead = result.rows[0];

		// ✅ If lead is marked as "Won" (stage 3), automatically create a proposal
		if (stage === 3) {
			try {
				// Check if proposal already exists for this lead
				const existingProposal = await pool.query(
					'SELECT id FROM proposals WHERE lead_id = $1',
					[id]
				);

				if (existingProposal.rows.length === 0) {
					// Create proposal with available lead data
					const proposalQuery = `
						INSERT INTO proposals (
							lead_id,
							customer_name,
							phone_number,
							address,
							email,
							system_capacity_kw,
							notes,
							created_at,
							updated_at
						) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
						RETURNING id
					`;

					const proposalValues = [
						id, // lead_id
						updatedLead.name || 'Customer',
						updatedLead.phone || null,
						updatedLead.address || null,
						updatedLead.email || null,
						0, // default system capacity
						null // notes
					];

					const proposalResult = await pool.query(proposalQuery, proposalValues);
					console.log(`Proposal created automatically for lead ${id}, proposal ID: ${proposalResult.rows[0].id}`);
				}
			} catch (proposalError) {
				console.error('Error creating proposal automatically:', proposalError);
				// Don't fail the lead update if proposal creation fails
			}
		}

		return json({ success: true, lead: updatedLead });
	} catch (error) {
		console.error('Error updating lead data:', error);
		return json({ success: false, error: 'Failed to update lead' }, { status: 500 });
	}
}
