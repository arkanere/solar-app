// 301 shim for legacy /in/district/{slug} URLs -> /in/solar/{state}/{district}.
//
// This was a page in SvelteKit and a page stub here, but it has never rendered
// anything: the loader resolved the slug and redirected. It is a route handler
// now, so nothing builds a page shell for a response that is always a 301.
//
// IN-only, gated before the lookup: this resolves against Indian geography, so
// without the gate /us/district/{slug} would match a US slug against Indian rows.
import { movedTo, shimNotFound } from '@/lib/redirects';
import { findLevel1ForLevel2 } from '@/lib/directory/data';
import { geoUrl } from '@/lib/directory/urls';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ country: string; district_slug: string }> }
) {
  const { country, district_slug } = await params;
  if (country !== 'in') return shimNotFound();

  const districtSlug = (district_slug ?? '').toLowerCase();
  if (!districtSlug) return shimNotFound();

  // geo_locations carries the precomputed slugs, so this is an exact indexed
  // lookup rather than the LOWER(REPLACE(...)) scan it replaces.
  const resolved = await findLevel1ForLevel2('in', districtSlug);
  if (!resolved) return shimNotFound();

  return movedTo(geoUrl('in', resolved.level1Slug, resolved.level2Slug), request);
}
