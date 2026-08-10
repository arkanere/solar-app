import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businessProfiles as businessesTable, pincodeMapping, projects } from '@solar/db/schema';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import { getCountry } from '$lib/countries';
import { resolveLevel2 } from '$lib/server/geo';
import { resolveLeafSlug } from '$lib/server/slug-resolver';
import { BUSINESS_CARD_SELECTION } from '$lib/server/businesses';
import { PROJECT_CARD_SELECTION, getTopProjectsPerBusiness } from '$lib/server/projects';

export const config = {
	isr: { expiration: 1296000 }
};

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

	const resolved = await resolveLeafSlug(country, slug, level1Slug, level2Slug);
	if (!resolved) {
		error(404, 'Page not found');
	}

	const inLevel2 = and(
		eq(businessesTable.countryCode, country.code),
		sql`LOWER(${businessesTable.level2}) = LOWER(${level2})`,
		eq(businessesTable.isvisible, true)
	);

	if (resolved.type === 'city') {
		const city = resolved.data.city as string;

		const [businessRows, projectRows, postalRows] = await Promise.all([
			db
				.select(BUSINESS_CARD_SELECTION)
				.from(businessesTable)
				.where(and(inLevel2, sql`LOWER(${businessesTable.city}) = LOWER(${city})`)),
			country.features.projects
				? db
						.select(PROJECT_CARD_SELECTION)
						.from(projects)
						.where(
							and(sql`LOWER(${projects.district}) = LOWER(${level2})`, eq(projects.isvisible, true))
						)
						.orderBy(desc(projects.projectDate), desc(projects.createdAt))
						.limit(6)
				: Promise.resolve([]),
			country.features.pincodeLookup
				? db
						.select({ pincode: pincodeMapping.pincode })
						.from(pincodeMapping)
						.where(sql`LOWER(${pincodeMapping.district}) = LOWER(${level2})`)
						.limit(1)
				: Promise.resolve([])
		]);

		// City has no installers of its own: the level2 page is the canonical listing.
		if (businessRows.length === 0) {
			redirect(301, `/${country.code}/solar/${level1Slug}/${level2Slug}`);
		}

		// Attach recent projects per business
		const businessSlugs = businessRows.map((b) => b.slug).filter((s): s is string => s !== null);

		const businessProjectsMap = country.features.projects
			? await getTopProjectsPerBusiness(businessSlugs)
			: new Map();

		const businesses = businessRows
			.map((b) => ({
				...b,
				recent_projects: (b.slug && businessProjectsMap.get(b.slug)) || []
			}))
			.sort((a, b) => {
				if (a.recent_projects.length !== b.recent_projects.length) {
					return b.recent_projects.length - a.recent_projects.length;
				}
				return (b.rscore || 0) - (a.rscore || 0);
			});

		// Fetch sibling cities
		const siblingCityRows = await db
			.selectDistinct({ city: businessesTable.city })
			.from(businessesTable)
			.where(and(inLevel2, sql`LOWER(REPLACE(${businessesTable.city}, ' ', '-')) != ${slug}`))
			.orderBy(asc(businessesTable.city))
			.limit(5);

		const siblingCities = siblingCityRows.map((r) => ({
			name: r.city as string,
			slug: (r.city as string).toLowerCase().replace(/\s+/g, '-')
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
			recentProjects: projectRows,
			postalCode: postalRows[0]?.pincode || null,
			installerCount: businesses.length,
			siblingCities,
			lastUpdated: new Date().toISOString()
		};
	}

	if (resolved.type === 'brand') {
		const brandName = resolved.data.name as string;
		const brandSlug = resolved.data.slug as string;
		const needle = `%${brandName.toLowerCase()}%`;

		const businessRows = await db
			.select(BUSINESS_CARD_SELECTION)
			.from(businessesTable)
			.where(
				and(
					inLevel2,
					sql`(LOWER(${businessesTable.services}::text) LIKE ${needle} OR LOWER(${businessesTable.description}) LIKE ${needle})`
				)
			);

		if (businessRows.length === 0) {
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
			businesses: businessRows,
			installerCount: businessRows.length,
			lastUpdated: new Date().toISOString()
		};
	}

	if (resolved.type === 'size') {
		const sizeKw = resolved.data.sizeKw as number;

		const businessRows = await db
			.select(BUSINESS_CARD_SELECTION)
			.from(businessesTable)
			.where(inLevel2);

		if (businessRows.length === 0) {
			error(404, `No solar installers found in ${level2}`);
		}

		return {
			pageType: 'size' as const,
			level1,
			level1Slug,
			level2,
			level2Slug,
			sizeKw,
			businesses: businessRows,
			installerCount: businessRows.length,
			lastUpdated: new Date().toISOString()
		};
	}

	error(404, 'Page not found');
};
