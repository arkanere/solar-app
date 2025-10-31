export const prerender = false;

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const result = await pool.query('SELECT * FROM us_leaddata_claimrequests ORDER BY id DESC');

		if (result.rows.length > 0) {
			return { leadClaims: result.rows };
		} else {
			return { errorMessage: 'No lead claims found' };
		}
	} catch (error) {
		console.error('Database query error:', error);
		return { errorMessage: 'Failed to load lead claims data' };
	}
}
