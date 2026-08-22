// US state name <-> abbreviation maps. The legacy US redirect shims need them
// to translate suffix slugs ("orange-ca") into the /us/solar/{state}/{county}
// scheme. Sole home for this data since $lib/us/ was deleted.

export const stateToAbbr: Record<string, string> = {
	Alabama: 'al',
	Alaska: 'ak',
	Arizona: 'az',
	Arkansas: 'ar',
	California: 'ca',
	Colorado: 'co',
	Connecticut: 'ct',
	Delaware: 'de',
	'District of Columbia': 'dc',
	Florida: 'fl',
	Georgia: 'ga',
	Hawaii: 'hi',
	Idaho: 'id',
	Illinois: 'il',
	Indiana: 'in',
	Iowa: 'ia',
	Kansas: 'ks',
	Kentucky: 'ky',
	Louisiana: 'la',
	Maine: 'me',
	Maryland: 'md',
	Massachusetts: 'ma',
	Michigan: 'mi',
	Minnesota: 'mn',
	Mississippi: 'ms',
	Missouri: 'mo',
	Montana: 'mt',
	Nebraska: 'ne',
	Nevada: 'nv',
	'New Hampshire': 'nh',
	'New Jersey': 'nj',
	'New Mexico': 'nm',
	'New York': 'ny',
	'North Carolina': 'nc',
	'North Dakota': 'nd',
	Ohio: 'oh',
	Oklahoma: 'ok',
	Oregon: 'or',
	Pennsylvania: 'pa',
	'Rhode Island': 'ri',
	'South Carolina': 'sc',
	'South Dakota': 'sd',
	Tennessee: 'tn',
	Texas: 'tx',
	Utah: 'ut',
	Vermont: 'vt',
	Virginia: 'va',
	Washington: 'wa',
	'West Virginia': 'wv',
	Wisconsin: 'wi',
	Wyoming: 'wy',
	'Puerto Rico': 'pr'
};

export const abbrToState: Record<string, string> = Object.fromEntries(
	Object.entries(stateToAbbr).map(([state, abbr]) => [abbr, state])
);

export function getStateName(abbr: string): string {
	if (!abbr) return '';
	return abbrToState[abbr.toLowerCase()] || '';
}

export function getStateAbbr(stateName: string): string {
	if (!stateName) return '';
	return stateToAbbr[stateName] || '';
}
