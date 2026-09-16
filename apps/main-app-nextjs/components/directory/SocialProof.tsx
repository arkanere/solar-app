/**
 * "N customers from {district} have started their solar journey."
 * geo-listing.md §5 section 4.
 *
 * The floor of 3 is kept, and §8 is explicit that it is right: below three the
 * number is not social proof, it is an admission. It silences the line on 113
 * of 221 district pages, which is the honest outcome — a page with no activity
 * to report says nothing rather than reporting one lead as momentum.
 *
 * The count is formatted in the country's locale, so 12,500 reads as 12,500 in
 * the US and 12,500 in India — the Indian grouping (1,25,00) only differs
 * above five digits, but the directory will get there and the locale is free.
 *
 * Rule 3 in practice: the band is `brand-surface`, the identity hue at its
 * lightest, and the number is ink. Sunlight never carries text and never means
 * status, so it tints the ground and nothing else.
 */

export function SocialProof({
  count,
  place,
  locale
}: {
  count: number;
  place: string;
  locale: string;
}) {
  if (count < 3) return null;

  return (
    <p className="rounded-lg border border-line bg-brand-surface px-lg py-md text-sm text-ink-muted">
      <strong className="font-semibold text-ink">{count.toLocaleString(locale)}</strong> customers
      from {place} have started their solar journey with Solar Vipani.
    </p>
  );
}
