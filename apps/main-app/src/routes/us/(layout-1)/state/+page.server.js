import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

export const config = {
	isr: { expiration: 1296000 }
};

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const pool = createPool({ connectionString: POSTGRES_URL });

	const [statesResult, statsResult] = await Promise.all([
		pool.query(
			`SELECT l.state,
			        COUNT(DISTINCT l.county) as county_count,
			        (SELECT COUNT(*) FROM us_businesses b WHERE b.state = l.state AND b.isvisible = true) as installer_count
			 FROM us_locations l
			 GROUP BY l.state
			 ORDER BY l.state ASC`
		),
		pool.query(
			`SELECT COUNT(*) as total_installers FROM us_businesses WHERE isvisible = true`
		)
	]);

	const states = statesResult.rows
		.filter((r) => parseInt(r.installer_count) > 0)
		.map((r) => ({
			name: r.state,
			slug: r.state.toLowerCase().replace(/\s+/g, '-'),
			countyCount: parseInt(r.county_count),
			installerCount: parseInt(r.installer_count)
		}));

	return {
		states,
		totalInstallers: Number(statsResult.rows[0]?.total_installers || 0),
		stateCount: states.length
	};
}
