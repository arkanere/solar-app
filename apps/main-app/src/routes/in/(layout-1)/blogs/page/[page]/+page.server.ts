import type { PageServerLoad } from './$types';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const page = parseInt(params.page);

	if (isNaN(page) || page < 1) {
		throw redirect(302, '/in/blogs/page/1');
	}

	try {
		const pool = createPool({ connectionString: POSTGRES_URL });
		const perPage = 6;
		const offset = (page - 1) * perPage;

		// Get total count
		const countResult = await pool.query(`
			SELECT COUNT(*) as total
			FROM in_blogs
			WHERE status = 'published'
		`);
		const total = parseInt(countResult.rows[0].total);
		const totalPages = Math.ceil(total / perPage);

		// Redirect if page is out of range
		if (page > totalPages && totalPages > 0) {
			throw redirect(302, `/in/blogs/page/${totalPages}`);
		}

		// Fetch blogs for current page
		const result = await pool.query(`
			SELECT
				id,
				title,
				slug,
				excerpt,
				featured_image,
				author_name,
				published_at,
				view_count,
				tags,
				categories
			FROM in_blogs
			WHERE status = 'published'
			ORDER BY published_at DESC
			LIMIT $1 OFFSET $2
		`, [perPage, offset]);

		return {
			blogs: result.rows,
			pagination: {
				page,
				perPage,
				total,
				totalPages
			}
		};
	} catch (err) {
		if (err.status === 302) throw err;
		console.error('Error loading blogs:', err);
		return {
			blogs: [],
			error: 'Failed to load blogs',
			pagination: { page: 1, perPage: 6, total: 0, totalPages: 0 }
		};
	}
}
