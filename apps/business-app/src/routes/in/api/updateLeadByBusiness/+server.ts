// api/updateLeadByBusiness/server.ts
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/in/auth/business';
import type { RequestHandler } from './$types';
import type { LeadUpdatePayload, LeadData } from '$lib/types/lead';
import { syncLeadToUnified } from '$lib/server/unifiedSync';

/**
 * Updates lead fields (stage, status, business_notes) for a business's lead
 * - Validates business ownership of the lead
 * - Supports dynamic partial updates
 * - Auto-creates project when stage moves to Won (3)
 */
export const POST: RequestHandler = async ({ request, cookies }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });

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

		const { id, stage, status, business_notes } = (await request.json()) as LeadUpdatePayload;

		if (!id) {
			return json(
				{ success: false, error: 'Lead ID is required' },
				{ status: 400 }
			);
		}

		// Get all business IDs this session can manage (main + branches)
		const mainBusinessId = sessionResult.session.businessId;
		const branchResult = await pool.query<{ branch_id: number }>(
			'SELECT branch_id FROM branches WHERE main_id = $1 AND isactive = true',
			[mainBusinessId]
		);
		const allowedBusinessIds = [mainBusinessId, ...branchResult.rows.map(r => r.branch_id)];

		// Verify the lead exists and belongs to main business or its branches
		const verifyQuery = `SELECT business_id FROM leaddata WHERE id = $1`;
		const verifyResult = await pool.query<{ business_id: number | null }>(verifyQuery, [id]);

		if (verifyResult.rows.length === 0) {
			return json(
				{ success: false, error: 'Lead not found' },
				{ status: 404 }
			);
		}

		const leadBusinessId = verifyResult.rows[0].business_id;
		if (leadBusinessId && !allowedBusinessIds.includes(leadBusinessId)) {
			return json(
				{ success: false, error: 'Forbidden - You can only update your own leads' },
				{ status: 403 }
			);
		}

		// ✅ Build dynamic update query based on provided fields
		const updates: string[] = [];
		const values: (number | string | boolean | null)[] = [];
		let paramIndex = 1;

		if (stage !== undefined) {
			updates.push(`stage = $${paramIndex++}`);
			values.push(stage);
		}
		if (status !== undefined) {
			updates.push(`status = $${paramIndex++}`);
			values.push(status);
		}
		if (business_notes !== undefined) {
			updates.push(`business_notes = $${paramIndex++}`);
			values.push(business_notes);
		}

		if (updates.length === 0) {
			return json(
				{ success: false, error: 'No fields to update' },
				{ status: 400 }
			);
		}

		values.push(id); // Add id as the last parameter
		const updateQuery = `
            UPDATE leaddata
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *;
        `;

		const result = await pool.query<LeadData>(updateQuery, values);

		if (result.rows.length === 0) {
			return json(
				{ success: false, error: 'Lead not found' },
				{ status: 404 }
			);
		}

		const updatedLead = result.rows[0];
		await syncLeadToUnified(pool, 'in', id);

		// ✅ If lead is marked as "Won" (stage 3), automatically create a project in project management
		if (stage === 3) {
			try {
				// Check if project already exists for this lead
				const existingProject = await pool.query<{ id: number }>(
					'SELECT id FROM project_management WHERE lead_id = $1',
					[id]
				);

				if (existingProject.rows.length === 0) {
					// Create project in project management system
					const projectQuery = `
						INSERT INTO project_management (
							lead_id,
							stage
						) VALUES ($1, $2)
						RETURNING id
					`;

					const projectValues = [
						id, // lead_id
						3 // stage 3 = Won
					];

					const projectResult = await pool.query<{ id: number }>(projectQuery, projectValues);
					console.log(
						`Project created automatically for lead ${id}, project ID: ${projectResult.rows[0].id}`
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
