import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { mostRecentDate } from '$lib/server/format';

export const config = {
	isr: { expiration: 604800 }
};

export const load: PageServerLoad = async ({ params }) => {
	const stateSlug = params.state.toLowerCase();

	const stateResult = await pool.query(
		`SELECT DISTINCT state FROM locations
		 WHERE LOWER(REPLACE(state, ' ', '-')) = $1
		 LIMIT 1`,
		[stateSlug]
	);

	if (stateResult.rows.length === 0) {
		error(404, 'State not found');
	}

	const state = stateResult.rows[0].state;

	const [districtsResult, statsResult, subsidyResult, latestProjectResult] = await Promise.all([
		pool.query(
			`SELECT DISTINCT l.district,
			        (SELECT COUNT(*) FROM businesses_1 b WHERE LOWER(b.district) = LOWER(l.district) AND b.isvisible = true) as installer_count
			 FROM locations l
			 WHERE LOWER(l.state) = LOWER($1)
			 ORDER BY l.district ASC`,
			[state]
		),
		pool.query(
			`SELECT COUNT(*) as installer_count, MAX(created_at) as latest_installer_added
			 FROM businesses_1
			 WHERE LOWER(state) = LOWER($1) AND isvisible = true`,
			[state]
		),
		pool.query(
			`SELECT state_slug, state_name FROM state_subsidies
			 WHERE LOWER(state_name) = LOWER($1) AND status = 'published' LIMIT 1`,
			[state]
		),
		pool.query(
			`SELECT MAX(p.project_date) as latest_project_date
			 FROM projects p
			 JOIN businesses_1 b ON p.business_slug = b.slug
			 WHERE LOWER(b.state) = LOWER($1) AND p.isvisible = true`,
			[state]
		)
	]);

	const districts = districtsResult.rows
		.filter((r: { installer_count: string }) => parseInt(r.installer_count) > 0)
		.map((r: { district: string; installer_count: string }) => ({
			name: r.district,
			slug: r.district.toLowerCase().replace(/\s+/g, '-'),
			installerCount: parseInt(r.installer_count)
		}));

	const installerCount = Number(statsResult.rows[0]?.installer_count || 0);
	const lastUpdated = mostRecentDate([
		statsResult.rows[0]?.latest_installer_added,
		latestProjectResult.rows[0]?.latest_project_date
	]);

	return {
		state,
		stateSlug,
		districts,
		installerCount,
		districtCount: districts.length,
		subsidy: subsidyResult.rows[0] || null,
		lastUpdated
	};
};
