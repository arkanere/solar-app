import { error } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

export const config = {
	isr: { expiration: 1296000 }
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const stateSlug = params.state_slug;

	let stateName = '';
	if (stateSlug.startsWith('solar-panel-installers-in-')) {
		stateName = stateSlug.replace('solar-panel-installers-in-', '');
	} else {
		stateName = stateSlug;
	}

	if (!stateName) {
		error(404, 'Invalid state URL');
	}

	const stateFormatted = stateName
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

	const pool = createPool({ connectionString: POSTGRES_URL });

	const [stateCheck, countiesResult, statsResult] = await Promise.all([
		pool.query(
			`SELECT DISTINCT state FROM us_locations
			 WHERE LOWER(state) = LOWER($1) LIMIT 1`,
			[stateFormatted]
		),
		pool.query(
			`SELECT DISTINCT l.county,
			        (SELECT COUNT(*) FROM us_businesses b WHERE LOWER(b.county) = LOWER(l.county) AND b.state = l.state AND b.isvisible = true) as installer_count
			 FROM us_locations l
			 WHERE LOWER(l.state) = LOWER($1)
			 ORDER BY l.county ASC`,
			[stateFormatted]
		),
		pool.query(
			`SELECT COUNT(*) as installer_count
			 FROM us_businesses
			 WHERE LOWER(state) = LOWER($1) AND isvisible = true`,
			[stateFormatted]
		)
	]);

	if (stateCheck.rows.length === 0) {
		error(404, `State "${stateFormatted}" not found`);
	}

	const state = stateCheck.rows[0].state;

	const counties = countiesResult.rows
		.filter((r) => parseInt(r.installer_count) > 0)
		.map((r) => ({
			name: r.county,
			slug: r.county.toLowerCase().replace(/\s+/g, '-'),
			installerCount: parseInt(r.installer_count)
		}));

	return {
		state,
		counties,
		installerCount: Number(statsResult.rows[0]?.installer_count || 0),
		countyCount: counties.length
	};
}
