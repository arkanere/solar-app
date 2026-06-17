export const prerender = false;

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const ninetyDaysAgo = new Date();
		ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

		const result = await pool.query(`
			SELECT
				l.id, l.name, l.district, l.state,
				l.created_at, l.category, l.claim_count,
				CASE
					WHEN EXISTS (
						SELECT 1 FROM businesses_1 b WHERE b.district = l.district AND b.isvisible = true
					) THEN 'Not Claimed'
					ELSE 'No Business'
				END as reason
			FROM leaddata l
			WHERE l.isvisible = true AND l.status = true
				AND (l.category != 2 OR l.category IS NULL)
				AND NOT EXISTS (
					SELECT 1 FROM leaddata c WHERE c.original_id = l.id AND c.category = 2
				)
				AND l.created_at >= $1
			ORDER BY l.created_at DESC
		`, [ninetyDaysAgo.toISOString()]);

		return { leads: result.rows };
	} catch (error) {
		console.error('Leads not claimed data query error:', error);
		return { error: 'Failed to load data', leads: [] };
	}
}
