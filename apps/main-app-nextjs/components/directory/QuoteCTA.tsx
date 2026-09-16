/**
 * "Get free solar quotes in {district}" — geo-listing.md §5 section 11, IN
 * only. It points at /{cc}/get-quotes, a page this app has not ported yet.
 *
 * Note this is the page's SECOND route to the same outcome: the lead form
 * above it collects the same details inline. The SvelteKit page has both, and
 * both are carried across, but they are deliberately not the same weight — the
 * form is the offer and this is the exit for a reader who scrolled past it. So
 * it is one line and one button, not a second panel competing with the first.
 *
 * `action` filled, matching CallButton: this and the call buttons are the two
 * primary actions on the page, and rule 2 says that is the one thing the hue
 * means.
 */

export function QuoteCTA({ country, place }: { country: string; place: string }) {
  return (
    <p className="text-center">
      <a
        href={`/${country}/get-quotes/`}
        className="inline-flex items-center justify-center rounded-md bg-action px-lg py-sm text-base font-semibold text-action-ink no-underline transition-colors duration-fast ease-standard hover:bg-action-hover"
      >
        Get free solar quotes in {place}
      </a>
    </p>
  );
}
