/**
 * Level-1 (state) names per country, for the business form's state select.
 * Ported from apps/main-app/src/lib/countries/states.ts.
 *
 * In the countries layer rather than in the form, for the reason the
 * SvelteKit original gives: the form must not know that one country's list
 * comes from a constant and the other's from the abbreviation map.
 *
 * These are DISPLAY names. The two geo endpoints slugify whatever arrives
 * (`toSlug`), and `submitBusiness` stores the display name, so the select's
 * values stay the names a reader sees. Do not switch this to slugs without
 * changing both — `business_profiles.level1` holds names.
 *
 * The IN list is the full set of states and union territories, not the 22
 * states the directory currently covers. A business signing up from a state
 * with no listings yet is exactly the signup worth taking.
 */
import type { CountryCode } from './types';
import { US_STATE_NAMES } from './us-states';

const INDIAN_STATES = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

export function statesFor(code: CountryCode): string[] {
  return code === 'us' ? US_STATE_NAMES : INDIAN_STATES;
}
