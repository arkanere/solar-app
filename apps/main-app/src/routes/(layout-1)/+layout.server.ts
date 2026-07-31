import type { LayoutServerLoad } from './$types';
import { pool } from '$lib/server/db';

// Mirrors routes/in/(layout-1)/+layout.server.ts byte for byte. Content pages
// moving to the country-less root (destination A of
// docs/migration-plan-in-country.md) render AboutSolarVipani, which needs these
// counts; without a loader here they silently lost that whole section, social
// links included.
//
// The legacy tables are deliberate, per §3.5: keeping the SQL identical to the
// /in layout's is what makes the numbers on a moved page match the numbers it
// showed before it moved. The unified-table cutover owns switching them.
//
// Nothing under routes/(layout-1)/ is prerendered, so this does not couple a
// build to the DB (§S3); the ISR configs on the legal pages cache the result.
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
