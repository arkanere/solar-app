/**
 * The database HTML that every editorial page is made of, and the one thing
 * that has to happen to it before it is rendered.
 *
 * archetype/editorial.md §6: 885 of the 1,020 links inside these bodies point
 * at `/in/<family>/…` for families that have since moved to the country-less
 * root. They were written before that migration and never rewritten; in the
 * SvelteKit app they survive only because hooks.server.ts 301s them. Those
 * 301s are README step 4 and have not come across, so today every one of the
 * 885 is a 404.
 *
 * This is `contentUrl()` run backwards, keyed off the same MOVED_TO_ROOT list,
 * so the two can never disagree: a family that has moved gets its prefix
 * stripped, one that has not is left alone. `/in/get-quotes` is the 135 links
 * that correctly stay country-scoped, and it falls out for free — `get-quotes`
 * is not in the list.
 *
 * It rewrites the links; it does not fix the data. The `UPDATE` over 118 rows
 * is still worth doing (§10 item 5) and this does not preclude it — after the
 * data is fixed this simply stops matching anything.
 */
import { MOVED_TO_ROOT } from '@/lib/countries/moved-content';

/**
 * Matches `href="/xx/<family>"` and `href="/xx/<family>/…"` only. The family
 * is captured and checked against the list rather than being baked into the
 * pattern, so adding a family to MOVED_TO_ROOT is still the only edit needed.
 *
 * Anchored on `href="` so it cannot touch text that merely looks like a path,
 * and the family must be followed by `/` or the closing quote so that a future
 * `/in/toolsomething` is not mistaken for `/in/tools`.
 */
const COUNTRY_PREFIXED_HREF = /href="\/([a-z]{2})\/([a-z0-9-]+)(?=["/])/g;

export function rewriteMovedLinks(html: string): string {
  return html.replace(COUNTRY_PREFIXED_HREF, (whole, _country: string, family: string) =>
    MOVED_TO_ROOT.includes(family) ? `href="/${family}` : whole
  );
}
