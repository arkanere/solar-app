import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, fetch }) {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const { name, phone, pinCode, type, comment, urlParam, email } = await request.json();

		let district = null;
		let state = null;
		if (pinCode) {
			try {
				const districtResult = await pool.query(
					'SELECT district, state FROM pincode_mapping WHERE pincode = $1 LIMIT 1',
					[pinCode]
				);
				if (districtResult.rows.length > 0) {
					district = districtResult.rows[0].district;
					state = districtResult.rows[0].state;
				}
			} catch (districtError) {
				console.log('District lookup failed for pincode:', pinCode, districtError);
			}
		}

		const result = await pool.query(
			`INSERT INTO LeadData (name, phone, pin_code, type, comment, urlparams, email, district, state)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
			RETURNING id, reference_uuid`,
			[name, phone, pinCode, type, comment, urlParam, email || null, district, state]
		);

		const leadId = result.rows[0].id;
		const referenceUuid = result.rows[0].reference_uuid;

		await fetch('/in/api/sendLeadSubmissionConfirmation', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: leadId, name, phone, pinCode, type, comment, urlParam, email, district, state })
		});

		return json({ success: true, reference_uuid: referenceUuid });
	} catch (error) {
		console.error('Error inserting lead data:', error);
		return json({ success: false, error: 'Failed to submit lead' }, { status: 500 });
	}
}
