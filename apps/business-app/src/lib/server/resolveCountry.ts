// Country resolution for the country-less route tree.
//
// Business-app URLs no longer carry an /in or /us prefix, so the country a
// request belongs to is derived from the business itself rather than read off
// the path. Everything downstream (auth, passwordReset, unifiedSync, the
// compliance gate) is already country-parameterized; these two lookups are what
// feed them.

import { db } from '$lib/server/db';
import { businessAccounts, businessProfiles } from '@solar/db/schema';
import { and, eq } from 'drizzle-orm';
import type { AuthCountry } from '$lib/auth/business/countryTables';

function toCountry(code: string | null | undefined): AuthCountry | null {
	// country_code is char(2) and arrives space-padded from some drivers.
	const normalized = code?.trim().toLowerCase();
	return normalized === 'in' || normalized === 'us' ? normalized : null;
}

/**
 * The country of the business owning `slug`, or null when no visible business
 * has that slug.
 *
 * The `isvisible` filter is load-bearing, not a tidiness measure: the sentinel
 * slugs 'incorrect' and '' exist under both country codes in live data (124 IN
 * + 1 US, and 34 IN + 2 US respectively) and are the only slugs that span both
 * countries. All but one are isvisible = false, so filtering on it makes this
 * deterministic for every real slug. Verified against live 2026-08-05.
 *
 * Callers must treat null as 404 rather than falling back to 'in' — a silent
 * default would render an India-shaped dashboard for a mistyped slug.
 */
export async function countryForSlug(slug: string): Promise<AuthCountry | null> {
	if (!slug) return null;

	// Since 079 the country is the account's, so this joins to reach it. That
	// join is also why the isvisible filter above is now doing two jobs: it still
	// disambiguates the sentinel slugs, and it is the only visibility flag on the
	// profile side — the account's is_active is a different question and is
	// deliberately not tested here, because a hidden branch of a live business
	// still has a country.
	const rows = await db
		.select({ countryCode: businessAccounts.countryCode })
		.from(businessProfiles)
		.innerJoin(businessAccounts, eq(businessAccounts.sourceId, businessProfiles.accountBusinessId))
		.where(and(eq(businessProfiles.slug, slug), eq(businessProfiles.isvisible, true)))
		.limit(1);

	return toCountry(rows[0]?.countryCode);
}

/**
 * The country of the account logging in with `email`, or null when no active
 * account has it.
 *
 * /login has no slug in the URL, and TokenManager.getBusinessByEmail is bound
 * to a country at construction, so the country has to be established before the
 * auth service can be built. Callers should map null to the same generic
 * "invalid email or password" failure as a wrong password, so this does not
 * become an account-existence oracle.
 */
export async function countryForLoginEmail(email: string): Promise<AuthCountry | null> {
	if (!email) return null;

	const rows = await db
		.select({ countryCode: businessAccounts.countryCode })
		.from(businessAccounts)
		.where(and(eq(businessAccounts.loginEmail, email), eq(businessAccounts.isActive, true)))
		.limit(1);

	return toCountry(rows[0]?.countryCode);
}
