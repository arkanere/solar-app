export const prerender = false;

// src/routes/admin/businesses/+page.server.js

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const result = await pool.query(`SELECT id, businessname, phonenumber,
      state, county, tag, notes, isvisible FROM us_businesses ORDER BY id DESC LIMIT 100`);

		if (result.rows.length > 0) {
			return { businesses: result.rows };
		} else {
			return { errorMessage: 'No business data found' };
		}
	} catch (error) {
		console.error('Database query error:', error);
		return { errorMessage: 'Failed to load business data' };
	}
}
