/**
 * GET /{cc}/api/getLevel2s?state={name} — the level2 areas (districts in IN,
 * counties in US) of a state.
 *
 * Ported from apps/main-app. It and `getCities` are the two endpoints behind
 * the business form's cascading selects, which is the only reason either
 * exists: the form has to ask the server what is in a state after the reader
 * picks one, and a country's whole geo tree is far too large to ship with the
 * page. (`lib/tools/data.ts` DOES ship the whole IN district tree to the
 * subsidy checker — 700-odd rows, one country, names and counts only. The
 * business form needs cities too, which is 8,043 rows for IN and 20,940 for
 * US, so it asks instead.)
 *
 * **`state` arrives as a display name and is slugified here.** The select's
 * values are the names in `lib/countries/states.ts`, and `geo_locations` is
 * queried on its precomputed slug column. `toSlug` is the same function that
 * built those slugs, so this stays an indexed equality and never a LOWER()
 * scan. A name with no matching slug returns an empty list, not a 404: an
 * empty dropdown is the honest answer for a state the directory has no geo
 * rows for, and the form still submits.
 */
import { isCountry } from '@/lib/countries';
import { getLevel2sForLevel1 } from '@/lib/forms/data';
import { toSlug } from '@/lib/directory/urls';

/**
 * Read-only, but not cacheable as a page is: the query string is the whole
 * input and the response is per-keystroke-ish. Marked dynamic so Next does
 * not try to prerender a route whose params it cannot enumerate.
 */
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ country: string }> }
) {
  const { country } = await params;
  if (!isCountry(country)) {
    return Response.json({ error: 'Unknown country' }, { status: 404 });
  }

  const state = new URL(request.url).searchParams.get('state');
  if (!state) {
    return Response.json({ error: 'state query parameter is required' }, { status: 400 });
  }

  const level2s = await getLevel2sForLevel1(country, toSlug(state));
  return Response.json({ level2s });
}
