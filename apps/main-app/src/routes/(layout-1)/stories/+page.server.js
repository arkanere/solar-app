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
	const limit = 5; // Only 5 projects for stories

	try {
		const client = await pool.connect();

		try {
			// Query to get 5 most recent visible projects for stories
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
        AND (cloudinary_public_id IS NOT NULL OR image_url IS NOT NULL)
        ORDER BY project_date DESC
        LIMIT $1
      `;

			const projectsResult = await client.query(projectsQuery, [limit]);

			return {
				success: true,
				projects: projectsResult.rows,
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