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

		return json({ success: true, lead: result.rows[0] });
	} catch (error) {
		console.error('Error updating lead data:', error);
		return json({ success: false, error: 'Failed to update lead' }, { status: 500 });
	}
}
