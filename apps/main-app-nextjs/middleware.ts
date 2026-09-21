// Next has no equivalent of SvelteKit's `[country=country]` param matcher, so
// country validation lives here. The list is now the real registry rather than
// a hardcoded copy of it — `lib/countries/index.ts` landed with the district
// page's feature gates.
//
// The legacy 301s came across from apps/main-app/src/hooks.server.ts
// (`legacyRedirect` and the /business/ rule above it) on 2026-09-21. They run
// here for the same reason they ran in `handle`: before routing, so they cost
// no render and so they carry the query string, which the three route-handler
// shims cannot do.
//
// One rule joins them from outside that file: /solar-pumps/kusum-scheme was in
// the live sitemap until 2026-09-21 and is likely indexed, but its row is now
// `draft` — it was an empty duplicate of /solar-pumps/kusum-yojana, which is
// where it 301s. archetype/editorial.md §2 and §6.
import { NextResponse, type NextRequest } from 'next/server';
import { isCountry } from '@/lib/countries';
import { MOVED_TO_ROOT } from '@/lib/countries/moved-content';

// Which country prefixes the MOVED_TO_ROOT rule applies to.
const MOVED_TO_ROOT_FROM = ['in', 'us'];

const MOVED_TO_ROOT_PATTERN = new RegExp(
  `^/(?:${MOVED_TO_ROOT_FROM.join('|')})/(${MOVED_TO_ROOT.join('|')})(/.*)?$`
);

/**
 * Legacy URL rewrites that need no database lookup.
 *
 * The suffix-parsing redirects that DO need geo data are route handlers
 * instead — app/[country]/county/[county_slug], app/[country]/solar-panel-
 * installer-directory/[city] and app/[country]/district/[district_slug]. They
 * redirect after routing and so drop the query string; do not use them to
 * reason about this function.
 */
function legacyRedirect(pathname: string): string | null {
  const clean = pathname.replace(/\/+$/, '');

  // The three homepages merged into one thin page at `/` (2026-08-22) and the
  // country home route went with them. This is what makes /in and /us answer
  // at all. Exact match only, so the marketplace tree below is untouched:
  // /in/solar, /us/installer/… and the rest still route normally. `clean` has
  // already lost its trailing slashes, so /in/ lands here too.
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
  // returning `/${country}` here would chain through the rule above.
  if (/^\/(in|us)\/blogs(\/.*)?$/.test(clean)) return '/';

  // Marketplace routes that moved from /in into the shared [country] tree but
  // whose queries still read the IN-only legacy tables (business_profiles,
  // locations, leaddata). Without these rules /us/partners and /us/get-quotes
  // would answer with Indian data at a US URL.
  //
  // This runs before routing, so it is also what keeps those routes reachable
  // only as /in — they need no feature gate of their own.
  //
  // ⚠️ **These two rules stay. Deliberately.** A real /us/partners is a US
  // partner-acquisition funnel and a real /us/get-quotes is a US consumer lead
  // funnel. Both are new product surface, not porting work. US has no consumer
  // lead path at all now — it had produced 4 leads ever, the last 2026-07-19.
  //
  // ⚠️ **Before adding a third country to COUNTRIES, grep this file.** These
  // rules are the only thing protecting IN-only data across the marketplace
  // tree: there is no per-country route tree shadowing [country] any more, so
  // a new prefix reaches every loader immediately, and a rule matching a
  // hardcoded '/us/' will not fire for it.
  if (clean === '/us/partners' || clean.startsWith('/us/partners/')) return '/us/business-listing';
  if (clean === '/us/get-quotes') return '/';

  // The article that was an empty duplicate. Its row is `draft`, so without
  // this the indexed URL 404s rather than reaching the page it duplicated.
  if (clean === '/solar-pumps/kusum-scheme') return '/solar-pumps/kusum-yojana';

  // Content families that have moved out from under the country prefix.
  // **Append to MOVED_TO_ROOT in the same commit that moves a family**: early
  // and this 301s a page that is still live, late and an indexed URL 404s.
  const rootMatch = clean.match(MOVED_TO_ROOT_PATTERN);
  if (rootMatch) return `/${rootMatch[1]}${rootMatch[2] ?? ''}`;

  return null;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // The business app is a separate deployment, so this is an absolute target
  // and the only rule in this file that leaves the site.
  if (pathname.startsWith('/business/')) {
    return NextResponse.redirect(
      `https://business.solarvipani.com/${pathname.slice('/business/'.length)}`,
      301
    );
  }

  const target = legacyRedirect(pathname);
  if (target) {
    return NextResponse.redirect(new URL(target + search, request.url), 301);
  }

  const [, first] = pathname.split('/');
  if (first && first.length === 2 && !isCountry(first)) {
    return new NextResponse('Unknown country', { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
