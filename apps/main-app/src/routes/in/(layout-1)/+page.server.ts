import type { PageServerLoad } from './$types';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
export const config = {
	isr: {
		expiration: 604800 // 7 days
	}
};


const pool = createPool({ connectionString: POSTGRES_URL });

interface Project {
	id: number;
	business_slug: string;
	title: string;
	pincode: string;
	project_date: string;
	created_at: string;
	image_url: string;
	cloudinary_public_id: string;
	image_width: number;
	image_height: number;
	image_format: string;
	project_slug: string;
}

export const load: PageServerLoad = async () => {
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

			const projectsResult = await client.query<Project>(projectsQuery);

			const dateModified = new Date().toISOString().split('T')[0];

			return {
				user: null,
				recentProjects: projectsResult.rows,
				dateModified
			};
		} catch (queryError) {
			console.error('Database query error:', queryError);
			return {
				user: null,
				recentProjects: [],
				dateModified: new Date().toISOString().split('T')[0]
			};
		} finally {
			client.release();
		}
	} catch (connectionError) {
		console.error('Database connection error:', connectionError);
		return {
			user: null,
			recentProjects: [],
			dateModified: new Date().toISOString().split('T')[0]
		};
	}
};
