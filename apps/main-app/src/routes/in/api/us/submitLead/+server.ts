import { createPool, type VercelPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';

interface LeadData {
	name: string;
	phone: string;
	zipCode: string;
	type: string;
	comment: string;
	urlParam: string;
	email?: string;
}

interface LeadResult {
	id: number;
}

export const POST: RequestHandler = async ({ request, fetch }) => {
	const pool: VercelPool = createPool({ connectionString: POSTGRES_URL });

	try {
		const data = await request.json() as LeadData;
		const { name, phone, zipCode, type, comment, urlParam, email } = data;

		const insertQuery = `
            INSERT INTO us_leaddata (name, phone, zipcode, type, comment, urlparams, email)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `;

		const result = await pool.query<LeadResult>(insertQuery, [
			name,
			phone,
			zipCode,
			type,
			comment,
			urlParam,
			email || null
		]);

		const leadId = result.rows[0].id;

		await fetch('/api/sendLeadSubmissionConfirmation', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: leadId,
				name,
				phone,
				zipCode,
				type,
				comment,
				urlParam,
				email
			})
		});

		return json({ success: true, id: leadId });
	} catch (error) {
		console.error('Error inserting lead data:', error);
		return json({ success: false, error: 'Failed to submit lead' }, { status: 500 });
	}
};
