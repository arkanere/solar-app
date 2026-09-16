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
 */
import type { FAQItem } from '@/lib/countries/faq';

export function FAQ({ items, place }: { items: FAQItem[]; place: string }) {
  if (items.length === 0) return null;

  return (
    <>
      <h2 className="text-xl">Common questions about solar in {place}</h2>
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
            <p className="mt-sm max-w-prose pl-lg text-sm text-ink-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </>
  );
}
