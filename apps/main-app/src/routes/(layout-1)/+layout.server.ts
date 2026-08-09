import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businessProfiles, leaddata } from '@solar/db/schema';
import { count, eq } from 'drizzle-orm';

// Content pages at the country-less root (destination A of
// docs/migration-plan-in-country.md) render AboutSolarVipani, which needs these
// counts; without a loader here they silently lost that whole section, social
// links included.
//
// This was originally a byte-for-byte copy of routes/in/(layout-1)/+layout.server.ts,
// which stage 14 deleted along with the rest of routes/in/. Keeping the SQL
// identical to that file's is what made the numbers on a moved page match the
// numbers it showed before it moved.
//
// **This is now the only legacy-table reader of these counts.** The country tree
// counts unified businesses/leads by country_code instead, which is why /in shows
// 3196 where this shows 3199 (§8 — expected, not a bug). The unified-table
// cutover owns switching this one over; when it does, the two trees agree again.
//
// Nothing anywhere in the app is prerendered any more (stage 10 of
// docs/migration-plan-delete-us.md), so this cannot couple a build to the DB;
// the ISR configs on the pages under this layout cache the result.
export const load: LayoutServerLoad = async () => {
	const [installerRows, leadRows] = await Promise.all([
		db
			.select({ count: count() })
			.from(businessProfiles)
			.where(eq(businessProfiles.isvisible, true)),
		db.select({ count: count() }).from(leaddata)
	]);

	return {
		aboutStats: {
			installerCount: installerRows[0].count,
			leadsGenerated: leadRows[0].count + 2000
		}
	};
};
