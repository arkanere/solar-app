import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { inBusinessProfiles, usBusinesses } from '@solar/db/schema';
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
function latestBusinesses(country: string) {
	if (country === 'us') {
		return db
			.select({
				id: usBusinesses.id,
				businessname: usBusinesses.businessname,
				phonenumber: usBusinesses.phonenumber,
				city: usBusinesses.city,
				state: usBusinesses.state,
				slug: usBusinesses.slug
			})
			.from(usBusinesses)
			.where(and(eq(usBusinesses.isvisible, true), eq(usBusinesses.businessfilled, true)))
			.orderBy(desc(usBusinesses.id))
			.limit(10);
	}

	return db
		.select({
			id: inBusinessProfiles.businessId,
			businessname: inBusinessProfiles.businessname,
			phonenumber: inBusinessProfiles.phonenumber,
			city: inBusinessProfiles.city,
			state: inBusinessProfiles.state,
			slug: inBusinessProfiles.slug
		})
		.from(inBusinessProfiles)
		.where(and(eq(inBusinessProfiles.isvisible, true), eq(inBusinessProfiles.businessfilled, true)))
		.orderBy(desc(inBusinessProfiles.businessId))
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
