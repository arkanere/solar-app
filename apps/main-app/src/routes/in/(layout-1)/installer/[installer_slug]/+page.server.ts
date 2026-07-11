import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.installer_slug.toLowerCase();

	const businessResult = await pool.query(
		`SELECT businessname, description, phonenumber, email, website,
		        slug, address, district, state, city, tag, rscore,
		        businessfilled, services, brands, instagram_id, google_maps_link
		 FROM in_business_profiles
		 WHERE slug = $1 AND isvisible = true`,
		[slug]
	);

	if (businessResult.rows.length === 0) {
		error(404, 'Installer not found');
	}

	const business = businessResult.rows[0];

	// Projects, service area districts, and brand names in parallel
	let mainSlug = slug;
	const branchPattern = /-branch-[a-zA-Z0-9]+$/;
	if (branchPattern.test(slug)) {
		mainSlug = slug.replace(branchPattern, '');
	}

	const [projectsResult, locationsResult] = await Promise.all([
		pool.query(
			`SELECT id, business_slug, project_slug, title, pincode, district,
			        project_date, created_at, image_url, cloudinary_public_id
			 FROM projects
			 WHERE business_slug = $1 AND isvisible = true
			 ORDER BY project_date DESC, created_at DESC
			 LIMIT 12`,
			[mainSlug]
		),
		pool.query(
			`SELECT DISTINCT l.city,
			        LOWER(REPLACE(l.state, ' ', '-')) as state_slug,
			        LOWER(REPLACE(l.district, ' ', '-')) as district_slug,
			        LOWER(REPLACE(l.city, ' ', '-')) as city_slug
			 FROM locations l
			 WHERE LOWER(l.district) = LOWER($1) AND LOWER(l.state) = LOWER($2)
			 ORDER BY l.city
			 LIMIT 20`,
			[business.district, business.state]
		)
	]);

	return {
		business,
		projects: projectsResult.rows,
		serviceAreas: locationsResult.rows
	};
};
