// Per-country legacy write targets.
//
// Unified `businesses`/`leads`/`business_accounts` are a *projection*, not a
// store: sv_sync_* does `INSERT INTO businesses ... SELECT FROM
// in_business_profiles ... ON CONFLICT DO UPDATE`, so anything written straight
// to a unified table is clobbered by the next sync. main-app has no unified
// writes anywhere for the same reason. Reads should come from unified; writes
// go to the legacy table for the business's country and are then projected with
// the matching syncTo*Unified call.
//
// The two countries are close but not congruent, so this module exposes the
// table pairs plus the three columns that were renamed, rather than pretending
// a single shape exists:
//
//   businesses_1 / us_businesses   gstn->ein, district->county, pincode->zipcode
//                                  and `brands` is IN-only
//   leaddata     / us_leaddata     pin_code->zipcode, district->county
//                                  and 7 IN-only columns (reference_uuid,
//                                  business_notes, qualification_score, the
//                                  four bill_* columns)
//   branches     / us_branches     column-identical
//
// IN additionally splits its profile across businesses_1 + in_business_profiles,
// which US does not have; that asymmetry is why callers writing a business must
// still branch for syncInSplitTables (IN-only) rather than call it blindly.

import {
	branches,
	businesses1,
	leaddata,
	projects,
	usBranches,
	usBusinesses,
	usLeaddata,
	usProjects
} from '@solar/db/schema';
import type { AuthCountry } from '$lib/auth/business/countryTables';

export function businessTable(country: AuthCountry) {
	return country === 'in' ? businesses1 : usBusinesses;
}

export function branchTable(country: AuthCountry) {
	return country === 'in' ? branches : usBranches;
}

export function leadTable(country: AuthCountry) {
	return country === 'in' ? leaddata : usLeaddata;
}

/** projects / us_projects — same shape bar district->county, pincode->zipcode. */
export function projectTable(country: AuthCountry) {
	return country === 'in' ? projects : usProjects;
}

/**
 * The renamed business columns, so a caller can build one values object and let
 * the country decide the keys. Returns Drizzle column objects, usable on either
 * side of a where()/set().
 */
export function businessColumns(country: AuthCountry) {
	const t = businessTable(country);
	return country === 'in'
		? { taxId: businesses1.gstn, level2: businesses1.district, postalCode: businesses1.pincode, table: t }
		: { taxId: usBusinesses.ein, level2: usBusinesses.county, postalCode: usBusinesses.zipcode, table: t };
}

/** The renamed lead columns. `pin_code` on IN, `zipcode` on US. */
export function leadColumns(country: AuthCountry) {
	const t = leadTable(country);
	return country === 'in'
		? { postalCode: leaddata.pinCode, level2: leaddata.district, table: t }
		: { postalCode: usLeaddata.zipcode, level2: usLeaddata.county, table: t };
}

/**
 * Build the country-correct key/value pairs for the three renamed business
 * columns, for use in .values()/.set(). Keys differ per country, so callers
 * spread this rather than writing literal keys.
 */
export function businessFields(
	country: AuthCountry,
	v: { taxId?: string | null; level2?: string | null; postalCode?: string | null }
): Record<string, unknown> {
	return country === 'in'
		? { gstn: v.taxId, district: v.level2, pincode: v.postalCode }
		: { ein: v.taxId, county: v.level2, zipcode: v.postalCode };
}

/** As businessFields, for leaddata/us_leaddata. */
export function leadFields(
	country: AuthCountry,
	v: { level2?: string | null; postalCode?: string | null }
): Record<string, unknown> {
	return country === 'in'
		? { district: v.level2, pinCode: v.postalCode }
		: { county: v.level2, zipcode: v.postalCode };
}
