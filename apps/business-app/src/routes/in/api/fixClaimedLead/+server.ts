import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/in/auth/business';
import { syncLeadToUnified } from '$lib/server/unifiedSync';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Validate session
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json({ success: false, error: 'Unauthorized' }, { status: 401 });
		}

		const { lead_id, business_id } = await request.json();

		// Verify the business owns this claim
		if (sessionResult.session.businessId !== business_id) {
			return json({ success: false, error: 'Forbidden' }, { status: 403 });
		}

		// Update the allocated lead to make it visible and active
		const result = await pool.query(
			`UPDATE leaddata
			SET isvisible = true, status = true
			WHERE original_id = $1
			AND business_id = $2
			AND category = 2
			RETURNING id`,
			[lead_id, business_id]
		);

		if (result.rows.length === 0) {
			return json({ success: false, error: 'No allocated lead found to fix' }, { status: 404 });
		}

		for (const row of result.rows) {
			await syncLeadToUnified(pool, 'in', row.id);
		}

		return json({
			success: true,
			message: 'Lead fixed! Refresh the page to see it.',
			leadId: result.rows[0].id
		});
	} catch (error) {
		console.error('Fix lead error:', error);
		return json({ success: false, error: String(error) }, { status: 500 });
	}
};
