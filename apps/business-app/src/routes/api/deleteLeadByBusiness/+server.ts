import { db } from '$lib/server/db';
import { countryForSlug } from '$lib/server/resolveCountry';
import { json, type RequestHandler } from '@sveltejs/kit';
import { SessionManager } from '$lib/auth/business';
import { IN_LEAD_RETURNING } from '$lib/server/leads';
import { branches, leaddata } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, cookies }) => {

	try {
		// Validate session and authorization
		const sessionResult = SessionManager.validateSession(cookies);

		if (!sessionResult.success) {
			return json(
				{ success: false, error: 'Unauthorized - Please login' },
				{ status: 401 }
			);
		}

		// URLs no longer carry the country. Nothing below needs it now that the
		// write projects nowhere (067), but the lookup stays as the guard it also
		// was: a session whose slug resolves to no business is a 404.
		if (!(await countryForSlug(sessionResult.session.businessSlug))) {
			return json({ success: false, error: 'Business not found' }, { status: 404 });
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
		const branchResult = await db
			.select({ branchId: branches.branchId })
			.from(branches)
			.where(and(eq(branches.mainId, mainBusinessId), eq(branches.isactive, true)));
		const allowedBusinessIds = [mainBusinessId, ...branchResult.map((r) => r.branchId)];

		// Verify the lead exists and belongs to main business or its branches
		const verifyResult = await db
			.select({ businessId: leaddata.businessId })
			.from(leaddata)
			.where(eq(leaddata.id, id));

		if (verifyResult.length === 0) {
			return json(
				{ success: false, error: 'Lead not found' },
				{ status: 404 }
			);
		}

		const leadBusinessId = verifyResult[0].businessId;
		if (leadBusinessId && !allowedBusinessIds.includes(leadBusinessId)) {
			return json(
				{ success: false, error: 'Forbidden - You can only delete your own leads' },
				{ status: 403 }
			);
		}

		// ✅ Update `isvisible` to FALSE instead of deleting the record
		const result = await db
			.update(leaddata)
			.set({ isvisible: false })
			.where(eq(leaddata.id, id))
			.returning(IN_LEAD_RETURNING);

		if (result.length === 0) {
			return json(
				{ success: false, error: 'Lead not found' },
				{ status: 404 }
			);
		}


		return json({ success: true, lead: result[0] });
	} catch (error) {
		console.error('❌ Error deleting lead data:', error);
		return json(
			{ success: false, error: 'Failed to delete lead' },
			{ status: 500 }
		);
	}
};
