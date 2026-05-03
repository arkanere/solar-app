import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/in/auth/business';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Validate session and authorization
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json(
				{ success: false, error: 'Unauthorized - Please login' },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const { id } = body as { id?: number };

		if (!id) {
			return json(
				{ success: false, error: 'Lead ID is required' },
				{ status: 400 }
			);
		}

		// Get all business IDs this session can manage (main + branches)
		const mainBusinessId = sessionResult.session.businessId;
		const branchResult = await pool.query<{ branch_id: number }>(
			'SELECT branch_id FROM branches WHERE main_id = $1 AND isactive = true',
			[mainBusinessId]
		);
		const allowedBusinessIds = [mainBusinessId, ...branchResult.rows.map(r => r.branch_id)];

		// Verify the lead exists and belongs to main business or its branches
		const verifyQuery = `SELECT business_id FROM leaddata WHERE id = $1`;
		const verifyResult = await pool.query<{ business_id: number | null }>(verifyQuery, [id]);

		if (verifyResult.rows.length === 0) {
			return json(
				{ success: false, error: 'Lead not found' },
				{ status: 404 }
			);
		}

		const leadBusinessId = verifyResult.rows[0].business_id;
		if (leadBusinessId && !allowedBusinessIds.includes(leadBusinessId)) {
			return json(
				{ success: false, error: 'Forbidden - You can only delete your own leads' },
				{ status: 403 }
			);
		}

		// ✅ Update `isvisible` to FALSE instead of deleting the record
		const updateQuery = `
            UPDATE leaddata
            SET isvisible = FALSE
            WHERE id = $1
            RETURNING *;
        `;

		const result = await pool.query(updateQuery, [id]);

		if (result.rows.length === 0) {
			return json(
				{ success: false, error: 'Lead not found' },
				{ status: 404 }
			);
		}

		return json({ success: true, lead: result.rows[0] });
	} catch (error) {
		console.error('❌ Error deleting lead data:', error);
		return json(
			{ success: false, error: 'Failed to delete lead' },
			{ status: 500 }
		);
	}
};
