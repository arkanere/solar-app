// api/updateQuery/server.js

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const data = await request.json();
		const { id, name, phone, message, pincode, notes } = data;

		const updateQuery = `
            UPDATE Queries
            SET name = $1, phone = $2, message = $3, pincode = $4, notes = $5
            WHERE id = $6
            RETURNING id
        `;

		const result = await pool.query(updateQuery, [name, phone, message, pincode, notes, id]);

		if (result.rowCount === 0) {
			// No rows were updated, likely because the id was not found
			return json({ success: false, error: 'Query not found' }, { status: 404 });
		}

		return json({ success: true, id: result.rows[0].id });
	} catch (error) {
		console.error('Error updating query:', error);
		return json({ success: false, error: 'Failed to update query' }, { status: 500 });
	}
}
