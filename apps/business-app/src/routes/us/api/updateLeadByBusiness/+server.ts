// api/updateLeadByBusiness/server.ts
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/us/auth/business';
import type { RequestHandler } from './$types';
import type { LeadUpdatePayload, LeadData } from '$lib/types/lead';

/**
 * Updates lead fields (stage, status) for a business's lead in US region
 * - Validates business ownership of the lead
 * - Only updates stage and status (simpler than IN version)
 */
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

		const { id, stage, status } = (await request.json()) as LeadUpdatePayload;

		if (!id) {
			return json(
				{ success: false, error: 'Lead ID is required' },
				{ status: 400 }
			);
		}

		// First, verify the lead belongs to the logged-in business
		const verifyQuery = `
            SELECT business_id FROM us_leaddata WHERE id = $1
        `;
		const verifyResult = await pool.query<{ business_id: number | null }>(verifyQuery, [id]);

		if (verifyResult.rows.length === 0) {
			return json(
				{ success: false, error: 'Lead not found' },
				{ status: 404 }
			);
		}

		// Check if the lead belongs to this business
		const leadBusinessId = verifyResult.rows[0].business_id;
		if (leadBusinessId && leadBusinessId !== sessionResult.session.businessId) {
			return json(
				{ success: false, error: 'Forbidden - You can only update your own leads' },
				{ status: 403 }
			);
		}

		// ✅ Update only `stage` and `status`
		const updateQuery = `
            UPDATE us_leaddata
            SET stage = $1, status = $2
            WHERE id = $3
            RETURNING *;
        `;

		const result = await pool.query<LeadData>(updateQuery, [stage, status, id]);

		if (result.rows.length === 0) {
			return json(
				{ success: false, error: 'Lead not found' },
				{ status: 404 }
			);
		}

		return json({ success: true, lead: result.rows[0] });
	} catch (error) {
		console.error('❌ Error updating lead data:', error);
		return json(
			{ success: false, error: 'Failed to update lead' },
			{ status: 500 }
		);
	}
};
