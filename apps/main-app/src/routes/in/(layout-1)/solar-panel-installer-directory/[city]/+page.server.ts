import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

export const config = {
	isr: {
		expiration: 604800
	}
};

export const load: PageServerLoad = async ({ params }) => {
	const citySlug = params.city.toLowerCase();

	try {
		const districtResult = await pool.query(
			`SELECT city, district
			FROM locations
			WHERE LOWER(REGEXP_REPLACE(city, '\\s+', '-', 'g')) = $1
			LIMIT 1`,
			[citySlug]
		);

		if (districtResult.rows.length === 0) {
			error(404, { message: `No location found for "${citySlug}"` });
		}

		const city = districtResult.rows[0].city;
		const district = districtResult.rows[0].district;

		const pincodeResult = await pool.query(
			`SELECT pincode FROM pincode_mapping WHERE LOWER(district) = LOWER($1) LIMIT 1`,
			[district]
		);
		const postalCode: string | undefined = pincodeResult.rows[0]?.pincode ?? undefined;

		const districtBusinessesResult = await pool.query(
			`SELECT businessname, description, phonenumber, slug, address, pluscode, state, city, tag, rscore, businessfilled, services
      FROM businesses_1
      WHERE district = $1 AND isvisible = true`,
			[district]
		);

		const businesses = districtBusinessesResult.rows;

		const businessSlugs = businesses.map((b) => b.slug);
		let businessProjectsMap = new Map();

		if (businessSlugs.length > 0) {
			const projectsByBusinessResult = await pool.query(
				`SELECT
					business_slug,
					project_slug,
					title,
					image_url,
					cloudinary_public_id,
					image_width,
					image_height,
					image_format,
					project_date
				FROM (
					SELECT *,
						ROW_NUMBER() OVER (PARTITION BY business_slug ORDER BY project_date DESC, created_at DESC) as rn
					FROM projects
					WHERE business_slug = ANY($1) AND isvisible = true
				) ranked
				WHERE rn <= 3`,
				[businessSlugs]
			);

			projectsByBusinessResult.rows.forEach((project) => {
				if (!businessProjectsMap.has(project.business_slug)) {
					businessProjectsMap.set(project.business_slug, []);
				}
				businessProjectsMap.get(project.business_slug).push(project);
			});
		}

		const businessesWithProjects = businesses
			.map((business) => ({
				...business,
				recent_projects: businessProjectsMap.get(business.slug) || []
			}))
			.sort((a, b) => {
				const aCityMatch = a.city === city ? 0 : 1;
				const bCityMatch = b.city === city ? 0 : 1;
				if (aCityMatch !== bCityMatch) return aCityMatch - bCityMatch;

				const aProjectCount = a.recent_projects.length;
				const bProjectCount = b.recent_projects.length;
				if (aProjectCount !== bProjectCount) return bProjectCount - aProjectCount;

				return (b.rscore || 0) - (a.rscore || 0);
			});

		const citiesResult = await pool.query(
			`SELECT DISTINCT city
			FROM locations
			WHERE district = $1
			ORDER BY city ASC`,
			[district]
		);

		const subset_cities_localities = citiesResult.rows.map((row) => row.city);

		const projectsResult = await pool.query(
			`SELECT
				id,
				business_slug,
				project_slug,
				title,
				pincode,
				project_date,
				created_at,
				image_url,
				cloudinary_public_id,
				image_width,
				image_height,
				image_format,
				district
			FROM projects
			WHERE district = $1 AND isvisible = true
			ORDER BY
				project_date DESC,
				created_at DESC
			LIMIT 6`,
			[district]
		);

		const recentProjects = projectsResult.rows;

		if (businessesWithProjects.length > 0) {
			return {
				city,
				district,
				postalCode,
				businesses: businessesWithProjects,
				subset_cities_localities,
				recentProjects,
				lastUpdated: new Date().toISOString()
			};
		} else {
			return {
				city,
				district,
				postalCode,
				subset_cities_localities,
				recentProjects,
				lastUpdated: new Date().toISOString(),
				errorMessage: `No businesses found in ${city} or its district: ${district}.`
			};
		}
	} catch (error) {
		console.error('Database query error:', error);
		return {
			city: citySlug,
			errorMessage: 'Failed to load businesses',
			subset_cities_localities: [],
			district: '',
			recentProjects: [],
			lastUpdated: new Date().toISOString()
		};
	}
}
