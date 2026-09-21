/**
 * The generated FAQ. geo-listing.md §5 section 14, §11.
 *
 * Native `<details>`, and §11 says so explicitly: "no Radix needed". The
 * README budgets Radix for three things — dialog/drawer for mobile nav,
 * combobox for the location selects, accordion for FAQs — and this is the one
 * of the three that turns out not to need it. Radix's Accordion buys keyboard
 * navigation between items and a controlled open state; `<details>` is already
 * focusable, already toggles on Enter and Space, already announces its state,
 * and is already open to the browser's own find-in-page. Nothing here wants
 * one-at-a-time behaviour, which is the only thing that would justify the
 * runtime.
 *
 * It is also why this stays a server component on a page that is mostly
 * server components: the disclosure is free.
 *
 * The copy is per-country from lib/countries/faq.ts, and the page derives the
 * FAQPage JSON-LD from the same array — so the structured data cannot claim
 * questions the page does not show.
 *
 * Two things opened up for archetype 4, which renders the same disclosure
 * over `seo_pages.faq` — archetype/editorial.md §7, the one edit that
 * archetype makes outside its own files:
 *
 *  - **the heading is a prop.** It was hardcoded to "Common questions about
 *    solar in {place}", which is the directory's sentence and not an
 *    editorial page's.
 *  - **`items` is structural.** It was `FAQItem` from lib/countries/faq.ts,
 *    a generated-copy type that an `seo_pages` row has no business importing.
 *    Same two fields, no dependency.
 */
export type FaqEntry = { question: string; answer: string };

export function FAQ({
  items,
  heading,
  html = false
}: {
  items: FaqEntry[];
  heading: string;
  /**
   * Render the answers as HTML rather than text. Off for the directory,
   * whose answers are generated strings; on for the editorial surface, where
   * exactly one of the 117 pages has a tag in an answer and escaping it
   * would show the reader the tag. Trusted first-party content either way —
   * the trust boundary is the one ArticleBody.tsx documents.
   */
  html?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <>
      <h2 className="text-xl">{heading}</h2>
      <div className="mt-lg divide-y divide-line border-y border-line">
        {items.map((item) => (
          <details key={item.question} className="group py-md">
            {/* The marker is removed and replaced by the rotating chevron, so
                the open/closed state reads the same in every browser — Safari
                and Firefox draw the default triangle differently enough to
                break the column's left edge. */}
            <summary className="flex cursor-pointer list-none items-start gap-sm font-semibold [&::-webkit-details-marker]:hidden">
              <span
                aria-hidden
                className="mt-2xs shrink-0 text-ink-subtle transition-transform duration-fast ease-standard group-open:rotate-90"
              >
                ›
              </span>
              {item.question}
            </summary>
            {html ? (
              <div
                className="mt-sm max-w-prose pl-lg text-sm text-ink-muted"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            ) : (
              <p className="mt-sm max-w-prose pl-lg text-sm text-ink-muted">{item.answer}</p>
            )}
          </details>
        ))}
      </div>
    </>
  );
}
