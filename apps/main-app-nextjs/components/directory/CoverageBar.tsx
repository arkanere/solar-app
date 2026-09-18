/**
 * A ratio drawn as a ratio. archetype/geo-index.md §2.
 *
 * The spec calls the SvelteKit original "the best piece of information design
 * on the directory surface", and it is the one thing from those two pages
 * carried across unchanged in intent: the page's real subject is *where we
 * have installers*, coverage is thin — 22 of 36 states, and behind most
 * covered states a handful of districts with one or two installers each — and
 * a bar shows that honestly where a bare count implies coverage the directory
 * does not have.
 *
 * Extended to the state hub here, which §9 question 2 asked about and which
 * needs no new query: `level2Count` of `totalLevel2Count` were already in the
 * loader and simply never drawn.
 *
 * Three things about the markup:
 *
 *  - `bg-brand` is the fill. Rule 3 — sunlight is identity, for fills and
 *    marks, never type on a light ground and never status. A coverage bar is
 *    exactly a mark. It is deliberately NOT `action`: the bar cannot be
 *    interacted with, and rule 2 reserves that hue for things that can.
 *  - `role="img"` with the ratio spelled out. A pair of nested divs is nothing
 *    to a screen reader, and the number is the content. Where the caller also
 *    prints the ratio in text, it passes `aria-hidden` instead so the figure is
 *    not announced twice.
 *  - The track is `surface-sunken`, not a tint of the fill. Sunlight is 1.82:1
 *    on canvas (design-foundation.md §5), so a 10%-covered state would draw a
 *    sliver against a ground nearly the same value — the empty part of the bar
 *    has to be a different material, not a lighter version of the full part.
 */

export function CoverageBar({
  covered,
  total,
  label,
  labelled = true
}: {
  covered: number;
  total: number;
  /** Plural noun from the country config, e.g. 'districts' | 'counties'. */
  label: string;
  /** False where the caller prints the same ratio as text beside the bar. */
  labelled?: boolean;
}) {
  // A state with no geography under it cannot have a ratio. It does not reach
  // here today — both grids filter to places with installers, which implies at
  // least one child — but a zero denominator would render NaN%, and a bar is
  // not worth a division by zero.
  if (total <= 0) return null;

  const pct = Math.round((covered / total) * 100);

  return (
    <div
      className="h-1 w-full overflow-hidden rounded-sm bg-surface-sunken"
      {...(labelled
        ? { role: 'img', 'aria-label': `${covered} of ${total} ${label} covered` }
        : { 'aria-hidden': true })}
    >
      <div className="h-full rounded-sm bg-brand" style={{ width: `${pct}%` }} />
    </div>
  );
}
