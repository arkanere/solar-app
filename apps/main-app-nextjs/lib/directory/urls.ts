/**
 * Country-scoped URL construction for the directory surface. Ported from
 * apps/main-app/src/lib/countries/urls.ts, trimmed to what the district page
 * needs — the editorial families and their MOVED_TO_ROOT rule come across when
 * those pages do.
 *
 * Scheme: /{country}/solar/{level1}/{level2}/{city}
 *         /{country}/installer/{slug}
 */

export function geoUrl(
  country: string,
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

export function installerUrl(country: string, slug: string): string {
  return `/${country}/installer/${slug}`;
}
