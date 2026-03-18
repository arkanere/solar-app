import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const config = {
	isr: { expiration: 604800 }
};

export const load: PageServerLoad = async () => {
	const [installerResult, projectResult, cityResult, leadResult, recentBusinesses] =
		await Promise.all([
			pool.query(`SELECT COUNT(*) as count FROM businesses_1 WHERE isvisible = true`),
			pool.query(`SELECT COUNT(*) as count FROM projects WHERE isvisible = true`),
			pool.query(`SELECT COUNT(DISTINCT city) as count FROM locations`),
			pool.query(`SELECT COUNT(*) as count FROM LeadData`),
			pool.query(
				`SELECT id, businessname, phonenumber, city, state, slug
			 FROM businesses_1
			 WHERE isvisible = true AND businessfilled = true
			 ORDER BY id DESC LIMIT 9`
			)
		]);

	return {
		installerCount: parseInt(installerResult.rows[0].count, 10),
		projectsCompleted: parseInt(projectResult.rows[0].count, 10),
		citiesServed: parseInt(cityResult.rows[0].count, 10),
		leadsGenerated: parseInt(leadResult.rows[0].count, 10) + 2000,
		businesses: recentBusinesses.rows
	};
};
