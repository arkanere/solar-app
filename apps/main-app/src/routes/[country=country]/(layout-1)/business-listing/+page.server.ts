import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businesses, businessProfiles } from '@solar/db/schema';
import { and, desc, eq } from 'drizzle-orm';

export const config = {
	isr: {
		expiration: 1296000
	}
};

// Per-country legacy tables, per §3.4 of docs/migration-plan-delete-us.md: no
// data migration and no table switch here — de-countrying these reads belongs
// to the write cutover in docs/country-scalable-architecture.md.
//
// The level2 column (`district` in IN, `county` in US) is deliberately NOT
// selected: the installer cards render only businessname/city/state/phone/slug,
// and the IN query's unused `district` was the one thing that made this page's
// serialized payload differ across the merge. Both branches now return the
// same shape without needing an alias.
//
// The two table-name-keyed SQL strings became two Drizzle queries, continuing
// the per-country-tables approach from Phases 2 and 5. The IN table keys the
// business on `business_id`, the US one on `id`; both are aliased to `id`.
//
// The US branch reads the **unified** `businesses` table filtered to
// country_code='us', replacing the dropped `us_businesses`. Per the read
// unified / write legacy rule, a page load reads unified. The unified column
// names are country-neutral, so `state` comes from `level1` and the legacy row
// id from `source_id`; all 12 US rows matched `us_businesses` field-for-field
// on every column selected here, and the query returns an identical result set.
function latestBusinesses(country: string) {
	if (country === 'us') {
		return db
			.select({
				id: businesses.sourceId,
				businessname: businesses.businessname,
				phonenumber: businesses.phonenumber,
				city: businesses.city,
				state: businesses.level1,
				slug: businesses.slug
			})
			.from(businesses)
			.where(
				and(
					eq(businesses.countryCode, 'us'),
					eq(businesses.isvisible, true),
					eq(businesses.businessfilled, true)
				)
			)
			.orderBy(desc(businesses.sourceId))
			.limit(10);
	}

	return db
		.select({
			id: businessProfiles.businessId,
			businessname: businessProfiles.businessname,
			phonenumber: businessProfiles.phonenumber,
			city: businessProfiles.city,
			state: businessProfiles.state,
			slug: businessProfiles.slug
		})
		.from(businessProfiles)
		.where(and(eq(businessProfiles.isvisible, true), eq(businessProfiles.businessfilled, true)))
		.orderBy(desc(businessProfiles.businessId))
		.limit(10);
}

export const load: PageServerLoad = async ({ params }) => {
	try {
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
