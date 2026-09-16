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
