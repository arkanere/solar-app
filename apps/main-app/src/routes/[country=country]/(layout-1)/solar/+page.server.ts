import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { getCountry } from '$lib/countries';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async ({ params }) => {
	const country = getCountry(params.country);

	const [level1Result, statsResult] = await Promise.all([
		// covered_level2_count = level2s with at least one visible installer, so the
		// page can show coverage ("12 of 33 districts") against the full geography.
		pool.query(
			`WITH level2s AS (
			   SELECT g.level1, g.level1_slug, g.level2,
			          EXISTS (
			            SELECT 1 FROM businesses b
			            WHERE b.country_code = $1
			              AND LOWER(b.level1) = LOWER(g.level1)
			              AND LOWER(b.level2) = LOWER(g.level2)
			              AND b.isvisible = true
			          ) as covered
			   FROM geo_locations g
			   WHERE g.country_code = $1
			   GROUP BY g.level1, g.level1_slug, g.level2
			 )
			 SELECT level1, level1_slug,
			        COUNT(*) as level2_count,
			        COUNT(*) FILTER (WHERE covered) as covered_level2_count,
			        (SELECT COUNT(*) FROM businesses b
			         WHERE b.country_code = $1
			           AND LOWER(b.level1) = LOWER(level2s.level1) AND b.isvisible = true) as installer_count
			 FROM level2s
			 GROUP BY level1, level1_slug
			 ORDER BY level1 ASC`,
			[country.code]
		),
		pool.query(
			`SELECT COUNT(*) as total_installers FROM businesses WHERE country_code = $1 AND isvisible = true`,
			[country.code]
		)
	]);

	type Level1Row = {
		level1: string;
		level1_slug: string;
		level2_count: string;
		covered_level2_count: string;
		installer_count: string;
	};

	const level1s = level1Result.rows
		.filter((r: Level1Row) => parseInt(r.installer_count) > 0)
		.map((r: Level1Row) => ({
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
		totalInstallers: Number(statsResult.rows[0]?.total_installers || 0),
		level1Count: level1s.length,
		totalLevel1Count: level1Result.rows.length,
		coveredLevel2Count: sum(level1Result.rows, 'covered_level2_count'),
		totalLevel2Count: sum(level1Result.rows, 'level2_count'),
		lastUpdated: new Date().toISOString()
	};
};
