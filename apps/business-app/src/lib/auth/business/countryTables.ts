// Per-country legacy table names still referenced by the auth layer during
// the phase-2 transition. The unified tables (business_accounts/businesses)
// carry a country_code column instead; only the branches relation and the
// legacy write targets remain forked. Values are trusted constants — never
// user input — so they may be interpolated into SQL.

export type AuthCountry = 'in' | 'us';

export const LEGACY_BUSINESS_TABLE: Record<AuthCountry, string> = {
	in: 'businesses_1',
	us: 'us_businesses'
};

export const BRANCHES_TABLE: Record<AuthCountry, string> = {
	in: 'branches',
	us: 'us_branches'
};
