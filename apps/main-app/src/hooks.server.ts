import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
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
		// url.search is not readable while prerendering (crawler follows links
		// from the prerendered /us home into these legacy paths).
		const search = building ? '' : event.url.search;
		return new Response(null, {
			status: 301,
			headers: { location: redirectTarget + search }
		});
	}

	return await resolve(event);
};
