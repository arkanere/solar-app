import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const config = {
	isr: {
		expiration: 86400
	}
};

export const load: PageServerLoad = async ({ params }) => {
	const pageSlug = params.page_slug;
	const page = parseInt(pageSlug, 10);

	if (isNaN(page) || page < 1) {
		throw error(404, 'Invalid page number');
	}

	const limit = 9;
	const offset = (page - 1) * limit;

	try {
		const projectsResult = await pool.query(
			`SELECT
				id,
				business_slug,
				title,
				pincode,
				project_date,
				created_at,
				image_url,
				cloudinary_public_id,
				image_width,
				image_height,
				image_format,
				project_slug
			FROM projects
			WHERE isvisible = true
			AND business_slug IS NOT NULL
			ORDER BY project_date DESC
			LIMIT $1 OFFSET $2`,
			[limit, offset]
		);

		const countResult = await pool.query(
			`SELECT COUNT(*) AS total
			FROM projects
			WHERE isvisible = true
			AND business_slug IS NOT NULL`
		);

		const totalProjects = parseInt(countResult.rows[0].total, 10);
		const totalPages = Math.ceil(totalProjects / limit);

		if (page > totalPages && totalPages > 0) {
			throw error(404, 'Page not found');
		}

		return {
			success: true,
			projects: projectsResult.rows,
			pagination: {
				currentPage: page,
				totalPages,
				totalProjects,
				limit,
				hasMore: page < totalPages
			},
			debug: {
				timestamp: new Date().toISOString(),
				projectCount: projectsResult.rowCount
			}
		};
	} catch (err) {
		if (typeof err === 'object' && err !== null && 'status' in err) throw err;
		console.error('Database query error:', err);
		return {
			success: false,
			error: 'Failed to fetch projects: ' + (err instanceof Error ? err.message : String(err))
		};
	}
}
