// Legacy write targets.
//
// Unified `businesses`/`leads`/`business_accounts` are a *projection*, not a
// store: sv_sync_* does `INSERT INTO businesses ... SELECT FROM
// business_profiles ... ON CONFLICT DO UPDATE`, so anything written straight
// to a unified table is clobbered by the next sync. main-app has no unified
// writes anywhere for the same reason. Reads should come from unified; writes
// go to the legacy table and are then projected with the matching
// syncTo*Unified call.
//
// Since migration 054 there is **one** set of legacy tables for every country,
// on the IN structure, discriminated by `country_code`:
//
//   businesses_1 + business_profiles   country_code
//   leaddata                              country_code
//   branches, projects                    keyed by business id, which is
//                                         globally unique, so no discriminator
//
// The us_* tables still exist but are no longer a write target here. 055
// repoints the sv_sync_* 'us' arms at these united tables; the two must ship
// together, because a writer on one side of that pair and a sync on the other
// silently stops projecting (see next-steps.md).
//
// The per-country column renames this module used to paper over
// (gstn/ein, district/county, pincode/zipcode) are gone with the split: 054
// copied the US rows into the IN columns, so the IN names are now the only
// names. `businessFields`/`leadFields` are therefore no longer needed —
// callers write the real column names directly.

import {
	branches,
	businesses1,
	businessProfiles,
	leaddata,
	projects
} from '@solar/db/schema';
import { eq } from 'drizzle-orm';
import type { AuthCountry } from '$lib/auth/business/countryTables';

export const businessTable = businesses1;
export const businessProfileTable = businessProfiles;
export const leadTable = leaddata;
export const branchTable = branches;
export const projectTable = projects;

/**
 * The country predicate for a legacy read/write.
 *
 * Every query that was previously scoped by *choosing a table* must now be
 * scoped by this instead — leaving it off widens the query to both countries,
 * which is the one way this consolidation can go quietly wrong.
 */
export function businessInCountry(country: AuthCountry) {
	return eq(businesses1.countryCode, country);
}

export function leadInCountry(country: AuthCountry) {
	return eq(leaddata.countryCode, country);
}
