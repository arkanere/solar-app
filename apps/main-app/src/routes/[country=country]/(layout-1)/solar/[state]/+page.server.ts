import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
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

	const [level2sResult, statsResult, subsidyResult, latestProjectResult] = await Promise.all([
		pool.query(
			`SELECT g.level2, g.level2_slug,
			        (SELECT COUNT(*) FROM businesses b
			         WHERE b.country_code = g.country_code
			           AND LOWER(b.level2) = LOWER(g.level2) AND b.isvisible = true) as installer_count
			 FROM geo_locations g
			 WHERE g.country_code = $1 AND g.level1_slug = $2
			 GROUP BY g.country_code, g.level2, g.level2_slug
			 ORDER BY g.level2 ASC`,
			[country.code, level1Slug]
		),
		pool.query(
			`SELECT COUNT(*) as installer_count, MAX(created_at) as latest_installer_added
			 FROM businesses
			 WHERE country_code = $1 AND LOWER(level1) = LOWER($2) AND isvisible = true`,
			[country.code, level1]
		),
		country.features.subsidy
			? pool.query(
					`SELECT state_slug, state_name FROM state_subsidies
					 WHERE LOWER(state_name) = LOWER($1) AND status = 'published' LIMIT 1`,
					[level1]
				)
			: Promise.resolve({ rows: [] }),
		country.features.projects
			? pool.query(
					`SELECT MAX(p.project_date) as latest_project_date
					 FROM projects p
					 JOIN businesses b ON p.business_slug = b.slug AND b.country_code = $1
					 WHERE LOWER(b.level1) = LOWER($2) AND p.isvisible = true`,
					[country.code, level1]
				)
			: Promise.resolve({ rows: [] })
	]);

	const level2s = level2sResult.rows
		.filter((r: { installer_count: string }) => parseInt(r.installer_count) > 0)
		.map((r: { level2: string; level2_slug: string; installer_count: string }) => ({
			name: r.level2,
			slug: r.level2_slug,
			installerCount: parseInt(r.installer_count)
		}));

	const installerCount = Number(statsResult.rows[0]?.installer_count || 0);
	const lastUpdated = mostRecentDate([
		statsResult.rows[0]?.latest_installer_added,
		latestProjectResult.rows[0]?.latest_project_date
	]);

	return {
		level1,
		level1Slug,
		level2s,
		installerCount,
		level2Count: level2s.length,
		subsidy: subsidyResult.rows[0] || null,
		lastUpdated
	};
};
