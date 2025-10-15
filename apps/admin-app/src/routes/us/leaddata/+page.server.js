export const prerender = false;

// src/routes/admin/leaddata/+page.server.js

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const result = await pool.query(
			'SELECT *, sv_comment_for_businesses FROM us_leaddata where isvisible = true ORDER by id DESC'
		);

		if (result.rows.length > 0) {
			return { leads: result.rows };
		} else {
			return { errorMessage: 'No lead data found' };
		}
	} catch (error) {
		console.error('Database query error:', error);
		return { errorMessage: 'Failed to load lead data' };
	}
}
