import type { PageServerLoad } from './$types';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const prerender = false;

interface Business {
	id?: number;
	slug?: string;
	[key: string]: unknown;
}

interface Project {
	id: number;
	business_slug: string;
	project_slug: string;
	title: string;
	pincode?: string;
	district?: string;
	project_date?: string;
	created_at: string;
	image_url?: string;
	cloudinary_public_id?: string;
	image_width?: number;
	image_height?: number;
	image_format?: string;
}

interface PageData {
	mainBusiness?: Business;
	projects?: Project[];
	businessSlug?: string;
	errorMessage?: string;
}

export const load: PageServerLoad<PageData> = async ({ params, parent }) => {
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
		// First, get the main business profile using the slug
		const mainBusinessQuery = `
      SELECT business_id AS id, slug, businessname, email, phonenumber, whatsapp,
        description, website, instagram_id, google_maps_link, address, pluscode,
        services, brands, gstn, state, district, city, pincode, rscore, tag,
        businessfilled, isvisible
      FROM in_business_profiles
      WHERE slug = $1
    `;

		const mainBusinessResult = await pool.query(mainBusinessQuery, [businessSlug]);

		if (mainBusinessResult.rows.length === 0) {
			return {
				errorMessage: 'Business not found',
				projects: []
			};
		}

		const mainBusiness = mainBusinessResult.rows[0] as Business;

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
		const projects = projectsResult.rows as Project[];

		return {
			mainBusiness,
			projects,
			businessSlug
		};
	} catch (err) {
		console.error('❌ Error fetching projects:', err);
		return {
			errorMessage: 'Failed to load projects',
			projects: []
		};
	} finally {
		await pool.end();
	}
};
