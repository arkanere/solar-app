// The single list of content families that have moved out from under the country
// prefix to the country-less root (destination A of
// docs/migration-plan-in-country.md, §5c).
//
// Two consumers read this and they must never disagree:
//   - hooks.server.ts   — 301s /{in,us}/<family>/** to /<family>/**
//   - contentUrl()      — emits country-less hrefs for these families, /in/... for
//                         the rest
//
// A family being redirected and its links being country-less are the same fact.
// **Append a family here in the same commit that moves its routes.** Earlier and
// the 301 fires on a page that is still live while every link points at a 404;
// later and the indexed URL 404s while every link burns a redirect hop.
//
// First path segments only — contentUrl('/tools/emi-calculator/') keys off
// `tools`. Do not add nested paths.
export const MOVED_TO_ROOT = [
	// stage 4 — legal & static
	'privacy-policy',
	'terms-of-use',
	'about-us',
	'data-access',
	'write-for-us',
	'seo-index',
	'data-deletion',

	// stage 7a — first two content pillars
	'rooftop-solar',
	'solar-installation',

	// stage 7b — the three product pillars
	'solar-panels',
	'solar-inverters',
	'solar-pumps',

	// stage 7c — completes the 7 content pillars
	'solar-financing',
	'solar-subsidy',

	// stage 8 — tools
	'tools'
];
