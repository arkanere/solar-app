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
// The country tree used to count by country_code here, which is why /in and
// this page showed different numbers (3196 vs 3199). Since 2026-08-21 the
// [country] layout counts platform-wide totals like this one does, so the two
// trees agree; keep the three readers of these counts in step.
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
