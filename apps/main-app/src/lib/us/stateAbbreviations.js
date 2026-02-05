// State name to abbreviation mapping for US states
export const stateToAbbr = {
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

// Abbreviation to state name mapping (reverse lookup)
export const abbrToState = Object.fromEntries(
	Object.entries(stateToAbbr).map(([state, abbr]) => [abbr, state])
);

/**
 * Convert state name to abbreviation
 * @param {string} stateName - Full state name
 * @returns {string} State abbreviation in lowercase, or empty string if not found
 */
export function getStateAbbr(stateName) {
	if (!stateName) return '';
	return stateToAbbr[stateName] || '';
}

/**
 * Convert state abbreviation to full name
 * @param {string} abbr - State abbreviation (case-insensitive)
 * @returns {string} Full state name, or empty string if not found
 */
export function getStateName(abbr) {
	if (!abbr) return '';
	return abbrToState[abbr.toLowerCase()] || '';
}

/**
 * Format city name for URL (lowercase, replace spaces with hyphens)
 * @param {string} city - City name
 * @returns {string} URL-friendly city name
 */
export function formatCityForUrl(city) {
	if (!city) return '';
	return city.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Format city and state for directory URL
 * @param {string} city - City name
 * @param {string} stateNameOrAbbr - Full state name or abbreviation
 * @returns {string} URL segment in format: city-state (e.g., "greenville-al")
 */
export function formatCityStateUrl(city, stateNameOrAbbr) {
	if (!city || !stateNameOrAbbr) return '';

	const citySlug = formatCityForUrl(city);

	// Check if it's already an abbreviation (2 characters)
	let stateAbbr;
	if (stateNameOrAbbr.length <= 3) {
		stateAbbr = stateNameOrAbbr.toLowerCase();
	} else {
		stateAbbr = getStateAbbr(stateNameOrAbbr);
	}

	return `${citySlug}-${stateAbbr}`;
}

/**
 * Format county and state for county page URL
 * @param {string} county - County name
 * @param {string} stateNameOrAbbr - Full state name or abbreviation
 * @returns {string} URL segment in format: county-state (e.g., "butler-al")
 */
export function formatCountyStateUrl(county, stateNameOrAbbr) {
	if (!county || !stateNameOrAbbr) return '';

	// Format county name for URL (lowercase, replace spaces with hyphens)
	const countySlug = county.toLowerCase().replace(/\s+/g, '-');

	// Check if it's already an abbreviation (2 characters)
	let stateAbbr;
	if (stateNameOrAbbr.length <= 3) {
		stateAbbr = stateNameOrAbbr.toLowerCase();
	} else {
		stateAbbr = getStateAbbr(stateNameOrAbbr);
	}

	return `${countySlug}-${stateAbbr}`;
}

/**
 * Parse city-state URL parameter
 * @param {string} cityStateParam - URL parameter like "greenville-al"
 * @returns {{city: string, state: string}} Object with capitalized city and full state name
 */
export function parseCityStateParam(cityStateParam) {
	if (!cityStateParam) {
		return { city: '', state: '' };
	}

	// Split by last hyphen to get city and state parts
	const lastHyphenIndex = cityStateParam.lastIndexOf('-');

	if (lastHyphenIndex === -1) {
		// No hyphen found, treat entire string as city (backward compatibility)
		return {
			city: capitalizeCityName(cityStateParam),
			state: ''
		};
	}

	const cityPart = cityStateParam.substring(0, lastHyphenIndex);
	const statePart = cityStateParam.substring(lastHyphenIndex + 1);

	return {
		city: capitalizeCityName(cityPart),
		state: getStateName(statePart)
	};
}

/**
 * Capitalize city name properly (handles hyphens and spaces)
 * @param {string} city - City name with hyphens or spaces
 * @returns {string} Properly capitalized city name
 */
export function capitalizeCityName(city) {
	if (!city) return '';

	return city
		.split(/([\s-])/g) // Split on spaces or hyphens while keeping the delimiters
		.map((part, index) => {
			// If it's not a delimiter (i.e., it's a word), capitalize it
			if (!part.match(/[\s-]/)) {
				return part.charAt(0).toUpperCase() + part.slice(1);
			}
			// If it's a delimiter, return it unchanged
			return part;
		})
		.join(''); // Join back together, preserving original delimiters
}
