import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

export const config = {
	isr: {
		expiration: 604800
	}
};

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.business_slug;

	try {
		const businessResult = await pool.query(
			`SELECT businessname, description, phonenumber, email, website,
			slug, address, district,
			state, city, tag, rscore, businessfilled, services, brands, instagram_id, google_maps_link
			FROM businesses_1 WHERE slug = $1 and isvisible = true`,
			[slug]
		);

		if (businessResult.rows.length === 0) {
			error(404, { message: `No business found for "${slug}"` });
		}

		const business = businessResult.rows[0];

		let projects = [];
		if (business.businessfilled) {
			let mainBusinessSlug = slug;
			const branchPattern = /-branch-[a-zA-Z0-9]+$/;
			if (branchPattern.test(slug)) {
				mainBusinessSlug = slug.replace(branchPattern, '');
			}

			const projectsResult = await pool.query(
				`SELECT
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
				LIMIT 10`,
				[mainBusinessSlug]
			);
			projects = projectsResult.rows;
		}

		return {
			business,
			projects,
			lastUpdated: new Date().toISOString()
		};
	} catch (err) {
		if (err?.status) throw err;
		console.error('Database query error:', err);
		return {
			errorMessage: 'Failed to load business details',
			lastUpdated: new Date().toISOString()
		};
	}
}
