// api/updateLeadByBusiness/server.ts
import { db } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/us/auth/business';
import { syncLeadToUnified } from '$lib/server/unifiedSync';
import type { RequestHandler } from './$types';
import type { LeadUpdatePayload } from '$lib/types/lead';
import { US_LEAD_RETURNING } from '$lib/server/leads';
import { usLeaddata } from '@solar/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Updates lead fields (stage, status) for a business's lead in US region
 * - Validates business ownership of the lead
 * - Only updates stage and status (simpler than IN version)
 */
export const POST: RequestHandler = async ({ request, cookies }) => {

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
		const verifyResult = await db
			.select({ businessId: usLeaddata.businessId })
			.from(usLeaddata)
			.where(eq(usLeaddata.id, id));

		if (verifyResult.length === 0) {
			return json(
				{ success: false, error: 'Lead not found' },
				{ status: 404 }
			);
		}

		// Check if the lead belongs to this business
		const leadBusinessId = verifyResult[0].businessId;
		if (leadBusinessId && leadBusinessId !== sessionResult.session.businessId) {
			return json(
				{ success: false, error: 'Forbidden - You can only update your own leads' },
				{ status: 403 }
			);
		}

		// ✅ Update only `stage` and `status`
		const result = await db
			.update(usLeaddata)
			.set({ stage, status })
			.where(eq(usLeaddata.id, id))
			.returning(US_LEAD_RETURNING);

		if (result.length === 0) {
			return json(
				{ success: false, error: 'Lead not found' },
				{ status: 404 }
			);
		}

		await syncLeadToUnified(db, 'us', id);

		return json({ success: true, lead: result[0] });
	} catch (error) {
		console.error('❌ Error updating lead data:', error);
		return json(
			{ success: false, error: 'Failed to update lead' },
			{ status: 500 }
		);
	}
};
