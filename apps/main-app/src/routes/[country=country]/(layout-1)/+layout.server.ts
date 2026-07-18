import type { LayoutServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { getCountry } from '$lib/countries';

export const load: LayoutServerLoad = async ({ params }) => {
	const country = getCountry(params.country);

	const [installerResult, leadResult] = await Promise.all([
		pool.query(
			`SELECT COUNT(*) as count FROM businesses WHERE country_code = $1 AND isvisible = true`,
			[country.code]
		),
		pool.query(`SELECT COUNT(*) as count FROM leads WHERE country_code = $1`, [country.code])
	]);

	return {
		country,
		aboutStats: {
			installerCount: parseInt(installerResult.rows[0].count, 10),
			leadsGenerated: parseInt(leadResult.rows[0].count, 10) + 2000
		}
	};
};
