
export const config = {
	isr: {
		expiration: 86400 // 24 hours
	}
};

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

const pool = createPool({ connectionString: POSTGRES_URL });

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	// This is page 1, so we always start from the beginning
	const page = 1;
	const limit = 9; // Projects per page
	const offset = 0;

	try {
		const client = await pool.connect();

		try {
			// Query to get paginated projects from all businesses
			const projectsQuery = `
        SELECT 
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
        LIMIT $1 OFFSET $2
      `;

			// Query to get total count of visible projects
			const countQuery = `
        SELECT COUNT(*) AS total
        FROM projects
        WHERE isvisible = true
        AND business_slug IS NOT NULL
      `;

			const projectsResult = await client.query(projectsQuery, [limit, offset]);

			const countResult = await client.query(countQuery);

			const totalProjects = parseInt(countResult.rows[0].total, 10);
			const totalPages = Math.ceil(totalProjects / limit);

			return {
				success: true,
				projects: projectsResult.rows,
				pagination: {
					currentPage: page,
					totalPages: totalPages,
					totalProjects: totalProjects,
					limit: limit,
					hasMore: page < totalPages
				},
				debug: {
					timestamp: new Date().toISOString(),
					projectCount: projectsResult.rowCount
				}
			};
		} catch (queryError) {
			console.error('Database query error:', queryError);
			return {
				success: false,
				error: 'Failed to fetch projects: ' + queryError.message
			};
		} finally {
			client.release();
		}
	} catch (connectionError) {
		console.error('Database connection error:', connectionError);
		return {
			success: false,
			error: 'Database connection error: ' + connectionError.message
		};
	}
}
