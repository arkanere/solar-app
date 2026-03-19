import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { resolveGeoSlug } from '$lib/server/slug-resolver';

export const config = {
	isr: { expiration: 604800 }
};

export const load: PageServerLoad = async ({ params }) => {
	const stateSlug = params.state.toLowerCase();
	const districtSlug = params.district.toLowerCase();
	const slug = params.slug.toLowerCase();

	// Validate state+district
	const locationResult = await pool.query(
		`SELECT DISTINCT state, district FROM locations
		 WHERE LOWER(REPLACE(state, ' ', '-')) = $1
		   AND LOWER(REPLACE(district, ' ', '-')) = $2
		 LIMIT 1`,
		[stateSlug, districtSlug]
	);

	if (locationResult.rows.length === 0) {
		error(404, 'Location not found');
	}

	const { state, district } = locationResult.rows[0];

	const resolved = await resolveGeoSlug(pool, slug, stateSlug, districtSlug);
	if (!resolved) {
		error(404, 'Page not found');
	}

	if (resolved.type === 'city') {
		const city = resolved.data.city as string;

		const [businessesResult, projectsResult, pincodeResult] = await Promise.all([
			pool.query(
				`SELECT businessname, description, phonenumber, slug, address, pluscode, state, city, tag, rscore, businessfilled, services
				 FROM businesses_1
				 WHERE LOWER(district) = LOWER($1) AND isvisible = true`,
				[district]
			),
			pool.query(
				`SELECT p.id, p.business_slug, p.project_slug, p.title, p.pincode, p.project_date, p.created_at,
				        p.image_url, p.cloudinary_public_id, p.image_width, p.image_height, p.image_format
				 FROM projects p
				 WHERE LOWER(p.district) = LOWER($1) AND p.isvisible = true
				 ORDER BY p.project_date DESC, p.created_at DESC
				 LIMIT 6`,
				[district]
			),
			pool.query(
				`SELECT pincode FROM pincode_mapping WHERE LOWER(district) = LOWER($1) LIMIT 1`,
				[district]
			)
		]);

		// Attach recent projects per business
		const businessSlugs = businessesResult.rows.map((b: { slug: string }) => b.slug);
		let businessProjectsMap = new Map();

		if (businessSlugs.length > 0) {
			const projectsByBusiness = await pool.query(
				`SELECT business_slug, project_slug, title, cloudinary_public_id
				 FROM (
					 SELECT *, ROW_NUMBER() OVER (PARTITION BY business_slug ORDER BY project_date DESC, created_at DESC) as rn
					 FROM projects
					 WHERE business_slug = ANY($1) AND isvisible = true
				 ) ranked
				 WHERE rn <= 3`,
				[businessSlugs]
			);
			for (const project of projectsByBusiness.rows) {
				if (!businessProjectsMap.has(project.business_slug)) {
					businessProjectsMap.set(project.business_slug, []);
				}
				businessProjectsMap.get(project.business_slug).push(project);
			}
		}

		const businesses = businessesResult.rows
			.map((b: Record<string, unknown>) => ({
				...b,
				recent_projects: businessProjectsMap.get(b.slug as string) || []
			}))
			.sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
				const aCityMatch = (a.city as string)?.toLowerCase() === city.toLowerCase() ? 0 : 1;
				const bCityMatch = (b.city as string)?.toLowerCase() === city.toLowerCase() ? 0 : 1;
				if (aCityMatch !== bCityMatch) return aCityMatch - bCityMatch;
				const aProjects = (a.recent_projects as unknown[]).length;
				const bProjects = (b.recent_projects as unknown[]).length;
				if (aProjects !== bProjects) return bProjects - aProjects;
				return ((b.rscore as number) || 0) - ((a.rscore as number) || 0);
			});

		// Fetch sibling cities
		const siblingCitiesResult = await pool.query(
			`SELECT DISTINCT city FROM businesses_1
			 WHERE LOWER(district) = LOWER($1) AND isvisible = true
			   AND LOWER(REPLACE(city, ' ', '-')) != $2
			 ORDER BY city ASC LIMIT 5`,
			[district, slug]
		);

		const siblingCities = siblingCitiesResult.rows.map((r: { city: string }) => ({
			name: r.city,
			slug: r.city.toLowerCase().replace(/\s+/g, '-')
		}));

		return {
			pageType: 'city' as const,
			state,
			stateSlug,
			district,
			districtSlug,
			city,
			citySlug: slug,
			businesses,
			recentProjects: projectsResult.rows,
			postalCode: pincodeResult.rows[0]?.pincode || null,
			installerCount: businesses.length,
			siblingCities,
			lastUpdated: new Date().toISOString()
		};
	}

	if (resolved.type === 'brand') {
		const brandName = resolved.data.name as string;
		const brandSlug = resolved.data.slug as string;

		const businessesResult = await pool.query(
			`SELECT businessname, description, phonenumber, slug, address, pluscode, state, city, tag, rscore, businessfilled, services
			 FROM businesses_1
			 WHERE LOWER(district) = LOWER($1) AND isvisible = true
			   AND (LOWER(services) LIKE $2 OR LOWER(description) LIKE $2)`,
			[district, `%${brandName.toLowerCase()}%`]
		);

		return {
			pageType: 'brand' as const,
			state,
			stateSlug,
			district,
			districtSlug,
			brandName,
			brandSlug,
			businesses: businessesResult.rows,
			installerCount: businessesResult.rows.length,
			lastUpdated: new Date().toISOString()
		};
	}

	if (resolved.type === 'size') {
		const sizeKw = resolved.data.sizeKw as number;

		const businessesResult = await pool.query(
			`SELECT businessname, description, phonenumber, slug, address, pluscode, state, city, tag, rscore, businessfilled, services
			 FROM businesses_1
			 WHERE LOWER(district) = LOWER($1) AND isvisible = true`,
			[district]
		);

		return {
			pageType: 'size' as const,
			state,
			stateSlug,
			district,
			districtSlug,
			sizeKw,
			businesses: businessesResult.rows,
			installerCount: businessesResult.rows.length,
			lastUpdated: new Date().toISOString()
		};
	}

	error(404, 'Page not found');
};
