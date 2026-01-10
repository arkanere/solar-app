import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/in/auth/business/index.ts';
import type { LeadApiResponse } from '$lib/types/lead';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Validate session and authorization
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json<LeadApiResponse>(
				{ success: false, error: 'Unauthorized - Please login' },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const { id } = body as { id?: number };

		if (!id) {
			return json<LeadApiResponse>(
				{ success: false, error: 'Lead ID is required' },
				{ status: 400 }
			);
		}

		// First, verify the lead belongs to the logged-in business
		const verifyQuery = `
            SELECT business_id FROM leaddata WHERE id = $1
        `;
		const verifyResult = await pool.query<{ business_id: number | null }>(verifyQuery, [id]);

		if (verifyResult.rows.length === 0) {
			return json<LeadApiResponse>(
				{ success: false, error: 'Lead not found' },
				{ status: 404 }
			);
		}

		// Check if the lead belongs to this business
		const leadBusinessId = verifyResult.rows[0].business_id;
		if (leadBusinessId && leadBusinessId !== sessionResult.session.businessId) {
			return json<LeadApiResponse>(
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
			return json<LeadApiResponse>(
				{ success: false, error: 'Lead not found' },
				{ status: 404 }
			);
		}

		return json<LeadApiResponse>({ success: true, lead: result.rows[0] });
	} catch (error) {
		console.error('❌ Error deleting lead data:', error);
		return json<LeadApiResponse>(
			{ success: false, error: 'Failed to delete lead' },
			{ status: 500 }
		);
	}
};
