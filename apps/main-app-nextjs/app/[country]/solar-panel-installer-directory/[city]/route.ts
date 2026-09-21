// 301 shim for legacy US city directory URLs:
// /us/solar-panel-installer-directory/anaheim-ca (or a bare city slug) ->
// /us/solar/{state}/{county}/{city}. Needs a geo_locations lookup in every
// branch, because the old URL never carried the county.
//
// US-only for the same reason as the sibling county shim — see the comment there.
import { movedTo, shimNotFound } from '@/lib/redirects';
import { getStateName } from '@/lib/countries/us-states';
import { findCity } from '@/lib/directory/data';
import { geoUrl, toSlug } from '@/lib/directory/urls';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ country: string; city: string }> }
) {
  const { country, city } = await params;
  if (country !== 'us') return shimNotFound();

  const citySlug = (city ?? '').toLowerCase();
  if (!citySlug) return shimNotFound();

  const target = await resolveTarget(citySlug);
  return target ? movedTo(target, request) : shimNotFound();
}

async function resolveTarget(citySlug: string): Promise<string | null> {
  // A trailing segment of one or two characters is a state abbreviation, not
  // part of the city name.
  const lastHyphen = citySlug.lastIndexOf('-');
  if (lastHyphen !== -1 && citySlug.length - lastHyphen - 1 <= 2) {
    const stateName = getStateName(citySlug.slice(lastHyphen + 1));
    if (stateName) {
      const resolved = await findCity('us', citySlug.slice(0, lastHyphen), toSlug(stateName));
      if (resolved) {
        return geoUrl('us', resolved.level1Slug, resolved.level2Slug, resolved.citySlug);
      }
    }
  }

  // No (valid) state suffix — first match on the bare city slug.
  const fallback = await findCity('us', citySlug);
  return fallback
    ? geoUrl('us', fallback.level1Slug, fallback.level2Slug, fallback.citySlug)
    : null;
}
