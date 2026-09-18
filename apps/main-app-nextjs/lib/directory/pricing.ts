/**
 * Indicative PM Surya Ghar pricing, by system size. IN only.
 *
 * Hardcoded constants, as in the SvelteKit original — nothing here reads the
 * database. Lifted out of `SubsidySection.tsx` when the size leaf arrived,
 * because the leaf's pricing tiles (geo-listing.md §5 section 5) show one row
 * of the same table that section renders in full. The SvelteKit app kept two
 * copies of these numbers, one per component, and they are the sort of
 * constant that drifts quietly: same figures, two files, no test.
 *
 * `kw` is the key the leaf slug resolves to, so `3kw-solar-system` finds its
 * row by number rather than by parsing the `size` label back out.
 */
export type PricingRow = {
  kw: number;
  /** Display label for the table's row header. */
  size: string;
  gross: string;
  subsidy: string;
  net: string;
  savings: string;
};

export const PRICING: PricingRow[] = [
  {
    kw: 1,
    size: '1 kW',
    gross: '₹65,000 – ₹80,000',
    subsidy: '₹30,000',
    net: '₹35,000 – ₹50,000',
    savings: '~₹7,000'
  },
  {
    kw: 2,
    size: '2 kW',
    gross: '₹1,30,000 – ₹1,60,000',
    subsidy: '₹60,000',
    net: '₹70,000 – ₹1,00,000',
    savings: '~₹14,000'
  },
  {
    kw: 3,
    size: '3 kW',
    gross: '₹1,80,000 – ₹2,20,000',
    subsidy: '₹78,000',
    net: '₹1,02,000 – ₹1,42,000',
    savings: '~₹21,000'
  },
  {
    kw: 5,
    size: '5 kW',
    gross: '₹2,80,000 – ₹3,50,000',
    subsidy: '₹78,000',
    net: '₹2,02,000 – ₹2,72,000',
    savings: '~₹35,000'
  },
  {
    kw: 10,
    size: '10 kW',
    gross: '₹5,50,000 – ₹7,00,000',
    subsidy: '₹78,000',
    net: '₹4,72,000 – ₹6,22,000',
    savings: '~₹70,000'
  }
];

/**
 * The sizes the chip rows link to and the leaf slugs that have a priced row.
 * A slug like `4kw-solar-system` still resolves and renders — it just has no
 * tile row, which the section handles.
 */
export const COMMON_SIZES = PRICING.map((r) => r.kw);

export function pricingFor(kw: number): PricingRow | null {
  return PRICING.find((r) => r.kw === kw) ?? null;
}
