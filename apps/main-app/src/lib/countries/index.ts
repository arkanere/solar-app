import type { CountryCode, CountryConfig } from './types';
import { IN } from './in';
import { US } from './us';

export type { CountryCode, CountryConfig } from './types';

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
