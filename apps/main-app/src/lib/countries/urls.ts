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
