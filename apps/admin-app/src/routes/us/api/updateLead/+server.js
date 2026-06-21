// src/routes/api/updateLead/+server.js
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const data = await request.json();
		const {
			id,
			name,
			phone,
			pin_code,
			email,
			type,
			comment,
			svnotes,
			sv_comment_for_businesses,
			district,
			category,
			stage,
			status
		} = data;

		if (!id) {
			return json({ success: false, error: 'Lead ID is required' }, { status: 400 });
		}

		// Construct the SQL query with new fields (US leaddata: zipcode/county)
		const updateQuery = `
            UPDATE us_leaddata
            SET name = $1,
                phone = $2,
                zipcode = $3,
                email = $4,
                type = $5,
                comment = $6,
                svnotes = $7,
                sv_comment_for_businesses = $8,
                county = $9,
                category = $10,
                stage = $11,
                status = $12
            WHERE id = $13
            RETURNING *;
        `;

		// Execute the query with provided values
		const result = await pool.query(updateQuery, [
			name,
			phone,
			pin_code,
			email,
			type,
			comment,
			svnotes,
			sv_comment_for_businesses,
			district,
			category,
			stage,
			status,
			id
		]);

		if (result.rows.length === 0) {
			return json({ success: false, error: 'Lead not found' }, { status: 404 });
		}

		return json({ success: true, lead: result.rows[0] });
	} catch (error) {
		console.error('Error updating lead data:', error);
		return json({ success: false, error: 'Failed to update lead' }, { status: 500 });
	}
}
