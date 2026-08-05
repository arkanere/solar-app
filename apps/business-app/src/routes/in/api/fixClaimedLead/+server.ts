import { db } from '$lib/server/db';
import { countryForSlug } from '$lib/server/resolveCountry';
import { json, type RequestHandler } from '@sveltejs/kit';
import { SessionManager } from '$lib/auth/business';
import { syncLeadToUnified } from '$lib/server/unifiedSync';
import { leaddata } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, cookies }) => {

	try {
		// Validate session
		const sessionResult = SessionManager.validateSession(cookies);

		if (!sessionResult.success) {
			return json({ success: false, error: 'Unauthorized' }, { status: 401 });
		}

		// URLs no longer carry the country, so it comes from the acting
		// business. Writes below target that country's legacy tables.
		const country = await countryForSlug(sessionResult.session.businessSlug);
		if (!country) {
			return json({ success: false, error: 'Business not found' }, { status: 404 });
		}

		const { lead_id, business_id } = await request.json();

		// Verify the business owns this claim
		if (sessionResult.session.businessId !== business_id) {
			return json({ success: false, error: 'Forbidden' }, { status: 403 });
		}

		// Update the allocated lead to make it visible and active
		const result = await db
			.update(leaddata)
			.set({ isvisible: true, status: true })
			.where(
				and(
					eq(leaddata.originalId, lead_id),
					eq(leaddata.businessId, business_id),
					eq(leaddata.category, 2)
				)
			)
			.returning({ id: leaddata.id });

		if (result.length === 0) {
			return json({ success: false, error: 'No allocated lead found to fix' }, { status: 404 });
		}

		for (const row of result) {
			await syncLeadToUnified(db, country, row.id);
		}

		return json({
			success: true,
			message: 'Lead fixed! Refresh the page to see it.',
			leadId: result[0].id
		});
	} catch (error) {
		console.error('Fix lead error:', error);
		return json({ success: false, error: String(error) }, { status: 500 });
	}
};
