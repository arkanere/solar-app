import { db } from '$lib/server/db';
import { PROPOSAL_RETURNING } from '$lib/server/proposals';
import { inProposals } from '@solar/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import { parseBody, saveProposalSchema } from '@solar/validation';
import { BusinessAuthService } from '$lib/in/auth/business';
import { ownsBusinessSlug } from '$lib/in/ownsBusinessSlug';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {

	try {
		// Validate session before any proposal mutation
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
		}

		const parsed = await parseBody(request, saveProposalSchema);
		if (!parsed.ok) {
			return json({ success: false, error: parsed.error, fields: parsed.fields }, { status: 400 });
		}
		const {
			id,
			lead_id,
			business_slug,
			customer_name,
			phone_number,
			address,
			email,
			system_capacity_kw,
			panels_brand_model,
			number_of_panels,
			inverter_brand_model,
			notes
		} = parsed.data;

		// Derive authorization from the session: the target business_slug must be
		// the logged-in business or one of its active branches.
		if (!(await ownsBusinessSlug(sessionResult.session.businessSlug, business_slug))) {
			return json(
				{
					success: false,
					error: 'Forbidden - You can only manage proposals for your own business'
				},
				{ status: 403 }
			);
		}

		let proposal;

		// Update existing proposal
		if (id) {
			[proposal] = await db
				.update(inProposals)
				.set({
					customerName: customer_name,
					phoneNumber: phone_number,
					address,
					email,
					systemCapacityKw: String(system_capacity_kw),
					panelsBrandModel: panels_brand_model,
					numberOfPanels: number_of_panels,
					inverterBrandModel: inverter_brand_model,
					notes,
					updatedAt: sql`NOW()`
				})
				.where(and(eq(inProposals.id, id), eq(inProposals.businessSlug, business_slug)))
				.returning(PROPOSAL_RETURNING);

			if (!proposal) {
				return json({ success: false, error: 'Proposal not found' }, { status: 404 });
			}
		}
		// Create new proposal
		else {
			[proposal] = await db
				.insert(inProposals)
				.values({
					businessSlug: business_slug,
					leadId: lead_id,
					customerName: customer_name,
					phoneNumber: phone_number,
					address,
					email,
					systemCapacityKw: String(system_capacity_kw),
					panelsBrandModel: panels_brand_model,
					numberOfPanels: number_of_panels,
					inverterBrandModel: inverter_brand_model,
					notes,
					createdAt: sql`NOW()`,
					updatedAt: sql`NOW()`
				})
				.returning(PROPOSAL_RETURNING);
		}

		return json({ success: true, proposal });
	} catch (error) {
		console.error('❌ Error saving proposal:', error);
		return json({ success: false, error: 'Failed to save proposal' }, { status: 500 });
	}
};
