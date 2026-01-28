import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/in/auth/business';
import type { RequestHandler } from './$types';

interface DeleteReferrerRequest {
	referrerId: number;
	businessId: number;
}

interface ReferrerResult {
	id: number;
	name: string;
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Validate session and authorization
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
		}

		const data = (await request.json()) as DeleteReferrerRequest;
		const { referrerId, businessId } = data;

		// Verify the logged-in business is deleting their own referrer
		if (sessionResult.session.businessId !== businessId) {
			return json(
				{ success: false, error: 'Forbidden - You can only delete your own referrers' },
				{ status: 403 }
			);
		}

		// Validate required fields
		if (!referrerId || !businessId) {
			return json(
				{ success: false, error: 'Referrer ID and Business ID are required' },
				{ status: 400 }
			);
		}

		// Check if referrer exists and belongs to this business
		const checkQuery = `
			SELECT id, name FROM in_referrers
			WHERE id = $1 AND business_id = $2
		`;
		const checkResult = await pool.query<ReferrerResult>(checkQuery, [referrerId, businessId]);

		if (checkResult.rows.length === 0) {
			return json(
				{ success: false, error: 'Referrer not found or does not belong to your business' },
				{ status: 404 }
			);
		}

		// Delete the referrer
		const deleteQuery = `
			DELETE FROM in_referrers
			WHERE id = $1 AND business_id = $2
			RETURNING id, name
		`;
		const deleteResult = await pool.query<ReferrerResult>(deleteQuery, [referrerId, businessId]);

		const deletedReferrer = deleteResult.rows[0];

		return json({
			success: true,
			message: 'Referrer deleted successfully',
			referrer: deletedReferrer
		});
	} catch (error) {
		console.error('Error deleting referrer:', error);

		// Handle specific database errors
		if (error instanceof Error && error.message.includes('relation "in_referrers" does not exist')) {
			return json(
				{ success: false, error: 'Referrers table not found. Please contact administrator.' },
				{ status: 500 }
			);
		}

		return json({ success: false, error: 'Failed to delete referrer' }, { status: 500 });
	} finally {
		await pool.end();
	}
};
