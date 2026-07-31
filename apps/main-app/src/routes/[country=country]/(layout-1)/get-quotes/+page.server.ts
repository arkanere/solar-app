import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const config = {
	isr: { expiration: false }
};

export const load: PageServerLoad = async () => {
	const [installerResult, projectResult] = await Promise.all([
		pool.query(`SELECT COUNT(*) as count FROM in_business_profiles WHERE isvisible = true`),
		pool.query(`SELECT COUNT(*) as count FROM projects WHERE isvisible = true`)
	]);

	return {
		installerCount: parseInt(installerResult.rows[0].count, 10),
		projectCount: parseInt(projectResult.rows[0].count, 10)
	};
};
