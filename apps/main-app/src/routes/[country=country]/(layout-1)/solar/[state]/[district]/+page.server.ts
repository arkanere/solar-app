import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { getCountry } from '$lib/countries';
import { resolveLevel2, getCitiesForLevel2 } from '$lib/server/geo';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async ({ params }) => {
	const country = getCountry(params.country);
	const level1Slug = params.state.toLowerCase();
	const level2Slug = params.district.toLowerCase();

	const resolved = await resolveLevel2(country.code, level1Slug, level2Slug);
	if (!resolved) {
		error(404, `${country.levels.level2.singular} not found`);
	}

	const { level1, level2 } = resolved;

	const [businessesResult, projectsResult, cities, subsidyResult, postalResult, leadResult] =
		await Promise.all([
			pool.query(
				`SELECT businessname, description, phonenumber, slug, address, pluscode,
				        level1 as state, city, tag, rscore, businessfilled, services
				 FROM businesses
				 WHERE country_code = $1 AND LOWER(level2) = LOWER($2) AND isvisible = true`,
				[country.code, level2]
			),
			country.features.projects
				? pool.query(
						`SELECT id, business_slug, project_slug, title, pincode, project_date, created_at,
						        image_url, cloudinary_public_id, image_width, image_height, image_format, district
						 FROM projects
						 WHERE LOWER(district) = LOWER($1) AND isvisible = true
						 ORDER BY project_date DESC, created_at DESC
						 LIMIT 6`,
						[level2]
					)
				: Promise.resolve({ rows: [] }),
			getCitiesForLevel2(country.code, level1Slug, level2Slug).then(async (cityRows) => {
				if (cityRows.length === 0) return [];
				const hasBusinessResult = await pool.query(
					`SELECT DISTINCT LOWER(city) as city FROM businesses
					 WHERE country_code = $1 AND LOWER(level2) = LOWER($2) AND isvisible = true`,
					[country.code, level2]
				);
				const citiesWithBusiness = new Set(
					hasBusinessResult.rows.map((r: { city: string }) => r.city)
				);
				return cityRows.map((c) => ({
					name: c.city,
					slug: c.citySlug,
					hasBusiness: citiesWithBusiness.has(c.city.toLowerCase())
				}));
			}),
			country.features.subsidy
				? pool.query(
						`SELECT state_slug, state_name FROM state_subsidies
						 WHERE LOWER(state_name) = LOWER($1) AND status = 'published' LIMIT 1`,
						[level1]
					)
				: Promise.resolve({ rows: [] }),
			country.features.pincodeLookup
				? pool.query(
						`SELECT pincode FROM pincode_mapping WHERE LOWER(district) = LOWER($1) LIMIT 1`,
						[level2]
					)
				: Promise.resolve({ rows: [] }),
			pool.query(
				`SELECT COUNT(*) as count FROM leads WHERE country_code = $1 AND LOWER(level2) = LOWER($2)`,
				[country.code, level2]
			)
		]);

	const businessSlugs = businessesResult.rows.map((b: { slug: string }) => b.slug);
	const businessProjectsMap = new Map();

	if (country.features.projects && businessSlugs.length > 0) {
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

	if (businesses.length === 0) {
		error(404, `No solar installers found in ${level2}, ${level1}`);
	}

	return {
		level1,
		level1Slug,
		level2,
		level2Slug,
		businesses,
		recentProjects: projectsResult.rows,
		cities,
		subsidy: subsidyResult.rows[0] || null,
		postalCode: postalResult.rows[0]?.pincode || null,
		level2LeadCount: parseInt(leadResult.rows[0].count, 10),
		installerCount: businesses.length,
		lastUpdated: new Date().toISOString()
	};
};
