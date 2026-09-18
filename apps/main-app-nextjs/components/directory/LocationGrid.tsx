/**
 * The child-location card grid. archetype/geo-index.md §3 section 7 — **the
 * page**, at both levels. 29 pages, and the doorway to the other 1,250 URLs on
 * the directory surface.
 *
 * The card is a name and a comparable number, which §5 says is already close
 * to right in the original. What changed in the port is colour and scale:
 *
 *  - The original made the card title `text-primary-strong` — the same token
 *    as every heading on the page, so a link and a heading were the same
 *    colour. That is design-foundation.md §2 in its purest form. Here the name
 *    is the link and carries `action` plus an underline; the count is ink.
 *  - The grid's `h2` was `text-center` at `text-3xl`, larger and centred where
 *    nothing else on the page is. It is in the scale now and left-aligned with
 *    the rest of the page. The heading lives at the call site, because the two
 *    levels word it differently.
 *  - The pin icon is gone. Thirty-six identical pins next to thirty-six place
 *    names is the "marker every result carries" the specimen index argues
 *    against: it is decoration in the most valuable position on the card.
 *
 * `tabular-nums` on the count because the whole grid is a column of numbers
 * the eye scans down (§5), and proportional digits make a 1 and a 2 different
 * widths in a column that is meant to line up.
 *
 * The whole card is the anchor rather than just the name — a card is one
 * target, and a 200px box with a 60px hit area is a worse version of the same
 * link. The name still carries the link styling so the target is legible as
 * one; `no-underline` on the anchor keeps the count and the ratio out of it.
 */
import { CoverageBar } from './CoverageBar';

export type LocationCardData = {
  name: string;
  href: string;
  installerCount: number;
  /**
   * The child coverage ratio, country hub only — a state knows how many of its
   * districts are covered, a district has no further level to report. Omitted
   * rather than passed as zeros, so the card has one shape per level instead
   * of a flag saying which.
   */
  coverage?: { covered: number; total: number; label: string };
};

export function LocationGrid({ items }: { items: LocationCardData[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="mt-lg grid gap-md sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            className="block h-full rounded-lg border border-line bg-surface p-md text-ink no-underline transition-shadow duration-fast ease-standard hover:shadow-raised"
          >
            <h3 className="text-base leading-snug text-action underline decoration-action/40 underline-offset-2">
              {item.name}
            </h3>
            <p className="mt-2xs text-sm tabular-nums text-ink-muted">
              <span className="font-semibold text-ink">{item.installerCount}</span>{' '}
              {item.installerCount === 1 ? 'installer' : 'installers'}
            </p>
            {item.coverage ? (
              <>
                <div className="mt-sm">
                  {/* aria-hidden: the ratio is printed as text directly below,
                      so announcing it twice is noise, not redundancy. */}
                  <CoverageBar
                    covered={item.coverage.covered}
                    total={item.coverage.total}
                    label={item.coverage.label}
                    labelled={false}
                  />
                </div>
                <p className="mt-2xs text-xs tabular-nums text-ink-subtle">
                  {item.coverage.covered} of {item.coverage.total} {item.coverage.label}
                </p>
              </>
            ) : null}
          </a>
        </li>
      ))}
    </ul>
  );
}
