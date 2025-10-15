export const prerender = false;

// src/routes/admin/claimdata/+page.server.js

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// Query all claims, ordering by latest ID first
		const result = await pool.query(
			'SELECT id,name,phone,message,created_at,pincode, notes, urlparam FROM queries ORDER BY id DESC'
		);

		if (result.rows.length > 0) {
			return { queries: result.rows };
		} else {
			return { errorMessage: 'No claim data found' };
		}
	} catch (error) {
		console.error('Database query error:', error);
		return { errorMessage: 'Failed to load claim data' };
	}
}
