// Top-level (level1) administrative division names, per country, for form
// dropdowns. Kept here rather than in a component so the country switch lives in
// the countries layer.
//
// These are display names; the geo APIs slugify them on the way in.
import type { CountryCode } from './types';
import { INDIAN_STATES } from '$lib/constants/india';
import { stateToAbbr } from './us-states';

export function statesFor(code: CountryCode): string[] {
	return code === 'us' ? Object.keys(stateToAbbr) : INDIAN_STATES;
}
