import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const config = {
	isr: {
		expiration: 86400
	}
};

export const load: PageServerLoad = async () => {
	const page = 1;
	const limit = 9;
	const offset = 0;

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
	} catch (error) {
		console.error('Database query error:', error);
		return {
			success: false,
			error: 'Failed to fetch projects: ' + (error instanceof Error ? error.message : String(error))
		};
	}
}
