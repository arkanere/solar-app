/**
 * A row of linked chips, with the heading that says what they are.
 *
 * geo-listing.md §6 found three chip rows on the district page — editorial
 * cross-links (§5 section 12), navigation down (15) and navigation sideways
 * (16) — rendered by three copies of the same markup and therefore visually
 * identical while meaning three different things.
 *
 * DECIDED: they stay three sections, and the heading is what distinguishes
 * them. So the markup is unified here and the labelling is the caller's job.
 * The alternative considered was folding them into one "related" block, which
 * would have removed the ambiguity by removing the distinction — but "guides
 * to read" and "places to go next" are genuinely different offers, and one
 * box asserting otherwise is not clearer, only shorter.
 *
 * Every chip is a link but one: archetype/editorial.md §8 puts the same
 * sibling list on all 110 cluster articles and keeps the current page in it,
 * marked and not linked, because that is what tells the reader where they
 * are in a 22-item set. `currentHref` is that one chip, and the directory
 * surface passes nothing — the section that had inert chips there, cities,
 * dropped them (see CityChips).
 *
 * `data-unstyled` rather than relying on the `nav a` rule in globals.css: two
 * of the three callers are not navigation, and a chip is identifiable as
 * interactive by shape and position, which is the exception rule 2 allows.
 */

export type Chip = {
  label: string;
  href: string;
};

export function ChipList({
  heading,
  chips,
  currentHref
}: {
  heading: string;
  chips: Chip[];
  /** The chip for the page this list is on: rendered inert and marked. */
  currentHref?: string;
}) {
  if (chips.length === 0) return null;

  return (
    <>
      <h2 className="text-lg">{heading}</h2>
      <ul className="mt-md flex flex-wrap gap-xs">
        {chips.map((c) =>
          c.href === currentHref ? (
            // `aria-current` rather than a visual marker alone: the stronger
            // border says "you are here" to a reader and nothing to a screen
            // reader.
            <li key={c.href}>
              <span
                aria-current="page"
                className="inline-block rounded-md border border-line-strong bg-surface-sunken px-sm py-2xs text-sm font-semibold text-ink"
              >
                {c.label}
              </span>
            </li>
          ) : (
            <li key={c.href}>
              <a
                href={c.href}
                data-unstyled
                className="inline-block rounded-md border border-line bg-surface px-sm py-2xs text-sm text-ink transition-colors duration-fast ease-standard hover:border-line-strong"
              >
                {c.label}
              </a>
            </li>
          )
        )}
      </ul>
    </>
  );
}
