// Write targets.
//
// `businesses` and `leads` are a *projection*, not a store: sv_sync_* does
// `INSERT INTO businesses ... SELECT FROM business_profiles ... ON CONFLICT DO
// UPDATE`, so anything written straight to one of them is clobbered by the next
// sync. main-app has no such writes anywhere for the same reason. Reads should
// come from those tables; writes go to the store below and are then projected
// with the matching syncTo*Unified call.
//
// `business_accounts` used to be on that list and no longer is. Migration 062
// archived businesses_1, its source, and made it a store written directly by
// the auth layer — so it is both read and written first-class.
//
// Since migration 054 there is **one** set of tables for every country, on the
// IN structure, discriminated by `country_code`:
//
//   business_accounts                       country_code
//   leaddata                                country_code
//   business_profiles, projects             keyed by business id, which is
//                                           globally unique, so no discriminator
//
// business_profiles moved onto that second line with 079, which dropped its
// country_code: a location's country is its account's, reached through
// account_business_id. `branches` was on that line too until 078 dropped it —
// the main-to-branch edge it held is business_profiles.account_business_id.
//
// The per-country column renames this module used to paper over
// (gstn/ein, district/county, pincode/zipcode) are gone with the split: 054
// copied the US rows into the IN columns, so the IN names are now the only
// names. `businessFields`/`leadFields` are therefore no longer needed —
// callers write the real column names directly. 063 renames them again, to the
// country-neutral set `businesses` carries today.

import { businessAccounts, businessProfiles, leaddata, projects } from '@solar/db/schema';
import { eq } from 'drizzle-orm';
import type { AuthCountry } from '$lib/auth/business/countryTables';

export const businessProfileTable = businessProfiles;
export const leadTable = leaddata;
export const projectTable = projects;

/** Join condition reaching the account that owns a profile's location (075). */
export const accountOfProfile = eq(
	businessAccounts.sourceId,
	businessProfiles.accountBusinessId
);

/**
 * The country predicate for a store read/write.
 *
 * Every query that was previously scoped by *choosing a table* must now be
 * scoped by this instead — leaving it off widens the query to both countries,
 * which is the one way this consolidation can go quietly wrong.
 *
 * Since 079 this reads business_accounts, so a query using it must also
 * `.innerJoin(businessAccounts, accountOfProfile)`.
 *
 * ** Do not drop this just because the query also filters a business_id. ** It
 * looks redundant — ids are globally unique, so one identifies a single row
 * across both countries — but that is not what it is for. In the page loads the
 * id comes from the session and the country from countryForSlug(), which are
 * derived independently and CAN disagree: slugs are duplicated across countries
 * (next-steps.md item 1), so a session for a US business can arrive at a load
 * whose layout resolved 'in'. This predicate is what turns that into "Business
 * not found" instead of quietly serving the US business's dashboard under an IN
 * country. pageCountry.test.ts covers exactly that case, on four loads.
 */
export function businessInCountry(country: AuthCountry) {
	return eq(businessAccounts.countryCode, country);
}

export function leadInCountry(country: AuthCountry) {
	return eq(leaddata.countryCode, country);
}
