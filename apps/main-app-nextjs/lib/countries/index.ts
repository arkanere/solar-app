/**
 * The country registry. Ported from apps/main-app/src/lib/countries/index.ts.
 *
 * `isCountry` is the narrowing guard a page uses before it has a config: route
 * params arrive as `string`, and `getCountry` throws on an unknown code. The
 * district page calls the guard and 404s rather than letting the throw become
 * a 500 — middleware.ts already rejects unknown two-letter prefixes, but a
 * page that depends on middleware for its own type safety is one config edit
 * away from a crash.
 */
import type { CountryCode, CountryConfig } from './types';
import { IN } from './in';
import { US } from './us';

export type { CountryCode, CountryConfig, LevelLabels } from './types';

export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  in: IN,
  us: US
};

export function isCountry(code: string): code is CountryCode {
  return code in COUNTRIES;
}

export function getCountry(code: string): CountryConfig {
  if (!isCountry(code)) {
    throw new Error(`Unknown country code: ${code}`);
  }
  return COUNTRIES[code];
}

/**
 * The `generateStaticParams` return for a route whose only dynamic segment is
 * `[country]`.
 *
 * **Why these routes return real params and the database-driven ones return
 * `[]`.** An empty return is what turns ISR on, but it prerenders nothing and
 * leaves the key space unbounded — and under Next 16's Cache Components it is a
 * build error outright. The objection recorded against fixing it is that real
 * params couple a ~1,380-page build to the database. That objection is about
 * the routes with a second, data-driven segment. Here the segment is the
 * country registry: two entries, known at build time, no query to enumerate
 * them. The pages themselves still read data seams, so the build does open a
 * connection — for about 15 renders, not 1,380.
 *
 * `dynamicParams` is left at its default of `true`, so a country not returned
 * here still renders on demand rather than 404ing.
 *
 * `include` narrows the set for routes that do not serve every country. Pass a
 * feature gate where one exists; the four `/us/` rules in `middleware.ts` have
 * no flag behind them, so those routes write the literal instead and cite it.
 */
export function countryParams(
  include: (config: CountryConfig) => boolean = () => true
): { country: CountryCode }[] {
  return (Object.keys(COUNTRIES) as CountryCode[])
    .filter((code) => include(COUNTRIES[code]))
    .map((country) => ({ country }));
}
