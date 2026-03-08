import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const config = {
	isr: { expiration: false }
};

export const load: PageServerLoad = async () => {
	const [districtsResult, statsResult, subsidyResult] = await Promise.all([
		pool.query(
			`SELECT DISTINCT l.state, l.district,
			        (SELECT COUNT(*) FROM businesses_1 b
			         WHERE LOWER(b.district) = LOWER(l.district)
			         AND LOWER(b.state) = LOWER(l.state)
			         AND b.isvisible = true) as installer_count
			 FROM locations l
			 ORDER BY l.state, l.district`
		),
		pool.query(
			`SELECT COUNT(*) as total_installers FROM businesses_1 WHERE isvisible = true`
		),
		pool.query(
			`SELECT state_name, central_subsidy_rate, state_topup_rate
			 FROM state_subsidies
			 WHERE status = 'published'
			 ORDER BY state_name`
		)
	]);

	const districts = districtsResult.rows.map(
		(r: { state: string; district: string; installer_count: string }) => ({
			state: r.state,
			district: r.district,
			slug: r.district.toLowerCase().replace(/\s+/g, '-'),
			stateSlug: r.state.toLowerCase().replace(/\s+/g, '-'),
			installerCount: parseInt(r.installer_count)
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
