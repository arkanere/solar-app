// src/routes/business/[business_slug]/project/+page.server.js
export const prerender = false;
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export async function load({ params, locals, parent }) {
	const businessSlug = params.business_slug;

	// Get the parent layout data which contains authentication info
	const parentData = await parent();

	// The parent layout already handles authentication and redirects
	// We just need to check if we have the session data
	if (!parentData.business_session) {
		throw error(403, 'Not authorized');
	}

	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		// First, get the main business using the slug
		const mainBusinessQuery = `
      SELECT * FROM businesses_1 
      WHERE slug = $1
    `;

		const mainBusinessResult = await pool.query(mainBusinessQuery, [businessSlug]);

		if (mainBusinessResult.rows.length === 0) {
			return {
				errorMessage: 'Business not found',
				projects: []
			};
		}

		const mainBusiness = mainBusinessResult.rows[0];

		// Get all visible projects for this business
		const projectsQuery = `
      SELECT 
        id, 
        business_slug, 
        project_slug,
        title, 
        pincode, 
        district,
        project_date, 
        created_at,
        image_url,
        cloudinary_public_id,
        image_width,
        image_height,
        image_format
      FROM projects 
      WHERE business_slug = $1 AND (isvisible = TRUE OR isvisible IS NULL)
      ORDER BY project_date DESC, created_at DESC
    `;

		const projectsResult = await pool.query(projectsQuery, [businessSlug]);
		const projects = projectsResult.rows;

		return {
			mainBusiness,
			projects: projects,
			businessSlug
		};
	} catch (error) {
		console.error('Error fetching projects:', error);
		return {
			errorMessage: 'Failed to load projects',
			projects: []
		};
	} finally {
		await pool.end();
	}
}