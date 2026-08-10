// api/updateLeadByBusiness/server.ts
import { db } from '$lib/server/db';
import { countryForSlug } from '$lib/server/resolveCountry';
import { json } from '@sveltejs/kit';
import { SessionManager } from '$lib/auth/business';
import type { RequestHandler } from './$types';
import type { LeadUpdatePayload } from '$lib/types/lead';
import { IN_LEAD_RETURNING } from '$lib/server/leads';
import { branches, leaddata, projectManagement } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';

/**
 * Updates lead fields (stage, status, business_notes) for a business's lead
 * - Validates business ownership of the lead
 * - Supports dynamic partial updates
 * - Auto-creates project when stage moves to Won (3)
 */
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

		const { id, stage, status, business_notes } = (await request.json()) as LeadUpdatePayload;

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
				{ success: false, error: 'Forbidden - You can only update your own leads' },
				{ status: 403 }
			);
		}

		// ✅ Build dynamic update set based on provided fields — conditional
		// spreads reproduce the old dynamically-built SET list.
		const updates = {
			...(stage !== undefined && { stage }),
			...(status !== undefined && { status }),
			...(business_notes !== undefined && { businessNotes: business_notes })
		};

		if (Object.keys(updates).length === 0) {
			return json(
				{ success: false, error: 'No fields to update' },
				{ status: 400 }
			);
		}

		const result = await db
			.update(leaddata)
			.set(updates)
			.where(eq(leaddata.id, id))
			.returning(IN_LEAD_RETURNING);

		if (result.length === 0) {
			return json(
				{ success: false, error: 'Lead not found' },
				{ status: 404 }
			);
		}

		const updatedLead = result[0];

		// ✅ If lead is marked as "Won" (stage 3), automatically create a project in project management
		if (stage === 3) {
			try {
				// Check if project already exists for this lead
				const existingProject = await db
					.select({ id: projectManagement.id })
					.from(projectManagement)
					.where(eq(projectManagement.leadId, id));

				if (existingProject.length === 0) {
					// Create project in project management system
					const projectResult = await db
						.insert(projectManagement)
						.values({ leadId: id, stage: 3 }) // stage 3 = Won
						.returning({ id: projectManagement.id });
					console.log(
						`Project created automatically for lead ${id}, project ID: ${projectResult[0].id}`
					);
				}
			} catch (projectError) {
				console.error('❌ Error creating project automatically:', projectError);
				// Don't fail the lead update if project creation fails
			}
		}

		return json({ success: true, lead: updatedLead });
	} catch (error) {
		console.error('❌ Error updating lead data:', error);
		return json(
			{ success: false, error: 'Failed to update lead' },
			{ status: 500 }
		);
	}
};
