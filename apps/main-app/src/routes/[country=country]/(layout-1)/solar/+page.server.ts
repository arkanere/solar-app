import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { getCountry } from '$lib/countries';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async ({ params }) => {
	const country = getCountry(params.country);

	const [level1Result, statsResult] = await Promise.all([
		pool.query(
			`SELECT g.level1, g.level1_slug,
			        COUNT(DISTINCT g.level2) as level2_count,
			        (SELECT COUNT(*) FROM businesses b
			         WHERE b.country_code = g.country_code
			           AND LOWER(b.level1) = LOWER(g.level1) AND b.isvisible = true) as installer_count
			 FROM geo_locations g
			 WHERE g.country_code = $1
			 GROUP BY g.country_code, g.level1, g.level1_slug
			 ORDER BY g.level1 ASC`,
			[country.code]
		),
		pool.query(
			`SELECT COUNT(*) as total_installers FROM businesses WHERE country_code = $1 AND isvisible = true`,
			[country.code]
		)
	]);

	const level1s = level1Result.rows
		.filter((r: { installer_count: string }) => parseInt(r.installer_count) > 0)
		.map((r: { level1: string; level1_slug: string; level2_count: string; installer_count: string }) => ({
			name: r.level1,
			slug: r.level1_slug,
			level2Count: parseInt(r.level2_count),
			installerCount: parseInt(r.installer_count)
		}));

	return {
		level1s,
		totalInstallers: Number(statsResult.rows[0]?.total_installers || 0),
		level1Count: level1s.length,
		lastUpdated: new Date().toISOString()
	};
};
