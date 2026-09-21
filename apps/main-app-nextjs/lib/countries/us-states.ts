/**
 * US state abbreviation -> name. Ported from
 * apps/main-app/src/lib/countries/us-states.ts.
 *
 * Only the legacy US redirect shims need this: they translate a suffix slug
 * ("orange-ca") into the /us/solar/{state}/{county} scheme. The name -> abbr
 * direction did not come across — nothing here writes a legacy slug, and it
 * comes back with the page that does.
 */
const ABBR_TO_STATE: Record<string, string> = {
  al: 'Alabama',
  ak: 'Alaska',
  az: 'Arizona',
  ar: 'Arkansas',
  ca: 'California',
  co: 'Colorado',
  ct: 'Connecticut',
  de: 'Delaware',
  dc: 'District of Columbia',
  fl: 'Florida',
  ga: 'Georgia',
  hi: 'Hawaii',
  id: 'Idaho',
  il: 'Illinois',
  in: 'Indiana',
  ia: 'Iowa',
  ks: 'Kansas',
  ky: 'Kentucky',
  la: 'Louisiana',
  me: 'Maine',
  md: 'Maryland',
  ma: 'Massachusetts',
  mi: 'Michigan',
  mn: 'Minnesota',
  ms: 'Mississippi',
  mo: 'Missouri',
  mt: 'Montana',
  ne: 'Nebraska',
  nv: 'Nevada',
  nh: 'New Hampshire',
  nj: 'New Jersey',
  nm: 'New Mexico',
  ny: 'New York',
  nc: 'North Carolina',
  nd: 'North Dakota',
  oh: 'Ohio',
  ok: 'Oklahoma',
  or: 'Oregon',
  pa: 'Pennsylvania',
  ri: 'Rhode Island',
  sc: 'South Carolina',
  sd: 'South Dakota',
  tn: 'Tennessee',
  tx: 'Texas',
  ut: 'Utah',
  vt: 'Vermont',
  va: 'Virginia',
  wa: 'Washington',
  wv: 'West Virginia',
  wi: 'Wisconsin',
  wy: 'Wyoming',
  pr: 'Puerto Rico'
};

/** '' when the abbreviation is not a state, which is how the shims reject a suffix. */
export function getStateName(abbr: string): string {
  if (!abbr) return '';
  return ABBR_TO_STATE[abbr.toLowerCase()] ?? '';
}

/**
 * Every US state name, for the business form's state select. Derived from the
 * map above rather than written out a second time — the two would drift, and
 * the shims and the form must agree on what counts as a state.
 *
 * The map's insertion order is alphabetical by ABBREVIATION, which is not
 * alphabetical by name ("dc: District of Columbia" sits between Delaware and
 * Florida), so this sorts by name: the select is read, not keyed.
 */
export const US_STATE_NAMES: string[] = Object.values(ABBR_TO_STATE).sort((a, b) =>
  a.localeCompare(b)
);
