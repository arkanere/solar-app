// 301 shim for legacy US county URLs: /us/county/orange-ca (or bare
// /us/county/orange) -> /us/solar/{state}/{county}. Suffixed slugs resolve via
// the abbreviation map; suffix-less legacy slugs fall back to a geo_locations
// lookup, which is why this is a route handler and not a middleware rule.
//
// Lives under [country] since the /us route tree was dissolved, but stays
// US-only on purpose: this is a legacy *US* URL shape and getStateName() is US
// data. Without the gate an IN request would skip the suffix branch and match a
// US-style slug against Indian rows.
import { movedTo, shimNotFound } from '@/lib/redirects';
import { getStateName } from '@/lib/countries/us-states';
import { findLevel1ForLevel2, findLevel2 } from '@/lib/directory/data';
import { geoUrl, toSlug } from '@/lib/directory/urls';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ country: string; county_slug: string }> }
) {
  const { country, county_slug } = await params;
  if (country !== 'us') return shimNotFound();

  const countySlug = (county_slug ?? '').toLowerCase();
  if (!countySlug) return shimNotFound();

  const target = await resolveTarget(countySlug);
  return target ? movedTo(target, request) : shimNotFound();
}

async function resolveTarget(countySlug: string): Promise<string | null> {
  // A trailing segment of one or two characters is a state abbreviation, not
  // part of the county name.
  const lastHyphen = countySlug.lastIndexOf('-');
  if (lastHyphen !== -1 && countySlug.length - lastHyphen - 1 <= 2) {
    const stateName = getStateName(countySlug.slice(lastHyphen + 1));
    if (stateName) {
      const resolved = await findLevel2('us', toSlug(stateName), countySlug.slice(0, lastHyphen));
      if (resolved) return geoUrl('us', resolved.level1Slug, resolved.level2Slug);
    }
  }

  // No (valid) state suffix — locate the county by slug alone.
  const fallback = await findLevel1ForLevel2('us', countySlug);
  return fallback ? geoUrl('us', fallback.level1Slug, fallback.level2Slug) : null;
}
