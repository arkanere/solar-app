export const config = {
	isr: {
		expiration: 604800 // 7 days
	}
};

import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

const pool = createPool({ connectionString: POSTGRES_URL });

export async function load() {
	// Fetch 6 most recent projects for the home page
	try {
		const client = await pool.connect();

		try {
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
        LIMIT 6
      `;

			const projectsResult = await client.query(projectsQuery);

			return {
				recentProjects: projectsResult.rows
			};
		} catch (queryError) {
			console.error('Database query error:', queryError);
			return {
				recentProjects: []
			};
		} finally {
			client.release();
		}
	} catch (connectionError) {
		console.error('Database connection error:', connectionError);
		return {
			recentProjects: []
		};
	}
}