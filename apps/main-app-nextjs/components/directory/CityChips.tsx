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
 * Chips are `nav a`, so globals.css already strips the underline: they are
 * identifiable as interactive by shape and position, which is the exception
 * rule 2 allows.
 */
import { geoUrl } from '@/lib/directory/urls';
import type { CityLink } from '@/lib/directory/types';

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
      <h2 className="text-lg">Cities in {level2}</h2>
      <ul className="mt-md flex flex-wrap gap-xs">
        {linked.map((c) => (
          <li key={c.slug}>
            <a
              href={geoUrl(country, level1Slug, level2Slug, c.slug)}
              className="inline-block rounded-md border border-line bg-surface px-sm py-2xs text-sm text-ink transition-colors duration-fast ease-standard hover:border-line-strong"
            >
              {c.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
