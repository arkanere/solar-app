import { db } from '$lib/server/db';
import { svReferrers } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import { SessionManager } from '$lib/auth/business';
import type { RequestHandler } from './$types';

interface DeleteReferrerRequest {
	referrerId: number;
	businessId: number;
}

export const POST: RequestHandler = async ({ request, cookies }) => {

	try {
		// Validate session and authorization
		const sessionResult = SessionManager.validateSession(cookies);

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
		const existing = await db
			.select({ id: svReferrers.id, name: svReferrers.name })
			.from(svReferrers)
			.where(and(eq(svReferrers.id, referrerId), eq(svReferrers.businessId, businessId)));

		if (existing.length === 0) {
			return json(
				{ success: false, error: 'Referrer not found or does not belong to your business' },
				{ status: 404 }
			);
		}

		// Delete the referrer
		const [deletedReferrer] = await db
			.delete(svReferrers)
			.where(and(eq(svReferrers.id, referrerId), eq(svReferrers.businessId, businessId)))
			.returning({ id: svReferrers.id, name: svReferrers.name });

		return json({
			success: true,
			message: 'Referrer deleted successfully',
			referrer: deletedReferrer
		});
	} catch (error) {
		console.error('Error deleting referrer:', error);

		// Handle specific database errors
		if (error instanceof Error && error.message.includes('relation "sv_referrers" does not exist')) {
			return json(
				{ success: false, error: 'Referrers table not found. Please contact administrator.' },
				{ status: 500 }
			);
		}

		return json({ success: false, error: 'Failed to delete referrer' }, { status: 500 });
	}
};
