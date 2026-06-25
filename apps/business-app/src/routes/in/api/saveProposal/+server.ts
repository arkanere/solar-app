import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { BusinessAuthService } from '$lib/in/auth/business';
import { ownsBusinessSlug } from '$lib/in/ownsBusinessSlug';
import type { RequestHandler } from './$types';
import type { ProposalPayload, Proposal } from '$lib/types/lead';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });

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
		} = proposalData;

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
		// the logged-in business or one of its active branches.
		if (!(await ownsBusinessSlug(pool, sessionResult.session.businessSlug, business_slug))) {
			return json(
				{ success: false, error: 'Forbidden - You can only manage proposals for your own business' },
				{ status: 403 }
			);
		}

		let result;

		// Update existing proposal
		if (id) {
			const updateQuery = `
				UPDATE in_proposals
				SET
					customer_name = $1,
					phone_number = $2,
					address = $3,
					email = $4,
					system_capacity_kw = $5,
					panels_brand_model = $6,
					number_of_panels = $7,
					inverter_brand_model = $8,
					notes = $9,
					updated_at = NOW()
				WHERE id = $10 AND business_slug = $11
				RETURNING *
			`;

			const values = [
				customer_name,
				phone_number ?? null,
				address ?? null,
				email ?? null,
				parseFloat(system_capacity_kw.toString()),
				panels_brand_model ?? null,
				number_of_panels ? parseInt(number_of_panels.toString()) : null,
				inverter_brand_model ?? null,
				notes ?? null,
				id,
				business_slug
			];

			result = await pool.query<Proposal>(updateQuery, values);

			if (result.rows.length === 0) {
				return json(
					{ success: false, error: 'Proposal not found' },
					{ status: 404 }
				);
			}
		}
		// Create new proposal
		else {
			const insertQuery = `
				INSERT INTO in_proposals (
					business_slug,
					lead_id,
					customer_name,
					phone_number,
					address,
					email,
					system_capacity_kw,
					panels_brand_model,
					number_of_panels,
					inverter_brand_model,
					notes,
					created_at,
					updated_at
				) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
				RETURNING *
			`;

			const values = [
				business_slug,
				lead_id ?? null,
				customer_name,
				phone_number ?? null,
				address ?? null,
				email ?? null,
				parseFloat(system_capacity_kw.toString()),
				panels_brand_model ?? null,
				number_of_panels ? parseInt(number_of_panels.toString()) : null,
				inverter_brand_model ?? null,
				notes ?? null
			];

			result = await pool.query<Proposal>(insertQuery, values);
		}

		return json({ success: true, proposal: result.rows[0] });
	} catch (error) {
		console.error('❌ Error saving proposal:', error);
		return json(
			{ success: false, error: 'Failed to save proposal' },
			{ status: 500 }
		);
	}
};
