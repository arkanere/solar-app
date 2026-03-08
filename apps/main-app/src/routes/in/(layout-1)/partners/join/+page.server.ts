import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const config = {
	isr: { expiration: false }
};

export const load: PageServerLoad = async () => {
	const [installerResult, cityResult] = await Promise.all([
		pool.query(`SELECT COUNT(*) as count FROM businesses_1 WHERE isvisible = true`),
		pool.query(`SELECT COUNT(DISTINCT city) as count FROM locations`)
	]);

	return {
		installerCount: parseInt(installerResult.rows[0].count, 10),
		citiesServed: parseInt(cityResult.rows[0].count, 10)
	};
};
