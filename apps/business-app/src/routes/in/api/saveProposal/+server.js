import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const proposalData = await request.json();
		const {
			id,
			lead_id,
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
			return json({ success: false, error: 'Customer name and system capacity are required' }, { status: 400 });
		}

		let result;

		// Update existing proposal
		if (id) {
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
				phone_number,
				address,
				email,
				parseFloat(system_capacity_kw),
				panels_brand_model,
				number_of_panels ? parseInt(number_of_panels) : null,
				inverter_brand_model,
				notes,
				id
			];

			result = await pool.query(updateQuery, values);

			if (result.rows.length === 0) {
				return json({ success: false, error: 'Proposal not found' }, { status: 404 });
			}
		}
		// Create new proposal
		else {
			const insertQuery = `
				INSERT INTO proposals (
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
				) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
				RETURNING *
			`;

			const values = [
				lead_id || null,
				customer_name,
				phone_number,
				address,
				email,
				parseFloat(system_capacity_kw),
				panels_brand_model,
				number_of_panels ? parseInt(number_of_panels) : null,
				inverter_brand_model,
				notes
			];

			result = await pool.query(insertQuery, values);
		}

		return json({ success: true, proposal: result.rows[0] });
	} catch (error) {
		console.error('Error saving proposal:', error);
		return json({ success: false, error: 'Failed to save proposal' }, { status: 500 });
	}
}
