import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import {
	businessProfiles as businessesTable,
	leaddata,
	pincodeMapping,
	projects,
	stateSubsidies
} from '@solar/db/schema';
import { and, count, desc, eq, sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { getCountry } from '$lib/countries';
import { resolveLevel2, getCitiesForLevel2 } from '$lib/server/geo';
import { BUSINESS_CARD_SELECTION } from '$lib/server/businesses';
import { PROJECT_CARD_SELECTION, getTopProjectsPerBusiness } from '$lib/server/projects';

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

	const inLevel2 = and(
		eq(businessesTable.countryCode, country.code),
		sql`LOWER(${businessesTable.level2}) = LOWER(${level2})`,
		eq(businessesTable.isvisible, true)
	);

	const [businessRows, projectRows, cities, subsidyRows, postalRows, leadRows] = await Promise.all([
		db.select(BUSINESS_CARD_SELECTION).from(businessesTable).where(inLevel2),
		country.features.projects
			? db
					.select({ ...PROJECT_CARD_SELECTION, district: projects.district })
					.from(projects)
					.where(
						and(sql`LOWER(${projects.district}) = LOWER(${level2})`, eq(projects.isvisible, true))
					)
					.orderBy(desc(projects.projectDate), desc(projects.createdAt))
					.limit(6)
			: Promise.resolve([]),
		getCitiesForLevel2(country.code, level1Slug, level2Slug).then(async (cityRows) => {
			if (cityRows.length === 0) return [];
			const cityRowsWithBusiness = await db
				.selectDistinct({ city: sql<string>`LOWER(${businessesTable.city})` })
				.from(businessesTable)
				.where(inLevel2);
			const citiesWithBusiness = new Set(cityRowsWithBusiness.map((r) => r.city));
			return cityRows.map((c) => ({
				name: c.city,
				slug: c.citySlug,
				hasBusiness: citiesWithBusiness.has(c.city.toLowerCase())
			}));
		}),
		country.features.subsidy
			? db
					.select({
						state_slug: stateSubsidies.stateSlug,
						state_name: stateSubsidies.stateName
					})
					.from(stateSubsidies)
					.where(
						and(
							sql`LOWER(${stateSubsidies.stateName}) = LOWER(${level1})`,
							eq(stateSubsidies.status, 'published')
						)
					)
					.limit(1)
			: Promise.resolve([]),
		country.features.pincodeLookup
			? db
					.select({ pincode: pincodeMapping.pincode })
					.from(pincodeMapping)
					.where(sql`LOWER(${pincodeMapping.district}) = LOWER(${level2})`)
					.limit(1)
			: Promise.resolve([]),
		db
			.select({ count: count() })
			.from(leaddata)
			.where(
				and(eq(leaddata.countryCode, country.code), sql`LOWER(${leaddata.level2}) = LOWER(${level2})`)
			)
	]);

	const businessSlugs = businessRows
		.map((b) => b.slug)
		.filter((slug): slug is string => slug !== null);

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

	if (businesses.length === 0) {
		error(404, `No solar installers found in ${level2}, ${level1}`);
	}

	return {
		level1,
		level1Slug,
		level2,
		level2Slug,
		businesses,
		recentProjects: projectRows,
		cities,
		subsidy: subsidyRows[0] || null,
		postalCode: postalRows[0]?.pincode || null,
		level2LeadCount: leadRows[0].count,
		installerCount: businesses.length,
		lastUpdated: new Date().toISOString()
	};
};
