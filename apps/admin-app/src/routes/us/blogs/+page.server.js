import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

export async function load() {
	try {
		const pool = createPool({ connectionString: POSTGRES_URL });

		// Fetch all blogs, ordered by most recent first
		const result = await pool.query(`
			SELECT
				id,
				title,
				slug,
				excerpt,
				author_name,
				status,
				published_at,
				created_at,
				updated_at,
				view_count
			FROM us_blogs
			ORDER BY created_at DESC
		`);

		return {
			blogs: result.rows
		};
	} catch (error) {
		console.error('Error loading blogs:', error);
		return {
			blogs: [],
			error: 'Failed to load blogs'
		};
	}
}
