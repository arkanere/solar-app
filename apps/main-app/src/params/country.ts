import type { ParamMatcher } from '@sveltejs/kit';
import { isCountry } from '$lib/countries';

export const match: ParamMatcher = (param) => isCountry(param);
