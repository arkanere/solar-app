export const prerender = false;

// src/routes/admin/leaddata-nonexclusive/+page.server.js

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const result = await pool.query(
			'SELECT * FROM leaddata WHERE isvisible = true AND status = true AND urlparams NOT LIKE $1 AND urlparams != $2 AND (category IS NULL OR category <> $3) ORDER BY id DESC;',
			['%solar-panel-installer/%', '/campaign/shunya-solar-pune-rooftop-installation', 2]
		);

		if (result.rows.length > 0) {
			const districts = [...new Set(result.rows.map(r => r.district).filter(Boolean))];
			let districtsWithBusinesses = new Set();
			if (districts.length > 0) {
				const bizResult = await pool.query(
					'SELECT DISTINCT district FROM businesses_1 WHERE district = ANY($1) AND isvisible = true',
					[districts]
				);
				districtsWithBusinesses = new Set(bizResult.rows.map(r => r.district));
			}
			const leads = result.rows.map(lead => ({
				...lead,
				has_business_in_district: lead.district ? districtsWithBusinesses.has(lead.district) : false
			}));
			return { leads };
		} else {
			return { errorMessage: 'No lead data found' };
		}
	} catch (error) {
		console.error('Database query error:', error);
		return { errorMessage: 'Failed to load lead data' };
	}
}
