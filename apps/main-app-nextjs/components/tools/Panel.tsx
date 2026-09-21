/**
 * The three pieces of furniture every calculator repeats: the panel, the
 * result tile, and a row of the breakdown.
 *
 * All three are server components — nothing here holds state. The client
 * boundary sits at the calculator that owns the numbers, and these render
 * inside it as children of that tree; keeping them directive-free means the
 * same tile can be used by a server page later without a second copy.
 *
 * The SvelteKit pages wrote each of these inline, three times over, as
 * `rounded-lg border bg-card p-6 shadow-[theme(--shadow-xs)]`. Two things
 * changed in the port, both from design-foundation.md §7:
 *
 *  - **no shadow.** "Everything on the page itself is separated by a line,
 *    not a shadow." The two elevation tokens are for things that float over
 *    content, and a panel sitting in the page flow is not one.
 *  - **spacing comes from the scale.** p-6/gap-4/mb-8 become p-lg/gap-md and
 *    the vertical rhythm between panels moves to <Stack>, which is where the
 *    lint rule says it belongs.
 */
import type { ReactNode } from 'react';

/** A bordered block. `title` becomes the <h2> the section is announced by. */
export function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-md sm:p-lg">
      {title ? <h2 className="mb-lg text-xl text-ink">{title}</h2> : null}
      {children}
    </div>
  );
}

/**
 * One headline number, with the icon and caption under it.
 *
 * `value` is a string rather than a number because every caller has already
 * formatted it — "3.5 kW", "Rs 2.4 Lakh", "6.2 yrs". Formatting inside the
 * tile would mean the tile deciding what a figure means.
 */
export function StatTile({
  icon: Icon,
  value,
  label
}: {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-md bg-surface-sunken p-md text-center">
      {/* A flex row rather than `mx-auto`: the container lint rule tests for
          `mx-auto` alone, because a column centred in the viewport is a
          container and nothing else has a reason to centre that way. Centring
          one icon inside a tile is not that, so it uses the primitive-free
          form /about-us already uses. */}
      <div className="mb-xs flex justify-center">
        <Icon aria-hidden className="h-6 w-6 text-action" />
      </div>
      {/* tabular-nums so a row of tiles does not jitter as the sliders move. */}
      <p className="text-lg font-bold tabular-nums text-ink">{value}</p>
      <p className="mt-2xs text-2xs text-ink-muted">{label}</p>
    </div>
  );
}

/**
 * A label on the left, a figure on the right. The whole breakdown is a <dl>,
 * which is what a list of term/value pairs is — the SvelteKit version used
 * divs, so a screen reader got two unrelated runs of text per line.
 */
export function BreakdownRow({
  label,
  value,
  tone = 'plain'
}: {
  label: string;
  value: string;
  /** `total` is the bottom line; `credit` is money coming off it. */
  tone?: 'plain' | 'credit' | 'total';
}) {
  return (
    <div className="flex items-baseline justify-between gap-md py-2xs text-sm">
      <dt className={tone === 'total' ? 'font-semibold text-ink' : 'text-ink-muted'}>{label}</dt>
      <dd
        className={`tabular-nums ${
          tone === 'credit'
            ? 'font-medium text-success'
            : tone === 'total'
              ? 'font-bold text-ink'
              : 'font-medium text-ink'
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * The short row of related links each tool page ends on. Plain text
 * separators between them, as the originals had — they are a list of
 * elsewhere-to-go, not navigation, so they get no chrome.
 */
export function ToolLinks({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-sm gap-y-2xs text-sm">
      {links.map((link, i) => (
        <li key={link.href} className="flex items-center gap-x-sm">
          <a href={link.href}>{link.label}</a>
          {i < links.length - 1 ? (
            <span aria-hidden className="text-ink-subtle">
              |
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
