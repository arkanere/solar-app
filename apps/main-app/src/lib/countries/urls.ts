// Single source of truth for country-scoped URL construction. Pages,
// components, the sitemap generator and the redirect layer all build links
// through these helpers so the URL scheme lives in exactly one place.
//
// Scheme: /{country}/solar/{level1}/{level2}/{city}
//         /{country}/installer/{slug}

import type { CountryCode } from './types';

// Matches sv_slugify() in migration 042 and the legacy toSlug convention:
// lower-case, whitespace -> hyphen. Existing IN URLs depend on this exact
// behavior — do not "improve" it (no trimming, no diacritic stripping).
export function toSlug(value: string): string {
	return value.toLowerCase().replace(/\s+/g, '-');
}

export function countryUrl(country: CountryCode, path = ''): string {
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
// docs/migration-plan-in-country.md). They still answer on /in until stage 7
// moves the routes; flipping CONTENT_PREFIX to '' there moves every link with
// them. Pass a path with the leading and trailing slash the caller wants:
// contentUrl('/rooftop-solar/') -> '/in/rooftop-solar/' today, '/rooftop-solar/'
// after.
const CONTENT_PREFIX = '/in';

export function contentUrl(path = '/'): string {
	return `${CONTENT_PREFIX}${path}`;
}
