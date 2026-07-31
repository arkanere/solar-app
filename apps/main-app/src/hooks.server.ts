import type { Handle } from '@sveltejs/kit';
import { MOVED_TO_ROOT } from '$lib/countries/moved-content';

// MOVED_TO_ROOT — route families that used to live under /in (and sometimes /us)
// and now answer at the country-less root — is shared with contentUrl() so the
// redirects and the links can never drift apart. It grows one migration stage at
// a time; see legacyRedirect() below for why the timing matters.

// Which country prefixes the rule above applies to.
const MOVED_TO_ROOT_FROM = ['in', 'us'];

// Legacy URL rewrites that need no DB lookup. Suffix-parsing redirects
// that DO need geo data live as +server.ts shims under routes/us/ (county,
// solar-panel-installer-directory/[city]).
function legacyRedirect(pathname: string): string | null {
	const clean = pathname.replace(/\/+$/, '');

	if (clean === '/us/state') return '/us/solar';

	const stateMatch = clean.match(/^\/us\/state\/solar-panel-installers-in-([a-z0-9-]+)$/);
	if (stateMatch) return `/us/solar/${stateMatch[1]}`;

	if (clean === '/us/solar-panel-installer-directory') return '/us/solar';

	const installerMatch = clean.match(/^\/us\/solar-panel-installer\/([^/]+)$/);
	if (installerMatch) return `/us/installer/${installerMatch[1]}`;

	// Blogs feature removed 2026-07: send indexed blog URLs to the country home.
	const blogsMatch = clean.match(/^\/(in|us)\/blogs(\/.*)?$/);
	if (blogsMatch) return `/${blogsMatch[1]}`;

	// Marketplace routes that moved from /in into the shared [country] tree
	// (stage 11) but whose loaders still read the IN-only legacy tables
	// (in_business_profiles, locations, LeadData). Without these rules /us/partners
	// and /us/get-quotes would start answering with Indian data at a US URL.
	//
	// This runs before routing, so it is also what keeps the [country] loaders
	// reachable only as /in — they need no feature gate of their own. **When the
	// shared IN/US pages land (stage 15c), delete the matching rule in the same
	// commit that makes the page country-aware.**
	if (clean === '/us/partners' || clean.startsWith('/us/partners/')) return '/us/business-listing';
	if (clean === '/us/get-quotes') return '/us';

	// Content that has moved out from under the country prefix — see
	// docs/migration-plan-in-country.md. **Append a family here in the same commit
	// that moves it, never before**: a rule added early 301s a page that is still
	// live, and a rule added late leaves an indexed URL 404ing.
	const rootMatch = clean.match(
		new RegExp(`^/(?:${MOVED_TO_ROOT_FROM.join('|')})/(${MOVED_TO_ROOT.join('|')})(/.*)?$`)
	);
	if (rootMatch) return `/${rootMatch[1]}${rootMatch[2] ?? ''}`;

	return null;
}

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/business/')) {
		const businessPath = event.url.pathname.replace('/business/', '');
		return new Response(null, {
			status: 301,
			headers: { location: `https://business.solarvipani.com/${businessPath}` }
		});
	}

	const redirectTarget = legacyRedirect(event.url.pathname);
	if (redirectTarget) {
		// This used to read `building ? '' : event.url.search`, because
		// `url.search` is unreadable while prerendering and the crawler followed
		// links from the prerendered /us home into these legacy paths. Stage 10
		// of docs/migration-plan-delete-us.md dropped it: nothing in the app is
		// prerendered any more, so there is no crawler and `handle` never runs
		// at build time. This is a build-time simplification only — at request
		// time `building` was always false, so query strings survived a legacy
		// redirect before and after.
		return new Response(null, {
			status: 301,
			headers: { location: redirectTarget + event.url.search }
		});
	}

	return await resolve(event);
};
