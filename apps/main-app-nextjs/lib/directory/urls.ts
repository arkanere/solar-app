/**
 * Country-scoped URL construction for the directory surface. Ported from
 * apps/main-app/src/lib/countries/urls.ts.
 *
 * Scheme: /{country}/solar/{level1}/{level2}/{city}
 *         /{country}/installer/{slug}
 *         /{country}/project/{slug}
 *
 * `contentUrl` and MOVED_TO_ROOT came across with the district page's solar-
 * guides chips (geo-listing.md §5 section 12), which link into the editorial
 * families. `countryUrl` and `toSlug` did not: nothing here builds a country
 * home link or slugifies, and they come with the pages that do.
 */
import { MOVED_TO_ROOT } from '@/lib/countries/moved-content';

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

export function projectUrl(country: string, slug: string): string {
  return `/${country}/project/${slug}`;
}

/**
 * A link into the SEO content families, which are moving out from under the
 * country prefix a few families at a time (destination A of
 * docs/migration-plan-in-country.md). A family that has moved gets a
 * country-less href; one that has not still answers on /in.
 *
 * Pass the leading and trailing slash the caller wants:
 * contentUrl('/rooftop-solar/cost/') -> '/rooftop-solar/cost/' today, because
 * `rooftop-solar` is in MOVED_TO_ROOT.
 *
 * There is no country parameter, and that is not an omission — every one of
 * these families is `features.seoContentFamilies`, which is IN-only, so the
 * unmoved case is always /in. The SvelteKit original is the same.
 */
export function contentUrl(path = '/'): string {
  const family = path.split('/')[1] ?? '';
  return MOVED_TO_ROOT.includes(family) ? path : `/in${path}`;
}
