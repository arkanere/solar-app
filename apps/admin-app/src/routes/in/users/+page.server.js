export const prerender = false;

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const result = await pool.query(
			`SELECT id, name, email, magic_link_token, created_at FROM in_user ORDER BY id DESC`
		);

		return { users: result.rows };
	} catch (error) {
		console.error('Database query error:', error);
		return { errorMessage: 'Failed to load user data' };
	}
}
