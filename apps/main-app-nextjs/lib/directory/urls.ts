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
 * families. `countryUrl` did not: nothing here builds a country home link, and
 * it comes with the page that does. `toSlug` arrived later, with the legacy US
 * redirect shims — they turn a state name back into the slug the geo rows carry.
 */
import { MOVED_TO_ROOT } from '@/lib/countries/moved-content';

/** The slug form geo_locations stores: lower-cased, spaces to hyphens. */
export function toSlug(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-');
}

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
 * `business_profiles.google_maps_link` normalised into an absolute URL.
 *
 * This is a real bug fix carried across from the SvelteKit page, not a tidy-up
 * (installer-profile.md §8). The column sometimes holds a bare place name
 * ("Trichy") or a plus code rather than a URL, and a value with no scheme is a
 * RELATIVE link — it resolves against /{cc}/installer/{slug} and sends the
 * reader to a 404 instead of a map. So anything that is not already absolute
 * becomes a Maps search for the value plus the city and state, which is the
 * only interpretation of "Trichy" that can work.
 *
 * Present on 31 of 646 visible IN profiles as of 2026-09-18, so it is genuinely
 * optional — note that is well under the 15.2% archetype/data.md records.
 */
export function mapsUrl(raw: string | null, city: string, state: string): string | null {
  const value = raw?.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  const query = [value, city, state].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * `business_profiles.instagram_id` as a link plus the handle to print.
 *
 * Nothing has ever rendered this column, so nothing has ever normalised it,
 * and the ten rows that carry a value hold four different shapes:
 * `@hamsolarpower`, `/solar.vipani/`, `uresquare.solar` and a full profile
 * URL. All four are the same handle written differently, so they are reduced
 * to one and re-formed — a bare handle in an href would resolve against the
 * installer path, exactly as `mapsUrl` above guards against.
 *
 * A stored URL is trusted as-is for the href, but the handle is still read out
 * of it, so the page prints `@name` in every case instead of a raw URL.
 */
export function instagram(raw: string | null): { href: string; handle: string } | null {
  const value = raw?.trim();
  if (!value) return null;

  if (/^https?:\/\//i.test(value)) {
    const path = value.replace(/^https?:\/\/[^/]+\//i, '').split(/[/?#]/)[0] ?? '';
    return path ? { href: value, handle: `@${path}` } : null;
  }

  const handle = value.replace(/^@/, '').replace(/^\/+|\/+$/g, '').trim();
  if (!handle) return null;
  return { href: `https://www.instagram.com/${handle}/`, handle: `@${handle}` };
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
