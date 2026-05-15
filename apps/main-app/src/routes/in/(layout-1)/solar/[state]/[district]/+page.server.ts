import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async ({ params }) => {
	const stateSlug = params.state.toLowerCase();
	const districtSlug = params.district.toLowerCase();

	const locationResult = await pool.query(
		`SELECT DISTINCT state, district FROM locations
		 WHERE LOWER(REPLACE(state, ' ', '-')) = $1
		   AND LOWER(REPLACE(district, ' ', '-')) = $2
		 LIMIT 1`,
		[stateSlug, districtSlug]
	);

	if (locationResult.rows.length === 0) {
		error(404, 'District not found');
	}

	const { state, district } = locationResult.rows[0];

	const [businessesResult, projectsResult, citiesResult, subsidyResult, pincodeResult, nearbyResult] =
		await Promise.all([
			pool.query(
				`SELECT businessname, description, phonenumber, slug, address, pluscode, state, city, tag, rscore, businessfilled, services
				 FROM businesses_1
				 WHERE LOWER(district) = LOWER($1) AND isvisible = true`,
				[district]
			),
			pool.query(
				`SELECT id, business_slug, project_slug, title, pincode, project_date, created_at,
				        image_url, cloudinary_public_id, image_width, image_height, image_format, district
				 FROM projects
				 WHERE LOWER(district) = LOWER($1) AND isvisible = true
				 ORDER BY project_date DESC, created_at DESC
				 LIMIT 6`,
				[district]
			),
			pool.query(
				`SELECT DISTINCT city FROM locations WHERE LOWER(district) = LOWER($1) AND LOWER(state) = LOWER($2) ORDER BY city ASC`,
				[district, state]
			),
			pool.query(
				`SELECT state_slug, state_name FROM state_subsidies
				 WHERE LOWER(state_name) = LOWER($1) AND status = 'published' LIMIT 1`,
				[state]
			),
			pool.query(
				`SELECT pincode FROM pincode_mapping WHERE LOWER(district) = LOWER($1) LIMIT 1`,
				[district]
			),
			pool.query(
				`SELECT DISTINCT l.district,
				        (SELECT COUNT(*) FROM businesses_1 b WHERE LOWER(b.district) = LOWER(l.district) AND b.isvisible = true) as installer_count
				 FROM locations l
				 WHERE LOWER(l.state) = LOWER($1) AND LOWER(l.district) != LOWER($2)
				 ORDER BY l.district ASC`,
				[state, district]
			)
		]);

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
			const aProjects = (a.recent_projects as unknown[]).length;
			const bProjects = (b.recent_projects as unknown[]).length;
			if (aProjects !== bProjects) return bProjects - aProjects;
			return ((b.rscore as number) || 0) - ((a.rscore as number) || 0);
		});

	const cities = citiesResult.rows.map((r: { city: string }) => r.city);
	const nearbyDistricts = nearbyResult.rows
		.filter((r: { installer_count: string }) => parseInt(r.installer_count) > 0)
		.map((r: { district: string; installer_count: string }) => ({
			name: r.district,
			slug: r.district.toLowerCase().replace(/\s+/g, '-'),
			installerCount: parseInt(r.installer_count)
		}));

	if (businesses.length === 0) {
		error(404, `No solar installers found in ${district}, ${state}`);
	}

	return {
		state,
		stateSlug,
		district,
		districtSlug,
		businesses,
		recentProjects: projectsResult.rows,
		cities,
		subsidy: subsidyResult.rows[0] || null,
		postalCode: pincodeResult.rows[0]?.pincode || null,
		nearbyDistricts,
		installerCount: businesses.length,
		lastUpdated: new Date().toISOString()
	};
};
