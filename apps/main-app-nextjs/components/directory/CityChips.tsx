/**
 * Cities within the district that have their own page.
 *
 * DECIDED: only linked cities render. geo-listing.md §6 measured the old row —
 * a typical district page showed nine chips of which one was a link, the other
 * eight being grey spans styled identically to it. That broke colour rule 2
 * (only interactive things carry `action`), and it advertised coverage the site
 * does not have.
 *
 * Dropping the inert spans takes p50 from 9 chips to 1, and on a district with
 * nothing to link to the section disappears entirely — which is the honest
 * outcome for a page with no onward navigation, not a gap to fill.
 *
 * The chips themselves are ChipList, shared with the two IN-only chip rows.
 * What stays here is the `<nav>` and the filter — this is the one chip row on
 * the page that is genuinely navigation down, and the one that had a decision
 * to make about what to show.
 */
import { geoUrl } from '@/lib/directory/urls';
import type { CityLink } from '@/lib/directory/types';
import { ChipList } from './ChipList';

export function CityChips({
  cities,
  country,
  level1Slug,
  level2Slug,
  level2
}: {
  cities: CityLink[];
  country: string;
  level1Slug: string;
  level2Slug: string;
  level2: string;
}) {
  const linked = cities.filter((c) => c.linked);
  if (linked.length === 0) return null;

  return (
    <nav aria-label={`Cities in ${level2}`}>
      <ChipList
        heading={`Cities in ${level2}`}
        chips={linked.map((c) => ({
          label: c.name,
          href: geoUrl(country, level1Slug, level2Slug, c.slug)
        }))}
      />
    </nav>
  );
}
