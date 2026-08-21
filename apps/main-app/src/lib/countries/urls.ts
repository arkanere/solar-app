// Single source of truth for country-scoped URL construction. Pages,
// components, the sitemap generator and the redirect layer all build links
// through these helpers so the URL scheme lives in exactly one place.
//
// Scheme: /{country}/solar/{level1}/{level2}/{city}
//         /{country}/installer/{slug}

import type { CountryCode } from './types';
import { MOVED_TO_ROOT } from './moved-content';

// Matches sv_slugify() in migration 042 and the legacy toSlug convention:
// lower-case, whitespace -> hyphen. Existing IN URLs depend on this exact
// behavior — do not "improve" it (no trimming, no diacritic stripping).
export function toSlug(value: string): string {
	return value.toLowerCase().replace(/\s+/g, '-');
}

// The country home is the country-less root. `/in` and `/us` 301 to `/`
// (hooks.server.ts) since the three homepages merged into one thin page, so the
// root path is special-cased here rather than at ~15 breadcrumb call sites —
// same reasoning as contentUrl() below, and it keeps the redirect and the links
// from drifting apart.
//
// Only the bare root collapses. Every deeper path stays country-scoped:
// countryUrl('in', '/get-quotes/') is still '/in/get-quotes/'.
export function countryUrl(country: CountryCode, path = ''): string {
	if (path === '' || path === '/') return '/';
	return `/${country}${path}`;
}

export function geoUrl(
	country: CountryCode,
	level1Slug?: string,
	level2Slug?: string,
	citySlug?: string
): string {
	let url = `/${country}/solar`;
	if (level1Slug) url += `/${level1Slug}`;
	if (level1Slug && level2Slug) url += `/${level2Slug}`;
	if (level1Slug && level2Slug && citySlug) url += `/${citySlug}`;
	return url;
}

export function installerUrl(country: CountryCode, slug: string): string {
	return `/${country}/installer/${slug}`;
}

export function projectUrl(country: CountryCode, slug: string): string {
	return `/${country}/project/${slug}`;
}

// The SEO content families — the 7 pillars, tools, authors, seo-index — are
// moving out from under the country prefix entirely (destination A of
// docs/migration-plan-in-country.md). They move a few families at a time, so this
// is per-family rather than one global prefix: a family that has moved gets a
// country-less href, one that has not still answers on /in.
//
// Pass a path with the leading and trailing slash the caller wants:
// contentUrl('/rooftop-solar/') -> '/in/rooftop-solar/' until stage 7a adds the
// family to MOVED_TO_ROOT, '/rooftop-solar/' after. Adding the family is the only
// edit needed — there is no prefix constant to flip.
export function contentUrl(path = '/'): string {
	const family = path.split('/')[1];
	return MOVED_TO_ROOT.includes(family) ? path : `/in${path}`;
}
