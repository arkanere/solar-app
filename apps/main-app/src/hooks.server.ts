import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';

// Legacy-US URL rewrites that need no DB lookup. Suffix-parsing redirects
// that DO need geo data live as +server.ts shims under routes/us/ (county,
// solar-panel-installer-directory/[city]).
function legacyUsRedirect(pathname: string): string | null {
	const clean = pathname.replace(/\/+$/, '');

	if (clean === '/us/state') return '/us/solar';

	const stateMatch = clean.match(/^\/us\/state\/solar-panel-installers-in-([a-z0-9-]+)$/);
	if (stateMatch) return `/us/solar/${stateMatch[1]}`;

	if (clean === '/us/solar-panel-installer-directory') return '/us/solar';

	const installerMatch = clean.match(/^\/us\/solar-panel-installer\/([^/]+)$/);
	if (installerMatch) return `/us/installer/${installerMatch[1]}`;

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

	const redirectTarget = legacyUsRedirect(event.url.pathname);
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
