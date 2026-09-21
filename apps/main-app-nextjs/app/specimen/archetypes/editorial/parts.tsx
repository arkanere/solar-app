import { rewriteMovedLinks } from '@/lib/editorial/body';

/**
 * The editorial specimen's pieces. Spec: archetype/editorial.md.
 *
 * This sheet breaks the rule the other three follow. `/specimen/archetypes`
 * says it "deliberately does NOT show the current implementation anywhere",
 * because putting today beside proposed turns the question into keep-or-tweak.
 * That rule is right when there is a proposal to approve. Here §5 has an open
 * question instead — three table treatments, none of them obviously correct
 * from the aggregates — so this sheet shows all three against the same real
 * table and asks which. None of them is what the site does today.
 */

/* ---------------------------------------------------------------- */
/* The body                                                          */
/* ---------------------------------------------------------------- */

/**
 * Prose styling for the database HTML. The typography plugin supplies the
 * rhythm; these overrides bind it to the token layer, because `prose` ships
 * its own greys and its own measure and both would bypass the design system.
 *
 * The SvelteKit app has the same block as a `:global()` island in
 * ContentSections.svelte purely because it has no typography plugin and its
 * `prose` classes are inert. Here they are real, so this is only the delta.
 */
export const PROSE = [
  'prose',
  // design-foundation.md §6: Source Serif is for the article body, which is
  // this — not just the headings. The route group already declares it on
  // [data-editorial]; this is what actually spends it.
  // No `prose-headings:font-serif` — that modifier's selector includes `th`,
  // so it reached into the tables and made their header rows serif while the
  // cells stayed sans. Headings inherit the serif from here anyway.
  'font-serif prose-headings:text-ink',
  'prose-p:text-ink-muted prose-li:text-ink-muted',
  'prose-strong:text-ink prose-strong:font-semibold',
  'prose-a:text-action prose-a:underline prose-a:decoration-action/40',
  'max-w-none text-prose'
].join(' ');

/** Table styling, shared by all three treatments so only layout differs. */
const TABLE = [
  // A table is data, not prose, so it opts back out of the serif — Inter is
  // the better face at small sizes and for figures, which is the whole reason
  // design-foundation.md §6 runs two families.
  '[&_table]:font-sans',
  // `w-full` alone defeats the whole scroll treatment: the table shrinks to
  // fit its column instead of overflowing it, so at 414px a four-column table
  // does not scroll — it wraps every cell onto three lines and grows to twice
  // the height. The min-width is what makes it overflow and the Scroller
  // earn its place. 34rem is the width at which the real cells stop wrapping.
  '[&_table]:w-full [&_table]:min-w-[34rem] [&_table]:border-collapse [&_table]:text-sm',
  '[&_thead_th]:border-b [&_thead_th]:border-line-strong [&_thead_th]:bg-surface-sunken',
  '[&_th]:px-sm [&_th]:py-xs [&_th]:text-left [&_th]:font-semibold [&_th]:text-ink',
  '[&_td]:px-sm [&_td]:py-xs [&_td]:align-top [&_td]:text-ink-muted',
  '[&_tbody_tr]:border-b [&_tbody_tr]:border-line',
  '[&_tbody_tr:nth-child(even)]:bg-surface-sunken/40',
  // Numbers are the whole point of a price table; they have to line up.
  '[&_td]:tabular-nums [&_th]:tabular-nums'
].join(' ');

/**
 * The table itself. Identical in A and B — what differs is the width of the
 * column it is dropped into, which is why this takes no option prop and the
 * sheet does the wrapping. A is inside the 68ch prose column; B is inside the
 * 72rem content column with only the prose text left at 68ch.
 *
 * Both scroll when the table is still wider than its column, so B is not "no
 * scrolling" — it is scrolling that starts much later and never on a desktop.
 */
export function TableBlock({ html }: { html: string }) {
  return (
    <div className={`${PROSE} ${TABLE}`}>
      <Scroller>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Scroller>
    </div>
  );
}

/**
 * C: stacked — **rejected, 2026-09-21** (§10 item 1). Each row becomes a
 * label/value block below `md`.
 *
 * Kept here, and only here, as the record of what was turned down: it is the
 * best case for stacking — the three-column table whose cells are whole
 * sentences — and looking at it is what settled the question. It buys a
 * phone-only improvement for ~10 of 282 tables, and charges for it by parsing
 * the HTML of all 282 plus a cell-length heuristic that nothing in the data
 * supports. The real page does not import this.
 */
export function TableStacked({ html }: { html: string }) {
  const { headers, rows } = parseTable(html);
  return (
    <div className={`${PROSE} ${TABLE}`}>
      {/* The real table, from md up. */}
      <div className="hidden md:block">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      {/* Stacked, below md. */}
      <ul className="not-prose space-y-md md:hidden">
        {rows.map((cells, i) => (
          <li key={i} className="rounded-md border border-line bg-surface p-md">
            <p className="font-semibold text-ink">{cells[0]}</p>
            <dl className="mt-xs space-y-2xs text-sm">
              {cells.slice(1).map((c, j) => (
                <div key={j} className="flex gap-sm">
                  <dt className="min-w-[9rem] shrink-0 text-ink-subtle">{headers[j + 1]}</dt>
                  <dd className="text-ink-muted">{c}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The scroll affordance both A and B use. A table that is cut off at the
 * viewport edge with no cue reads as broken rather than as scrollable, so the
 * wrapper fades its right edge.
 *
 * `tabIndex={0}` because a scroll container that only a pointer can reach is
 * unreachable by keyboard, and `role="region"` with a label is what makes the
 * tab stop announce itself as something rather than as an anonymous stop.
 */
function Scroller({ children }: { children: React.ReactNode }) {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Table, scrollable"
      className="relative -mx-[var(--page-gutter)] overflow-x-auto px-[var(--page-gutter)] [mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)] [scrollbar-width:thin] md:mx-0 md:px-0 md:[mask-image:none]"
    >
      {children}
    </div>
  );
}

/** Crude, and only good enough for the specimen — see TableStacked. */
function parseTable(html: string): { headers: string[]; rows: string[][] } {
  const cells = (row: string) =>
    [...row.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map((m) =>
      m[1].replace(/<[^>]+>/g, '').trim()
    );
  const trs = [...html.matchAll(/<tr[^>]*>[\s\S]*?<\/tr>/g)].map((m) => m[0]);
  return { headers: cells(trs[0] ?? ''), rows: trs.slice(1).map(cells) };
}

/* ---------------------------------------------------------------- */
/* Whole-page pieces                                                 */
/* ---------------------------------------------------------------- */

/** A body section: an h2 and its HTML, links already rewritten. */
export function BodySection({ heading, body }: { heading: string; body: string }) {
  return (
    <section className="mt-xl">
      <h2 className="font-serif text-xl text-ink">{heading}</h2>
      <div
        className={`mt-sm ${PROSE} ${TABLE}`}
        dangerouslySetInnerHTML={{ __html: rewriteMovedLinks(body) }}
      />
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Specimen chrome                                                   */
/* ---------------------------------------------------------------- */

export function Lede({ children }: { children: React.ReactNode }) {
  return <p className="mt-sm max-w-prose text-ink-muted">{children}</p>;
}

export function Section({
  label,
  title,
  intent,
  children
}: {
  label: string;
  title: string;
  intent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-3xl">
      <p className="text-2xs uppercase tracking-widest text-ink-subtle">{label}</p>
      <h2 className="mt-2xs text-xl">{title}</h2>
      <p className="mb-lg mt-xs max-w-prose text-sm text-ink-muted">{intent}</p>
      {children}
    </section>
  );
}

export function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-canvas">
      <div className="px-md py-lg sm:px-lg">{children}</div>
    </div>
  );
}

/** Names a treatment above the thing it does, so the sheet can be argued about. */
export function Option({
  letter,
  name,
  cost,
  children
}: {
  letter: string;
  name: string;
  cost: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-lg">
      <p className="text-2xs uppercase tracking-widest text-ink-subtle">Option {letter}</p>
      <h3 className="mt-2xs text-lg">{name}</h3>
      <p className="mb-sm mt-2xs max-w-prose text-sm text-ink-muted">{cost}</p>
      <Frame>{children}</Frame>
    </div>
  );
}
