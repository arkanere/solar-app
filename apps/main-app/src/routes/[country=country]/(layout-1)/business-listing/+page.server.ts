import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businessProfiles } from '@solar/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { isCountry } from '$lib/countries';

export const config = {
	isr: {
		expiration: 1296000
	}
};

// One query for both countries since migration 063. This function used to be
// two: the US branch read unified `businesses` filtered to country_code='us'
// (replacing the dropped us_businesses) while the IN branch read
// business_profiles, because the two tables carried different column names for
// the same values. 063 gave business_profiles the country-neutral names and 064
// drops `businesses`, so the branches collapse into the query below.
//
// The level2 column (`district` in IN, `county` in US) is deliberately NOT
// selected: the installer cards render only businessname/city/state/phone/slug,
// and the unused district was the one thing that made this page's serialized
// payload differ across the earlier merge.
//
// **The IN branch had no country predicate**, which was a latent bug rather
// than a live one. business_profiles has held both countries since 054, so
// /in/business-listing was entitled to return US rows; it did not only because
// submitBusiness sets `businessfilled = country === 'in'` and the filter below
// excludes them. That is a mask, not a guarantee — flip that default and US
// businesses appear on the Indian listing. Scoping by country_code makes the
// intent explicit and no longer depends on an unrelated column.
function latestBusinesses(country: 'in' | 'us') {
	return db
		.select({
			id: businessProfiles.businessId,
			businessname: businessProfiles.businessname,
			phonenumber: businessProfiles.phonenumber,
			city: businessProfiles.city,
			state: businessProfiles.level1,
			slug: businessProfiles.slug
		})
		.from(businessProfiles)
		.where(
			and(
				eq(businessProfiles.countryCode, country),
				eq(businessProfiles.isvisible, true),
				eq(businessProfiles.businessfilled, true)
			)
		)
		.orderBy(desc(businessProfiles.businessId))
		.limit(10);
}

export const load: PageServerLoad = async ({ params }) => {
	try {
		// The route matcher guarantees this, but the predicate above now depends
		// on it being a real country rather than any string.
		if (!isCountry(params.country)) {
			return { errorMessage: 'Failed to load businesses' };
		}

		const businesses = await latestBusinesses(params.country);

		if (businesses.length > 0) {
			return { businesses };
		} else {
			return { errorMessage: 'No verified businesses found.' };
		}
	} catch (error) {
		console.error('Database query error:', error);
		return { errorMessage: 'Failed to load businesses' };
	}
};
