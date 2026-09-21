/**
 * GET /{cc}/api/getCities?state={name}&level2={name} — the cities of one
 * level2 area. The second half of the business form's cascading selects;
 * `getLevel2s` has the reasoning the pair shares.
 *
 * **Three accepted spellings for the same parameter.** The SvelteKit handler
 * reads `level2`, then `district`, then `county`, because it replaced two
 * country-specific endpoints whose callers each used their own noun. This
 * app's form sends `level2` only, but the aliases are kept: the endpoint is
 * public, the live SvelteKit site is still serving callers that use the old
 * names, and dropping them would make this the one of the two apps that
 * silently returns every city in the state — a missing parameter here is a
 * 400, but a parameter read under the wrong name is a wrong answer.
 */
import { isCountry } from '@/lib/countries';
import { getCitiesForLevel2 } from '@/lib/forms/data';
import { toSlug } from '@/lib/directory/urls';

/** Per-request query string, nothing to prerender. Same as getLevel2s. */
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ country: string }> }
) {
  const { country } = await params;
  if (!isCountry(country)) {
    return Response.json({ error: 'Unknown country' }, { status: 404 });
  }

  const search = new URL(request.url).searchParams;
  const state = search.get('state');
  const level2 = search.get('level2') ?? search.get('district') ?? search.get('county');

  if (!state || !level2) {
    return Response.json(
      { error: 'state and level2 query parameters are required' },
      { status: 400 }
    );
  }

  const cities = await getCitiesForLevel2(country, toSlug(state), toSlug(level2));
  return Response.json({ cities });
}
