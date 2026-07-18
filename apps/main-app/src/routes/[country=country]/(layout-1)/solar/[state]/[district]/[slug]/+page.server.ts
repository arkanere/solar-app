import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import { getCountry } from '$lib/countries';
import { resolveLevel2 } from '$lib/server/geo';
import { resolveLeafSlug } from '$lib/server/slug-resolver';

export const config = {
	isr: { expiration: 1296000 }
};

const BUSINESS_SELECT = `SELECT businessname, description, phonenumber, slug, address, pluscode,
	level1 as state, city, tag, rscore, businessfilled, services
	FROM businesses`;

export const load: PageServerLoad = async ({ params }) => {
	const country = getCountry(params.country);
	const level1Slug = params.state.toLowerCase();
	const level2Slug = params.district.toLowerCase();
	const slug = params.slug.toLowerCase();

	const location = await resolveLevel2(country.code, level1Slug, level2Slug);
	if (!location) {
		error(404, 'Location not found');
	}

	const { level1, level2 } = location;

	const resolved = await resolveLeafSlug(pool, country, slug, level1Slug, level2Slug);
	if (!resolved) {
		error(404, 'Page not found');
	}

	if (resolved.type === 'city') {
		const city = resolved.data.city as string;

		const [businessesResult, projectsResult, postalResult] = await Promise.all([
			pool.query(
				`${BUSINESS_SELECT}
				 WHERE country_code = $1 AND LOWER(level2) = LOWER($2) AND LOWER(city) = LOWER($3) AND isvisible = true`,
				[country.code, level2, city]
			),
			country.features.projects
				? pool.query(
						`SELECT p.id, p.business_slug, p.project_slug, p.title, p.pincode, p.project_date, p.created_at,
						        p.image_url, p.cloudinary_public_id, p.image_width, p.image_height, p.image_format
						 FROM projects p
						 WHERE LOWER(p.district) = LOWER($1) AND p.isvisible = true
						 ORDER BY p.project_date DESC, p.created_at DESC
						 LIMIT 6`,
						[level2]
					)
				: Promise.resolve({ rows: [] }),
			country.features.pincodeLookup
				? pool.query(
						`SELECT pincode FROM pincode_mapping WHERE LOWER(district) = LOWER($1) LIMIT 1`,
						[level2]
					)
				: Promise.resolve({ rows: [] })
		]);

		// City has no installers of its own: the level2 page is the canonical listing.
		if (businessesResult.rows.length === 0) {
			redirect(301, `/${country.code}/solar/${level1Slug}/${level2Slug}`);
		}

		// Attach recent projects per business
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

		// Fetch sibling cities
		const siblingCitiesResult = await pool.query(
			`SELECT DISTINCT city FROM businesses
			 WHERE country_code = $1 AND LOWER(level2) = LOWER($2) AND isvisible = true
			   AND LOWER(REPLACE(city, ' ', '-')) != $3
			 ORDER BY city ASC LIMIT 5`,
			[country.code, level2, slug]
		);

		const siblingCities = siblingCitiesResult.rows.map((r: { city: string }) => ({
			name: r.city,
			slug: r.city.toLowerCase().replace(/\s+/g, '-')
		}));

		return {
			pageType: 'city' as const,
			level1,
			level1Slug,
			level2,
			level2Slug,
			city,
			citySlug: slug,
			businesses,
			recentProjects: projectsResult.rows,
			postalCode: postalResult.rows[0]?.pincode || null,
			installerCount: businesses.length,
			siblingCities,
			lastUpdated: new Date().toISOString()
		};
	}

	if (resolved.type === 'brand') {
		const brandName = resolved.data.name as string;
		const brandSlug = resolved.data.slug as string;

		const businessesResult = await pool.query(
			`${BUSINESS_SELECT}
			 WHERE country_code = $1 AND LOWER(level2) = LOWER($2) AND isvisible = true
			   AND (LOWER(services::text) LIKE $3 OR LOWER(description) LIKE $3)`,
			[country.code, level2, `%${brandName.toLowerCase()}%`]
		);

		if (businessesResult.rows.length === 0) {
			error(404, `No ${brandName} solar installers found in ${level2}`);
		}

		return {
			pageType: 'brand' as const,
			level1,
			level1Slug,
			level2,
			level2Slug,
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
			`${BUSINESS_SELECT}
			 WHERE country_code = $1 AND LOWER(level2) = LOWER($2) AND isvisible = true`,
			[country.code, level2]
		);

		if (businessesResult.rows.length === 0) {
			error(404, `No solar installers found in ${level2}`);
		}

		return {
			pageType: 'size' as const,
			level1,
			level1Slug,
			level2,
			level2Slug,
			sizeKw,
			businesses: businessesResult.rows,
			installerCount: businessesResult.rows.length,
			lastUpdated: new Date().toISOString()
		};
	}

	error(404, 'Page not found');
};
