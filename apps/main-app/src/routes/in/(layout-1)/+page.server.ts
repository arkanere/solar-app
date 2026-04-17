import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const config = {
	isr: {
		expiration: 1296000
	}
};

export const load: PageServerLoad = async () => {
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
			LIMIT 6`
		);

		return {
			recentProjects: projectsResult.rows,
			dateModified: new Date().toISOString().split('T')[0]
		};
	} catch (error) {
		console.error('Database query error:', error);
		return {
			recentProjects: [],
			dateModified: new Date().toISOString().split('T')[0]
		};
	}
};
