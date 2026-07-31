import { getCountry } from '$lib/countries';
import type { LayoutServerLoad } from './$types';

// The literal /us tree predates the country layer, so its pages have no
// `data.country`. The shared chrome and the components being merged in stage 15
// of docs/migration-plan-in-country.md are country-aware, so supply it here.
//
// Deliberately pure and non-async: four pages under this layout are
// `prerender = true`, and touching the DB here would couple their build to it.
// `aboutStats` does not belong in this file.
export const load: LayoutServerLoad = () => ({ country: getCountry('us') });
