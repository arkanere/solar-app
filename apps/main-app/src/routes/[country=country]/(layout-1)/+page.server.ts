import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { getCountry } from '$lib/countries';

export const config = {
	isr: {
		expiration: 1296000
	}
};

export const load: PageServerLoad = async ({ params }) => {
	// `projects` is an IN-only legacy table with no country_code column at all,
	// so there is nothing to scope the query by. Countries without the feature
	// skip it entirely rather than rendering Indian projects on their home
	// (stage 9 of docs/migration-plan-delete-us.md, §4.1).
	const dateModified = new Date().toISOString().split('T')[0];
	if (!getCountry(params.country).features.projects) {
		return { recentProjects: [], dateModified };
	}

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
