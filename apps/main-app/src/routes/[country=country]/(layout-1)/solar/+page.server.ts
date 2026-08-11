import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businessAccounts, businessProfiles } from '@solar/db/schema';
import { accountOfProfile, businessInCountry } from '$lib/server/businessCountry';
import { and, count, eq, sql } from 'drizzle-orm';
import { getCountry } from '$lib/countries';

export const config = {
	isr: { expiration: 1296000 }
};

type Level1Row = {
	level1: string;
	level1_slug: string;
	level2_count: string;
	covered_level2_count: string;
	installer_count: string;
};

export const load: PageServerLoad = async ({ params }) => {
	const country = getCountry(params.country);

	const [level1Result, statsRows] = await Promise.all([
		// covered_level2_count = level2s with at least one visible installer, so the
		// page can show coverage ("12 of 33 districts") against the full geography.
		//
		// A CTE plus COUNT(*) FILTER plus a correlated scalar subquery: kept
		// verbatim on the sql escape hatch rather than rebuilt with $with, since
		// the coverage arithmetic is what the page displays.
		db.execute<Level1Row>(sql`
			WITH level2s AS (
			  SELECT g.level1, g.level1_slug, g.level2,
			         EXISTS (
			           SELECT 1 FROM business_profiles b
			           WHERE b.country_code = ${country.code}
			             AND LOWER(b.level1) = LOWER(g.level1)
			             AND LOWER(b.level2) = LOWER(g.level2)
			             AND b.isvisible = true
			         ) as covered
			  FROM geo_locations g
			  WHERE g.country_code = ${country.code}
			  GROUP BY g.level1, g.level1_slug, g.level2
			)
			SELECT level1, level1_slug,
			       COUNT(*) as level2_count,
			       COUNT(*) FILTER (WHERE covered) as covered_level2_count,
			       (SELECT COUNT(*) FROM business_profiles b
			        WHERE b.country_code = ${country.code}
			          AND LOWER(b.level1) = LOWER(level2s.level1) AND b.isvisible = true) as installer_count
			FROM level2s
			GROUP BY level1, level1_slug
			ORDER BY level1 ASC
		`),
		db
			.select({ total_installers: count() })
			.from(businessProfiles)
			.innerJoin(businessAccounts, accountOfProfile)
			.where(and(businessInCountry(country.code), eq(businessProfiles.isvisible, true)))
	]);

	const level1Rows = level1Result.rows;

	const level1s = level1Rows
		.filter((r) => parseInt(r.installer_count) > 0)
		.map((r) => ({
			name: r.level1,
			slug: r.level1_slug,
			level2Count: parseInt(r.level2_count),
			coveredLevel2Count: parseInt(r.covered_level2_count),
			installerCount: parseInt(r.installer_count)
		}));

	const sum = (rows: Level1Row[], key: 'level2_count' | 'covered_level2_count') =>
		rows.reduce((total, r) => total + parseInt(r[key]), 0);

	return {
		level1s,
		totalInstallers: Number(statsRows[0]?.total_installers || 0),
		level1Count: level1s.length,
		totalLevel1Count: level1Rows.length,
		coveredLevel2Count: sum(level1Rows, 'covered_level2_count'),
		totalLevel2Count: sum(level1Rows, 'level2_count'),
		lastUpdated: new Date().toISOString()
	};
};
