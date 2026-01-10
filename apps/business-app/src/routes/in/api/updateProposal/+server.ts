import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { ProposalPayload, Proposal } from '$lib/types/lead';

interface UpdateProposalResponse {
	success: boolean;
	error?: string;
	proposal?: Proposal;
}

export const POST: RequestHandler = async ({ request }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const proposalData = (await request.json()) as ProposalPayload;
		const {
			id,
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
			return json<UpdateProposalResponse>(
				{ success: false, error: 'Proposal ID is required' },
				{ status: 400 }
			);
		}

		if (!customer_name || !system_capacity_kw) {
			return json<UpdateProposalResponse>(
				{ success: false, error: 'Customer name and system capacity are required' },
				{ status: 400 }
			);
		}

		const updateQuery = `
			UPDATE proposals
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
			WHERE id = $10
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
			id
		];

		const result = await pool.query<Proposal>(updateQuery, values);

		if (result.rows.length === 0) {
			return json<UpdateProposalResponse>(
				{ success: false, error: 'Proposal not found' },
				{ status: 404 }
			);
		}

		return json<UpdateProposalResponse>({ success: true, proposal: result.rows[0] });
	} catch (error) {
		console.error('❌ Error updating proposal:', error);
		return json<UpdateProposalResponse>(
			{ success: false, error: 'Failed to update proposal' },
			{ status: 500 }
		);
	}
};
