export const config = {
	isr: {
		expiration: 86400 // 24 hours cache (86400 seconds)
	}
};

import { json, type RequestHandler } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

const pool = createPool({ connectionString: POSTGRES_URL });

export const GET: RequestHandler = async () => {
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

			return json({
				success: true,
				projects: projectsResult.rows,
				debug: {
					timestamp: new Date().toISOString(),
					projectCount: projectsResult.rowCount
				}
			});
		} catch (queryError) {
			console.error('Database query error:', queryError);
			return json({
				success: false,
				error: 'Failed to fetch projects: ' + (queryError as Error).message
			}, { status: 500 });
		} finally {
			client.release();
		}
	} catch (connectionError) {
		console.error('Database connection error:', connectionError);
		return json({
			success: false,
			error: 'Database connection error: ' + (connectionError as Error).message
		}, { status: 500 });
	}
}