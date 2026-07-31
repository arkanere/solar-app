import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const config = {
	isr: { expiration: false }
};

export const load: PageServerLoad = async () => {
	const [locationsResult, installerCountsResult, statsResult, subsidyResult] = await Promise.all([
		pool.query(
			`SELECT DISTINCT state, district FROM locations ORDER BY state, district`
		),
		pool.query(
			`SELECT LOWER(state) as state, LOWER(district) as district, COUNT(*) as cnt
			 FROM in_business_profiles WHERE isvisible = true
			 GROUP BY LOWER(state), LOWER(district)`
		),
		pool.query(
			`SELECT COUNT(*) as total_installers FROM in_business_profiles WHERE isvisible = true`
		),
		pool.query(
			`SELECT state_name, central_subsidy_rate, state_topup_rate
			 FROM state_subsidies
			 WHERE status = 'published'
			 ORDER BY state_name`
		)
	]);

	const countMap = new Map<string, number>();
	for (const r of installerCountsResult.rows) {
		countMap.set(`${r.state}|${r.district}`, Number(r.cnt));
	}

	const districts = locationsResult.rows.map(
		(r: { state: string; district: string }) => ({
			state: r.state,
			district: r.district,
			slug: r.district.toLowerCase().replace(/\s+/g, '-'),
			stateSlug: r.state.toLowerCase().replace(/\s+/g, '-'),
			installerCount: countMap.get(`${r.state.toLowerCase()}|${r.district.toLowerCase()}`) || 0
		})
	);

	return {
		districts,
		totalInstallers: Number(statsResult.rows[0]?.total_installers || 0),
		subsidies: subsidyResult.rows.map(
			(r: { state_name: string; central_subsidy_rate: string; state_topup_rate: string }) => ({
				state: r.state_name,
				centralRate: r.central_subsidy_rate,
				stateTopup: r.state_topup_rate
			})
		)
	};
};
