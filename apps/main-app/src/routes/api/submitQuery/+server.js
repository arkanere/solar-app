// api/submitQuery/server.js

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const data = await request.json();
		const { name, phone, message, pincode, urlParam } = data;

		const insertQuery = `
            INSERT INTO Queries (name, phone, message, pincode, urlParam)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;

		const result = await pool.query(insertQuery, [name, phone, message, pincode, urlParam]);

		return json({ success: true, id: result.rows[0].id });
	} catch (error) {
		console.error('Error inserting query:', error);
		return json({ success: false, error: 'Failed to submit query' }, { status: 500 });
	}
}
