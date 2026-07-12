import type { LayoutServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const load: LayoutServerLoad = async () => {
	const [installerResult, leadResult] = await Promise.all([
		pool.query(`SELECT COUNT(*) as count FROM in_business_profiles WHERE isvisible = true`),
		pool.query(`SELECT COUNT(*) as count FROM LeadData`)
	]);

	return {
		aboutStats: {
			installerCount: parseInt(installerResult.rows[0].count, 10),
			leadsGenerated: parseInt(leadResult.rows[0].count, 10) + 2000
		}
	};
};
