import type { Handle } from '@sveltejs/kit';
import { MOVED_TO_ROOT } from '$lib/countries/moved-content';

// MOVED_TO_ROOT — route families that used to live under /in (and sometimes /us)
// and now answer at the country-less root — is shared with contentUrl() so the
// redirects and the links can never drift apart. It grows one migration stage at
// a time; see legacyRedirect() below for why the timing matters.

// Which country prefixes the rule above applies to.
const MOVED_TO_ROOT_FROM = ['in', 'us'];

// Legacy URL rewrites that need no DB lookup. Suffix-parsing redirects that DO
// need geo data live as +server.ts shims under
// routes/[country=country]/{county/[county_slug], solar-panel-installer-directory/[city]}.
// They moved there from routes/us/ when that tree was deleted, and are gated
// to US — the suffix parsing is US state-abbreviation data ("orange-ca"), so an IN request 404s rather than
// falling through to a bare-slug lookup against Indian rows.
//
// ⚠️ Those shims redirect from their route handlers, *after* routing, so unlike
// everything in this file they do not carry the query string. Do not use them to
// test this function's behaviour.
function legacyRedirect(pathname: string): string | null {
	const clean = pathname.replace(/\/+$/, '');

	// The three homepages merged into one thin page at `/` (2026-08-22), and the
	// country home route was deleted with them. This is what makes /in and /us
	// answer at all — without it they 404, because `[country]/(layout-1)` has no
	// `+page.svelte` any more.
	//
	// Exact match only, so the whole marketplace tree below is untouched:
	// /in/solar, /us/installer/… and the rest still route normally. `clean` has
	// already had trailing slashes stripped, so /in/ lands here too.
	//
	// ⚠️ Every rule below that targets a bare `/{country}` must return `/`
	// instead, or it becomes a 301 chain through this one.
	if (clean === '/in' || clean === '/us') return '/';

	if (clean === '/us/state') return '/us/solar';

	const stateMatch = clean.match(/^\/us\/state\/solar-panel-installers-in-([a-z0-9-]+)$/);
	if (stateMatch) return `/us/solar/${stateMatch[1]}`;

	if (clean === '/us/solar-panel-installer-directory') return '/us/solar';

	const installerMatch = clean.match(/^\/us\/solar-panel-installer\/([^/]+)$/);
	if (installerMatch) return `/us/installer/${installerMatch[1]}`;

	// Blogs feature removed 2026-07: send indexed blog URLs to the home. That
	// used to be the country home; it is `/` since the homepages merged, and
	// returning `/${blogsMatch[1]}` here would now chain through the rule above.
	if (/^\/(in|us)\/blogs(\/.*)?$/.test(clean)) return '/';

	// Marketplace routes that moved from /in into the shared [country] tree
	// (stage 11 of docs/migration-plan-in-country.md) but whose loaders still read
	// the IN-only legacy tables (business_profiles, locations, LeadData).
	// Without these rules /us/partners and /us/get-quotes would answer with Indian
	// data at a US URL.
	//
	// This runs before routing, so it is also what keeps those [country] loaders
	// reachable only as /in — they need no feature gate of their own.
	//
	// ⚠️ **These two rules stay. Deliberately.** An earlier version of this comment
	// promised that stage 15c would delete them "in the same commit that makes the
	// page country-aware". Stage 15c shipped without doing so — it merged
	// *components*, not these pages — and the /us deletion settled the question
	// instead: a real
	// /us/partners is a US partner-acquisition funnel and a real /us/get-quotes is
	// a US consumer lead funnel. Both are **new product surface, not migration
	// work**, and neither is in scope. /us used to capture consumer leads through
	// LeadFormBusiness on its home (stage 9); that form went when the homepages
	// merged on 2026-08-22, so **US has no consumer lead path at all now** — it
	// had produced 4 leads ever, the last on 2026-07-19.
	//
	// ⚠️ **Before adding a third country to COUNTRIES, grep this file.** After the
	// /us tree was deleted (stage 11) these rules are the *only* thing protecting
	// IN-only data across the whole marketplace tree — there is no longer a literal
	// per-country route tree to shadow [country], so a new prefix reaches every
	// loader here immediately. A rule matching a hardcoded '/us/' will not fire for
	// it, and the loader will answer with Indian rows.
	if (clean === '/us/partners' || clean.startsWith('/us/partners/')) return '/us/business-listing';
	if (clean === '/us/get-quotes') return '/';

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
		// links from the prerendered /us home into these legacy paths. It was
		// dropped when prerendering went: nothing in the app is prerendered any more, so there is no crawler and `handle` never runs
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
