import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const config = {
	isr: { expiration: false }
};

export const load: PageServerLoad = async () => {
	const [statesResult, statsResult] = await Promise.all([
		pool.query(
			`SELECT state_slug, state_name, central_subsidy_rate, state_topup_rate, eligibility
			 FROM state_subsidies
			 WHERE status = 'published'
			 ORDER BY state_name`
		),
		pool.query(
			`SELECT COUNT(*) as total_installers FROM businesses_1 WHERE isvisible = true`
		)
	]);

	return {
		states: statesResult.rows.map(
			(r: {
				state_slug: string;
				state_name: string;
				central_subsidy_rate: string;
				state_topup_rate: string;
				eligibility: string;
			}) => ({
				slug: r.state_slug,
				name: r.state_name,
				centralRate: r.central_subsidy_rate,
				stateTopup: r.state_topup_rate,
				eligibility: r.eligibility
			})
		),
		totalInstallers: Number(statsResult.rows[0]?.total_installers || 0)
	};
};
