import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { getCountry } from '$lib/countries';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async ({ params }) => {
	const country = getCountry(params.country);
	const slug = params.installer_slug.toLowerCase();

	const businessResult = await pool.query(
		`SELECT businessname, description, phonenumber, email, website,
		        slug, address, level2 as district, level1 as state, city, tag, rscore,
		        businessfilled, services, brands, instagram_id, google_maps_link
		 FROM businesses
		 WHERE country_code = $1 AND slug = $2 AND isvisible = true
		 ORDER BY rscore DESC NULLS LAST
		 LIMIT 1`,
		[country.code, slug]
	);

	if (businessResult.rows.length === 0) {
		error(404, 'Installer not found');
	}

	const business = businessResult.rows[0];

	// Projects, service area cities in parallel (projects are IN-only today)
	let mainSlug = slug;
	const branchPattern = /-branch-[a-zA-Z0-9]+$/;
	if (branchPattern.test(slug)) {
		mainSlug = slug.replace(branchPattern, '');
	}

	const [projectsResult, locationsResult] = await Promise.all([
		country.features.projects
			? pool.query(
					`SELECT id, business_slug, project_slug, title, pincode, district,
					        project_date, created_at, image_url, cloudinary_public_id
					 FROM projects
					 WHERE business_slug = $1 AND isvisible = true
					 ORDER BY project_date DESC, created_at DESC
					 LIMIT 12`,
					[mainSlug]
				)
			: Promise.resolve({ rows: [] }),
		pool.query(
			`SELECT DISTINCT g.city,
			        g.level1_slug as state_slug,
			        g.level2_slug as district_slug,
			        g.city_slug
			 FROM geo_locations g
			 WHERE g.country_code = $1 AND LOWER(g.level2) = LOWER($2) AND LOWER(g.level1) = LOWER($3)
			 ORDER BY g.city
			 LIMIT 20`,
			[country.code, business.district, business.state]
		)
	]);

	return {
		business,
		projects: projectsResult.rows,
		serviceAreas: locationsResult.rows
	};
};
