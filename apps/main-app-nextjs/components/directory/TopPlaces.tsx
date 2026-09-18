/**
 * "Where choice is deepest" — the country hub's second way in.
 *
 * DECIDED 2026-09-18. This is in the approved specimen
 * (/specimen/archetypes/geo) but not in the spec's anatomy table, and the
 * specimen's argument is the one that wins: there are two kinds of visitor on
 * this page. One knows their state and scans the grid for it. The other just
 * wants to know whether anywhere near them has real choice, and a 36-card
 * alphabetical grid makes that person read 36 cards to find out.
 *
 * It is a dense two-column list rather than more cards, deliberately. The card
 * grid below is the page; a second grid of cards above it would compete with
 * it and read as two equal offers. A ruled list of name-and-number is lighter
 * than a card and scans faster, which is what a top-eight is for.
 *
 * `TopLevel2[]` is empty where the block would lie — see `getTopLevel2s` in
 * lib/directory/data.ts. On US every covered county has exactly one installer,
 * so "where choice is deepest" would be a heading its own rows disprove. The
 * section then renders nothing rather than rendering a tie.
 *
 * The state name is printed under each district because this block is not
 * scoped to one state, unlike everything else on the page. Without it,
 * "Jasper" is three different counties.
 *
 * **Deliberately NOT wrapped in a `<nav>`**, unlike the card grids on the same
 * page. `nav a` in globals.css strips link colour and underline, on the
 * grounds that navigation and cards are "already identifiable as interactive
 * by position and shape". A card is. A flat two-column list of name-and-number
 * is not — it reads as a data table, and unstyled it looked exactly like one.
 * So these stay ordinary links and take the base styling, which is what the
 * approved specimen renders. The `h2` names the section.
 */
import { geoUrl } from '@/lib/directory/urls';
import type { TopLevel2 } from '@/lib/directory/types';

export function TopPlaces({ places, country }: { places: TopLevel2[]; country: string }) {
  if (places.length === 0) return null;

  return (
    <>
      <h2 className="text-xl">Where choice is deepest</h2>
      <ul className="mt-lg grid gap-x-lg gap-y-sm sm:grid-cols-2 lg:grid-cols-4">
        {places.map((p) => (
          <li
            key={`${p.level1Slug}/${p.slug}`}
            className="flex items-baseline justify-between gap-sm border-b border-line pb-xs"
          >
            <span className="min-w-0">
              <a href={geoUrl(country, p.level1Slug, p.slug)} className="block truncate">
                {p.name}
              </a>
              <span className="block truncate text-xs text-ink-subtle">{p.level1}</span>
            </span>
            <span className="shrink-0 text-sm tabular-nums text-ink-muted">
              {p.installerCount}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
