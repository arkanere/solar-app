/**
 * Estimated pricing for one system size. geo-listing.md §5 section 5, size
 * leaf only, gated on `features.subsidy` like the full table it comes from.
 *
 * Three figures from `lib/directory/pricing.ts` — the same row `SubsidySection`
 * renders inside its five-row table. Tiles rather than a one-row table because
 * a single row has nothing to compare down a column, which is the only reason
 * that section is a table at all.
 *
 * Net cost is the number the reader came for, so it is the one that is larger
 * and full-strength ink; gross and subsidy are the working. None of them is
 * the success hue — a price is not a status. Both points are carried from
 * `SubsidySection`, where the original had a green subsidy column and a
 * coloured table head.
 *
 * A size with no priced row still renders the page. The original prints a
 * fallback line and so does this: `4kw-solar-system` resolves, and telling the
 * reader to ask an installer is better than an empty panel or a 404.
 */
import { pricingFor } from '@/lib/directory/pricing';

const TILE = 'rounded-lg border border-line bg-surface p-md';
const LABEL = 'text-xs font-semibold uppercase tracking-wide text-ink-muted';

export function SizePricing({ sizeKw, place }: { sizeKw: number; place: string }) {
  const row = pricingFor(sizeKw);

  return (
    <>
      <h2 className="text-xl">
        {sizeKw} kW system — estimated cost in {place}
      </h2>

      {row ? (
        <>
          <dl className="mt-lg grid gap-md sm:grid-cols-3">
            <div className={TILE}>
              <dt className={LABEL}>Gross cost</dt>
              <dd className="mt-2xs text-base tabular-nums text-ink-muted">{row.gross}</dd>
            </div>
            <div className={TILE}>
              <dt className={LABEL}>Central subsidy</dt>
              <dd className="mt-2xs text-base font-semibold tabular-nums">−{row.subsidy}</dd>
            </div>
            <div className={TILE}>
              <dt className={LABEL}>Net cost after subsidy</dt>
              <dd className="mt-2xs text-lg font-semibold tabular-nums">{row.net}</dd>
            </div>
          </dl>
          <p className="mt-md max-w-prose text-2xs text-ink-subtle">
            Indicative estimates. Final pricing depends on roof type, panel brand, inverter and
            installation complexity. A {sizeKw} kW system saves roughly {row.savings} a year at a
            ₹7/unit tariff.
          </p>
        </>
      ) : (
        <p className="mt-sm max-w-prose text-ink-muted">
          Ask an installer below for {sizeKw} kW pricing in {place}. The published subsidy slabs
          cover 1, 2, 3, 5 and 10 kW systems.
        </p>
      )}
    </>
  );
}
