import { getCountry } from '$lib/countries';
import type { LayoutServerLoad } from './$types';

// The literal /us tree predates the country layer, so its pages have no
// `data.country`. The shared chrome and the components being merged in stage 15
// of docs/migration-plan-in-country.md are country-aware, so supply it here.
//
// Pure and non-async because four pages under this layout used to be
// `prerender = true` and a DB call would have coupled their build to it. Those
// pages are all gone (stages 3–9 of docs/migration-plan-delete-us.md) and
// nothing is prerendered any more, so the constraint is lifted — but this file
// itself is redundant now that [country]/(layout-1)/+layout.server.ts supplies
// `data.country` for /us, and stage 11 deletes it rather than growing it.
export const load: LayoutServerLoad = () => ({ country: getCountry('us') });
