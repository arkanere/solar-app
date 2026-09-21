/**
 * Numbered pagination for the project gallery — the only paginated list in
 * the app.
 *
 * `<a>` throughout, so it works with no JavaScript and every page is a real
 * URL a crawler can follow. That is the whole reason the route exists as
 * `/{slug}` rather than `?page=`.
 *
 * WINDOWING. The SvelteKit version's `generatePaginationLinks` is carried
 * across, with its rule unchanged: first, last, and the current page with one
 * neighbour either side, with ellipses for the gaps. At 16 pages that is
 * seven slots at most. Two bugs in the original are fixed:
 *
 *  - **it rendered a "Next →" button BEFORE the numbers**, so the reading
 *    order was `Next 1 2 3 … 16` and the forward control sat to the LEFT of
 *    the page it advanced from. Prev/Next now bracket the numbers.
 *  - **the unpaginated route hardcoded `currentPage = 1`** in the component
 *    while the loader computed it, so `/…/1` and `/…` disagreed about which
 *    number to mark current. `page` is a prop here and both routes pass the
 *    resolved value.
 *
 * `aria-current="page"` on the current number, and it is a <span>: a link to
 * the page you are on is a link that does nothing.
 */

/** first, last, current ±1, with `null` standing for an ellipsis. */
export function pageWindow(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total]);
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.add(p);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | null)[] = [];
  for (const [i, p] of sorted.entries()) {
    // A gap of exactly one is printed rather than elided — "… 5 …" hiding a
    // single page 4 is longer than showing it.
    const previous = sorted[i - 1];
    if (previous !== undefined && p - previous > 1) out.push(null);
    out.push(p);
  }
  return out;
}

const STEP =
  'rounded-md border border-line px-sm py-2xs text-sm no-underline transition-colors duration-fast ease-standard hover:border-line-strong';

export function Pager({
  page,
  totalPages,
  href
}: {
  page: number;
  totalPages: number;
  /** Page number -> URL. The route owns the shape; page 1 is the bare path. */
  href: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination">
      <ul className="flex flex-wrap items-center justify-center gap-xs">
        <li>
          {page > 1 ? (
            <a href={href(page - 1)} rel="prev" data-unstyled className={STEP}>
              ← Previous
            </a>
          ) : (
            // Rendered inert rather than omitted, so the numbers do not shift
            // sideways by the width of the control between page 1 and page 2.
            <span aria-hidden className={`${STEP} text-ink-subtle opacity-50`}>
              ← Previous
            </span>
          )}
        </li>

        {pageWindow(page, totalPages).map((p, i) =>
          p === null ? (
            <li key={`gap-${i}`} aria-hidden className="px-2xs text-sm text-ink-subtle">
              …
            </li>
          ) : (
            <li key={p}>
              {p === page ? (
                <span
                  aria-current="page"
                  className="rounded-md border border-action bg-action px-sm py-2xs text-sm font-semibold tabular-nums text-action-ink"
                >
                  {p}
                </span>
              ) : (
                <a href={href(p)} data-unstyled className={`${STEP} tabular-nums`}>
                  {p}
                </a>
              )}
            </li>
          )
        )}

        <li>
          {page < totalPages ? (
            <a href={href(page + 1)} rel="next" data-unstyled className={STEP}>
              Next →
            </a>
          ) : (
            <span aria-hidden className={`${STEP} text-ink-subtle opacity-50`}>
              Next →
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
