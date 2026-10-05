import { db } from '$lib/server/db';
import { businessAccounts, businessProfiles } from '@solar/db/schema';
import { and, count, countDistinct, eq, isNotNull, ne } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

// Same counts as main-app-nextjs `lib/stats.ts` (/in/partners, /about-us):
// installers are active `business_accounts`, cities are distinct cities of
// visible profiles — not the `geo_locations` reference table.
export const load: PageServerLoad = async () => {
	const [installerRows, cityRows] = await Promise.all([
		db.select({ count: count() }).from(businessAccounts).where(eq(businessAccounts.isActive, true)),
		db
			.select({ count: countDistinct(businessProfiles.city) })
			.from(businessProfiles)
			.where(
				and(
					eq(businessProfiles.isvisible, true),
					isNotNull(businessProfiles.city),
					ne(businessProfiles.city, '')
				)
			)
	]);

	return {
		installerCount: installerRows[0].count,
		citiesServed: cityRows[0].count
	};
};
