// Cross-app links into main-app.
//
// business-app's own URLs lost their country segment in Phase 7 step C — the
// `[business_slug]` already implies a country, so `/in/${slug}/crm` became
// `/${slug}/crm`. **main-app did not change**: its routes still live under
// `[country=country]`, so every link that leaves this app still needs one.
//
// The trap this module exists to close: a link written inside a file that used
// to live under `routes/in/` reads as "obviously India", but after the move the
// same file serves US businesses too. Hardcoding `/in/` there sends every US
// customer to an India profile URL. Take the *resolved* country instead —
// `countryForSlug()` on the server, or the `country` field the
// `[business_slug]` layout puts in page data.
//
// This is not server-only: components import it.

import type { AuthCountry } from '$lib/auth/business/countryTables';

const MAIN_APP_ORIGIN = 'https://solarvipani.com';

/**
 * A business's public profile page on main-app.
 *
 * `/{country}/installer/{slug}` is the canonical form for **both** countries.
 * `/us/solar-panel-installer/{slug}` also resolves, but only as a legacy 301
 * in main-app's `hooks.server.ts`, and there is no matching `/in` rule — so the
 * `/in/solar-panel-installer/...` links this replaced were burning a hop at
 * best and 404ing at worst.
 */
export function installerProfileUrl(country: AuthCountry, slug: string): string {
	return `${MAIN_APP_ORIGIN}/${country}/installer/${slug}`;
}
