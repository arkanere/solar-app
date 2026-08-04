import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businesses, geoLocations, projects, stateSubsidies } from '@solar/db/schema';
import { and, asc, count, eq, max, sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { mostRecentDate } from '$lib/server/format';
import { getCountry } from '$lib/countries';
import { resolveLevel1 } from '$lib/server/geo';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async ({ params }) => {
	const country = getCountry(params.country);
	const level1Slug = params.state.toLowerCase();

	const resolved = await resolveLevel1(country.code, level1Slug);
	if (!resolved) {
		error(404, `${country.levels.level1.singular} not found`);
	}
	const level1 = resolved.level1;

	const [level2Rows, statsRows, subsidyRows, latestProjectRows] = await Promise.all([
		db
			.select({
				level2: geoLocations.level2,
				level2_slug: geoLocations.level2Slug,
				// level1 is part of the match because level2 names repeat across level1s
				// (e.g. "Washington County" in many US states). The correlated scalar
				// subquery needs its own alias for `businesses` and compares LOWER() on
				// both sides, so it stays on the sql escape hatch.
				installer_count: sql<string>`(SELECT COUNT(*) FROM businesses b
			         WHERE b.country_code = ${geoLocations.countryCode}
			           AND LOWER(b.level1) = LOWER(${level1})
			           AND LOWER(b.level2) = LOWER(${geoLocations.level2}) AND b.isvisible = true)`
			})
			.from(geoLocations)
			.where(
				and(eq(geoLocations.countryCode, country.code), eq(geoLocations.level1Slug, level1Slug))
			)
			.groupBy(geoLocations.countryCode, geoLocations.level2, geoLocations.level2Slug)
			.orderBy(asc(geoLocations.level2)),
		db
			.select({
				installer_count: count(),
				latest_installer_added: max(businesses.createdAt)
			})
			.from(businesses)
			.where(
				and(
					eq(businesses.countryCode, country.code),
					sql`LOWER(${businesses.level1}) = LOWER(${level1})`,
					eq(businesses.isvisible, true)
				)
			),
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
		country.features.projects
			? db
					.select({ latest_project_date: max(projects.projectDate) })
					.from(projects)
					.innerJoin(
						businesses,
						and(
							eq(projects.businessSlug, businesses.slug),
							eq(businesses.countryCode, country.code)
						)
					)
					.where(
						and(sql`LOWER(${businesses.level1}) = LOWER(${level1})`, eq(projects.isvisible, true))
					)
			: Promise.resolve([])
	]);

	const level2s = level2Rows
		.filter((r) => parseInt(r.installer_count) > 0)
		.map((r) => ({
			name: r.level2,
			slug: r.level2_slug,
			installerCount: parseInt(r.installer_count)
		}));

	const installerCount = Number(statsRows[0]?.installer_count || 0);
	const lastUpdated = mostRecentDate([
		statsRows[0]?.latest_installer_added,
		latestProjectRows[0]?.latest_project_date
	]);

	return {
		level1,
		level1Slug,
		level2s,
		installerCount,
		level2Count: level2s.length,
		totalLevel2Count: level2Rows.length,
		subsidy: subsidyRows[0] || null,
		lastUpdated
	};
};
