export const prerender = false;

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const result = await pool.query(
			`SELECT f.user_id, u.name, u.email, u.magic_link_token,
				f.got_callback, f.got_quotation, f.recommendation_rating,
				f.suggestions, f.updated_at
			FROM in_user_feedback f
			JOIN in_user u ON u.id = f.user_id
			ORDER BY f.updated_at DESC`
		);

		return { feedback: result.rows };
	} catch (error) {
		console.error('Database query error:', error);
		return { errorMessage: 'Failed to load feedback data' };
	}
}
