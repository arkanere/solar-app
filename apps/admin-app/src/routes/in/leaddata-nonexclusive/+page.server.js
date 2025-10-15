export const prerender = false;

// src/routes/admin/leaddata-nonexclusive/+page.server.js

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const result = await pool.query(
			'SELECT * FROM leaddata WHERE isvisible = true AND urlparams NOT LIKE $1 AND urlparams != $2 AND (category IS NULL OR category <> $3) ORDER BY id DESC;',
			['%solar-panel-installer/%', '/campaign/shunya-solar-pune-rooftop-installation', 2]
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
