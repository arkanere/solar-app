// src/routes/in/(layout-1)/solar-panel-installer/[business_slug]/+page.server.js

import type { PageServerLoad } from './$types';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
export const config = {
	isr: {
		expiration: 604800 // 7 days
	}
};


const pool = createPool({ connectionString: POSTGRES_URL });

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.business_slug;

	try {
		// Query the database for the business with the matching slug
		const businessResult = await pool.query(
			`SELECT businessname, description, phonenumber, email, website,
			slug, address, district,
			state, city, tag, rscore, businessfilled, services, brands, instagram_id, google_maps_link
			FROM businesses_1 WHERE slug = $1 and isvisible = true`,
			[slug]
		);

		if (businessResult.rows.length === 0) {
			return { errorMessage: `No business found`, user: null };
		}

		const business = businessResult.rows[0];

		// Fetch projects data if business is filled
		let projects = [];
		if (business.businessfilled) {
			// Extract main business slug by removing branch suffix if present
			let mainBusinessSlug = slug;
			const branchPattern = /-branch-[a-zA-Z0-9]+$/;
			if (branchPattern.test(slug)) {
				mainBusinessSlug = slug.replace(branchPattern, '');
			}

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
				WHERE business_slug = $1
				AND (isvisible = TRUE OR isvisible IS NULL)
				ORDER BY project_date DESC, created_at DESC
				LIMIT 10
			`;

			const projectsResult = await pool.query(projectsQuery, [mainBusinessSlug]);
			projects = projectsResult.rows;
		}

		return {
			business,
			projects,
			user: null
		};
	} catch (error) {
		console.error('Database query error:', error);
		return { errorMessage: 'Failed to load business details', user: null };
	}
}
