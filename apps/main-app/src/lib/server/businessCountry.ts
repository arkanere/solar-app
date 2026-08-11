// Country scoping for business_profiles reads.
//
// 079 dropped business_profiles.country_code. A location's country is now its
// account's, reached through account_business_id -> business_accounts.source_id,
// so every query that used to filter `businessProfiles.countryCode` needs a join
// as well as a predicate. These two exports are that join and that predicate,
// kept together so a call site cannot pick up one and forget the other:
//
//   db.select(...)
//     .from(businessProfiles)
//     .innerJoin(businessAccounts, accountOfProfile)
//     .where(and(businessInCountry(country), ...))
//
// This mirrors business-app's `businessInCountry` in $lib/server/writeTargets,
// which does the same job on the same tables.
//
// Two things worth knowing before using them:
//
//   - The join is an INNER join, so a profile with no matching account
//     disappears from the result. 076 verified there are none on live and 079's
//     header re-checks it, but a bulk import that skips business_accounts would
//     silently drop rows from every public listing rather than erroring.
//   - A query that already filters on a specific business_id does NOT need
//     either of these. Business ids are globally unique, so an id predicate
//     scopes to one country by itself, and adding the join only costs a lookup.

import { businessAccounts, businessProfiles } from '@solar/db/schema';
import { eq } from 'drizzle-orm';
import type { CountryCode } from '$lib/countries';

/** Join condition reaching the account that owns a profile's location. */
export const accountOfProfile = eq(
	businessAccounts.sourceId,
	businessProfiles.accountBusinessId
);

/** The country predicate, applied to the joined account. */
export function businessInCountry(country: CountryCode) {
	return eq(businessAccounts.countryCode, country);
}
