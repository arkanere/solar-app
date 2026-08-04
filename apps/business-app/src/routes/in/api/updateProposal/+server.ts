import { db } from '$lib/server/db';
import { PROPOSAL_RETURNING } from '$lib/server/proposals';
import { inProposals } from '@solar/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/in/auth/business';
import { ownsBusinessSlug } from '$lib/in/ownsBusinessSlug';
import type { RequestHandler } from './$types';
import type { ProposalPayload } from '$lib/types/lead';

export const POST: RequestHandler = async ({ request, cookies }) => {

	try {
		// Validate session before any proposal mutation
		const authService = new BusinessAuthService();
		const sessionResult = authService.validateSession(cookies);

		if (!sessionResult.success) {
			return json({ success: false, error: 'Unauthorized - Please login' }, { status: 401 });
		}

		const proposalData = (await request.json()) as ProposalPayload;
		const {
			id,
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
		} = proposalData;

		if (!id) {
			return json(
				{ success: false, error: 'Proposal ID is required' },
				{ status: 400 }
			);
		}

		if (!customer_name || !system_capacity_kw) {
			return json(
				{ success: false, error: 'Customer name and system capacity are required' },
				{ status: 400 }
			);
		}

		if (!business_slug) {
			return json(
				{ success: false, error: 'Business slug is required' },
				{ status: 400 }
			);
		}

		// Derive authorization from the session: the target business_slug must be
		// the logged-in business or one of its active branches. Combined with the
		// `business_slug = $11` predicate below, this prevents editing another
		// business's proposal even if its id is known.
		if (!(await ownsBusinessSlug(sessionResult.session.businessSlug, business_slug))) {
			return json(
				{ success: false, error: 'Forbidden - You can only manage proposals for your own business' },
				{ status: 403 }
			);
		}

		// `business_slug` in the predicate is what stops another business's proposal
		// being edited by id; the ownership check above is the other half.
		const [proposal] = await db
			.update(inProposals)
			.set({
				customerName: customer_name,
				phoneNumber: phone_number ?? null,
				address: address ?? null,
				email: email ?? null,
				systemCapacityKw: parseFloat(system_capacity_kw.toString()).toString(),
				panelsBrandModel: panels_brand_model ?? null,
				numberOfPanels: number_of_panels ? parseInt(number_of_panels.toString()) : null,
				inverterBrandModel: inverter_brand_model ?? null,
				notes: notes ?? null,
				updatedAt: sql`NOW()`
			})
			.where(and(eq(inProposals.id, id), eq(inProposals.businessSlug, business_slug)))
			.returning(PROPOSAL_RETURNING);

		if (!proposal) {
			return json(
				{ success: false, error: 'Proposal not found' },
				{ status: 404 }
			);
		}

		return json({ success: true, proposal });
	} catch (error) {
		console.error('❌ Error updating proposal:', error);
		return json(
			{ success: false, error: 'Failed to update proposal' },
			{ status: 500 }
		);
	}
};
