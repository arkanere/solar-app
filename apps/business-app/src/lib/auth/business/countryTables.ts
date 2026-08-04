// The unified tables (business_accounts/businesses) carry a country_code
// column; only the branches relation and the legacy write targets remain
// forked per country. Since the Drizzle conversion the auth layer picks the
// per-country Drizzle table objects directly, so the old table-name string
// maps are gone.

export type AuthCountry = 'in' | 'us';
