/**
 * The arithmetic behind the three calculators.
 *
 * In the SvelteKit app these formulae are written twice: the PM Surya Ghar
 * slabs and the cost-per-kW ladder appear identically in
 * `tools/solar-calculator/+page.svelte` and `tools/subsidy-checker/+page.svelte`,
 * as `$derived` expressions inside the markup. Two copies of the same
 * published money figure is a drift waiting to happen — if the scheme changes
 * and only one page is edited, the site quotes two different subsidies for the
 * same system. They are one function each here.
 *
 * Pure, and deliberately not 'use client': these are imported by the client
 * calculators and bundled with them, but nothing in here touches the browser,
 * so the same numbers can be reached from a server component or a test.
 *
 * **Every constant below is a market assumption, not a measurement.** They
 * are carried across verbatim from the SvelteKit pages so the two apps quote
 * the same numbers during the port. Named rather than inlined so that when
 * someone does source them, there is one place to change.
 */

/** Average peak sun hours per day across India. */
export const PEAK_SUN_HOURS = 4.5;

/** PM Surya Ghar central subsidy: Rs/kW for the first 2 kW, then 2-3 kW. */
const SUBSIDY_FIRST_2KW = 30_000;
const SUBSIDY_NEXT_1KW = 18_000;

/** The scheme's ceiling — 3 kW and above all get this. */
export const SUBSIDY_MAX = 78_000;

/**
 * Installed cost per kW, cheaper as the system grows. A 3 kW job pays for the
 * same site visit and the same scaffolding as a 10 kW one.
 */
export function costPerKw(systemSizeKw: number): number {
  if (systemSizeKw <= 3) return 55_000;
  if (systemSizeKw <= 5) return 50_000;
  return 45_000;
}

/** Gross installed cost before any subsidy. */
export function grossCost(systemSizeKw: number): number {
  return Math.round(systemSizeKw * costPerKw(systemSizeKw));
}

/**
 * The central subsidy for a system size, in rupees.
 *
 * `eligible` is what the two callers disagree about and the only reason this
 * takes a flag: the solar calculator gates on the system being on-grid, the
 * subsidy checker gates on on-grid AND a residential connection. Both mean
 * "this system qualifies", so the slab table does not need to know which
 * question was asked.
 */
export function centralSubsidy(systemSizeKw: number, eligible: boolean): number {
  if (!eligible) return 0;
  if (systemSizeKw <= 2) return Math.round(systemSizeKw * SUBSIDY_FIRST_2KW);
  if (systemSizeKw <= 3) return 60_000 + Math.round((systemSizeKw - 2) * SUBSIDY_NEXT_1KW);
  return SUBSIDY_MAX;
}

/**
 * EMI on a reducing-balance loan: P·r·(1+r)^n / ((1+r)^n − 1).
 *
 * The zero-rate branch is not defensive padding — the formula divides by
 * (1+r)^n − 1, which is exactly 0 when the rate is 0, and the slider's range
 * does not reach 0 but a bank row's parsed rate could.
 */
export function emi(principal: number, annualRatePercent: number, months: number): number {
  if (annualRatePercent === 0) return principal / months;
  const r = annualRatePercent / 12 / 100;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

/**
 * Rupees, grouped Indian-style. `en-IN` puts the separators at the lakh and
 * crore, which is the grouping every other figure on this site uses.
 */
export function rupees(n: number): string {
  return `Rs ${Math.round(n).toLocaleString('en-IN')}`;
}

/**
 * Rupees, abbreviated past a lakh — "Rs 3.2 Lakh". For the result tiles only,
 * where the figure is a headline and six digits do not fit the column on a
 * phone. Every breakdown row prints the full number.
 */
export function rupeesShort(n: number): string {
  if (Math.abs(n) >= 100_000) return `Rs ${(n / 100_000).toFixed(1)} Lakh`;
  return rupees(n);
}
