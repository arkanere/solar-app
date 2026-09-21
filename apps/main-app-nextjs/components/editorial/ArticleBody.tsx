/**
 * The nine headed sections of database HTML that are the editorial page.
 * archetype/editorial.md §5.
 *
 * Everything here was settled at /specimen/archetypes/editorial, which is
 * still in the tree and is the record of what was looked at. Three of these
 * rules exist because the specimen caught a bug that rendered as nothing
 * visibly broken, which is the failure class design-foundation.md §8 warns
 * about: the body was in Inter, `prose-headings:` was reaching into the
 * tables, and `w-full` was quietly defeating the scroll treatment.
 *
 * The HTML goes in with `dangerouslySetInnerHTML` and no sanitizer — §6 and
 * §10 item 7. `seo_pages` is a trusted first-party table, which is the same
 * boundary the SvelteKit app's `{@html}` already assumes. **If outside
 * contributors are ever given write access to that table, this has to be
 * reopened before it happens**, because nothing else in the render path
 * would catch it.
 */
import { rewriteMovedLinks } from '@/lib/editorial/body';
import type { ContentSection } from '@/lib/editorial/data';

/**
 * Prose styling for the database HTML. The typography plugin supplies the
 * rhythm; these overrides bind it to the token layer, because `prose` ships
 * its own greys and its own measure and both would bypass the design system.
 *
 * `font-serif` is on the wrapper, not on the headings. design-foundation.md
 * §6 buys Source Serif for the article body, and that is these 6,900
 * characters — `prose-headings:font-serif` would have spent it on nine
 * headings and left the reading in Inter. It is also why there is no
 * `prose-headings:font-serif` here at all: that modifier's selector includes
 * `th`, so it made every table's header row serif while the cells stayed
 * sans. The headings inherit the serif from the wrapper instead.
 */
const PROSE = [
  'prose',
  'font-serif prose-headings:text-ink',
  'prose-p:text-ink-muted prose-li:text-ink-muted',
  'prose-strong:text-ink prose-strong:font-semibold',
  'prose-a:text-action prose-a:underline prose-a:decoration-action/40',
  'max-w-none text-prose'
].join(' ');

/**
 * Table styling. 282 tables across 112 of the 117 pages, half of them four
 * columns or wider — §2 calls this the design problem of the archetype, and
 * §5 settled it as one rule for all 282:
 *
 *   a table takes its natural width, is capped at the measure it is in, and
 *   scrolls only past that.
 *
 * So `w-auto`, not `w-full`. The specimen proved both halves of why: the
 * six-column `interest-rates` table has no cell over 14 characters and reads
 * worse stretched to a wider column, while the five-column `state-wise` one
 * has 42-character cells and needs every pixel. `w-full` would have given
 * both of them the same width and got one of them wrong.
 *
 * `min-w-[34rem]` is what makes a wide table scroll rather than wrap on a
 * phone. Without it a four-column table at 414px does not scroll at all — it
 * wraps every cell onto three lines and doubles in height, which looks like
 * a working table and is not one.
 *
 * No restacking below `md`. §10 item 1: it would buy a phone-only
 * improvement for ~10 of 282 tables at the price of parsing the HTML of all
 * of them plus a cell-length guess no field in the data supports.
 */
const TABLE = [
  // A table is data, not prose, so it opts back out of the serif — Inter is
  // the better face at small sizes and for figures, which is the whole reason
  // design-foundation.md §6 runs two families.
  '[&_table]:font-sans',
  '[&_table]:w-auto [&_table]:min-w-[34rem] [&_table]:border-collapse [&_table]:text-sm',
  '[&_thead_th]:border-b [&_thead_th]:border-line-strong [&_thead_th]:bg-surface-sunken',
  '[&_th]:px-sm [&_th]:py-xs [&_th]:text-left [&_th]:font-semibold [&_th]:text-ink',
  '[&_td]:px-sm [&_td]:py-xs [&_td]:align-top [&_td]:text-ink-muted',
  // A line under the header row and one between rows, no vertical rules:
  // design-foundation.md §7 separates things with a line, and a four-column
  // grid of boxes is heavier than the data in it.
  '[&_tbody_tr]:border-b [&_tbody_tr]:border-line',
  '[&_tbody_tr:nth-child(even)]:bg-surface-sunken/40',
  // Numbers are the whole point of a price table; they have to line up.
  '[&_td]:tabular-nums [&_th]:tabular-nums'
].join(' ');

/**
 * The scroll box. Negative margins and equal padding, so the prose inside it
 * sits exactly where it sat before and only the scrollable area is wider:
 * below `md` a table can scroll out into the page gutter, which is the cue
 * that the row continues past the edge.
 *
 * §5 asked for a fading right edge instead. That was written when each table
 * was to be wrapped individually; the wrapper here is the whole section, so a
 * mask would fade the right edge of every paragraph in it too. The bleed is
 * the affordance, and it costs no mask.
 */
const SCROLL = [
  'overflow-x-auto [scrollbar-width:thin]',
  '-mx-[var(--page-gutter)] px-[var(--page-gutter)] md:mx-0 md:px-0',
  // The breakout. It widens the whole box, so the prose inside it is pinned
  // back to the measure and only the table is allowed to use the extra —
  // without this the paragraph either side of a table runs 25% longer than
  // the paragraph in the section above it, which is the one thing the
  // measure exists to prevent.
  'xl:-mr-[calc((var(--container-content)-var(--container-prose))/2)]',
  'xl:[&>*:not(table)]:max-w-[var(--container-prose)]'
].join(' ');

/**
 * One body section: an `h2` and its HTML.
 *
 * The section is the scroll container rather than each table being wrapped
 * individually, because wrapping per table would mean parsing the HTML — the
 * thing §10 item 1 declined to do. A section that contains a table scrolls;
 * one that does not has nothing to scroll and behaves as if the wrapper were
 * not there.
 *
 * `tabIndex={0}` because a scroll container only a pointer can reach is
 * unreachable by keyboard, and `role="region"` with the heading as its label
 * is what makes that tab stop announce itself as something rather than as an
 * anonymous stop. The label is the `h2` above it, so it says which table.
 *
 * The breakout is `xl:` and not smaller. It works by letting the section
 * overflow its 68ch column to the right by exactly half the difference
 * between the two measures, which lands its right edge on the content
 * container's right edge — but only once the viewport is wide enough to hold
 * the content measure and its gutters (72rem + 2 × 24px = 1200px). Below
 * that the same margin would push the table off the screen instead, so the
 * table keeps the prose measure and scrolls.
 */
export function BodySection({ heading, body }: ContentSection) {
  const id = headingId(heading);
  const hasTable = body.includes('<table');

  return (
    <section>
      <h2 id={id} className="font-serif text-xl text-ink">
        {heading}
      </h2>
      <div
        {...(hasTable
          ? {
              tabIndex: 0,
              role: 'region' as const,
              'aria-labelledby': id,
              className: `mt-sm ${PROSE} ${TABLE} ${SCROLL}`
            }
          : { className: `mt-sm ${PROSE}` })}
        dangerouslySetInnerHTML={{ __html: rewriteMovedLinks(body) }}
      />
    </section>
  );
}

/**
 * Stable ids from the heading text, so the scroll region's `aria-labelledby`
 * has something to point at. Not a table of contents — §10 item 3 turned one
 * down — but a linkable heading costs nothing and an anchor into a
 * 7,000-character article is worth having.
 */
function headingId(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
