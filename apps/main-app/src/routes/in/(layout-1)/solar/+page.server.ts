import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async () => {
	const [statesResult, statsResult] = await Promise.all([
		pool.query(
			`SELECT l.state,
			        COUNT(DISTINCT l.district) as district_count,
			        (SELECT COUNT(*) FROM in_business_profiles b WHERE LOWER(b.state) = LOWER(l.state) AND b.isvisible = true) as installer_count
			 FROM locations l
			 GROUP BY l.state
			 ORDER BY l.state ASC`
		),
		pool.query(
			`SELECT COUNT(*) as total_installers FROM in_business_profiles WHERE isvisible = true`
		)
	]);

	const states = statesResult.rows
		.filter((r: { installer_count: string }) => parseInt(r.installer_count) > 0)
		.map((r: { state: string; district_count: string; installer_count: string }) => ({
			name: r.state,
			slug: r.state.toLowerCase().replace(/\s+/g, '-'),
			districtCount: parseInt(r.district_count),
			installerCount: parseInt(r.installer_count)
		}));

	return {
		states,
		totalInstallers: Number(statsResult.rows[0]?.total_installers || 0),
		stateCount: states.length,
		lastUpdated: new Date().toISOString()
	};
};
