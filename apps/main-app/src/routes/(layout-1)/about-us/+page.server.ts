import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businessProfiles } from '@solar/db/schema';
import { and, countDistinct, eq, isNotNull, ne } from 'drizzle-orm';

export const config = {
	isr: {
		expiration: 1296000
	}
} as const;

// The installer and lead counts come from the parent layout's aboutStats, which
// this page reads through `data`. Only the coverage count is loaded here.
//
// It counts cities that actually have a visible installer — 356 at the time of
// writing. The page used to claim "5,000+ Cities & Towns", which looks like it
// came from geo_locations: a reference table of every city in the country
// (8,043 IN / 20,940 US), not a measure of where anyone can be matched.
export const load: PageServerLoad = async () => {
	const [cityRows] = await db
		.select({ count: countDistinct(businessProfiles.city) })
		.from(businessProfiles)
		.where(
			and(
				eq(businessProfiles.isvisible, true),
				isNotNull(businessProfiles.city),
				ne(businessProfiles.city, '')
			)
		);

	return {
		citiesServed: cityRows.count
	};
};
