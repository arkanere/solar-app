import { createPool, type VercelPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';

interface QueryData {
	name: string;
	phone: string;
	message: string;
	pincode: string;
	urlParam: string;
}

interface QueryResult {
	id: number;
}

export const POST: RequestHandler = async ({ request }) => {
	const pool: VercelPool = createPool({ connectionString: POSTGRES_URL });

	try {
		const data = await request.json() as QueryData;
		const { name, phone, message, pincode, urlParam } = data;

		const insertQuery = `
            INSERT INTO Queries (name, phone, message, pincode, urlParam)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;

		const result = await pool.query<QueryResult>(insertQuery, [name, phone, message, pincode, urlParam]);

		return json({ success: true, id: result.rows[0].id });
	} catch (error) {
		console.error('Error inserting query:', error);
		return json({ success: false, error: 'Failed to submit query' }, { status: 500 });
	}
};
