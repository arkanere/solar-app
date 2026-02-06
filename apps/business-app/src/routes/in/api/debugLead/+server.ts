import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const pool = createPool({ connectionString: POSTGRES_URL });
	const { lead_id, business_id } = await request.json();

	try {
		// Check claim request
		const claimRequest = await pool.query(
			'SELECT * FROM leaddata_claimrequests WHERE lead_id = $1 AND business_id = $2',
			[lead_id, business_id]
		);

		// Check if allocated lead exists
		const allocatedLead = await pool.query(
			'SELECT * FROM leaddata WHERE original_id = $1 AND business_id = $2',
			[lead_id, business_id]
		);

		// Check original lead
		const originalLead = await pool.query(
			'SELECT * FROM leaddata WHERE id = $1',
			[lead_id]
		);

		return json({
			success: true,
			data: {
				claimRequest: claimRequest.rows[0] || null,
				allocatedLead: allocatedLead.rows[0] || null,
				originalLead: originalLead.rows[0] || null
			}
		});
	} catch (error) {
		console.error('Debug error:', error);
		return json({ success: false, error: String(error) }, { status: 500 });
	}
};
