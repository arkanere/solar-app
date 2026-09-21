/**
 * The two responses the legacy route-handler shims return.
 *
 * Four routes are redirects wearing a route handler's clothes —
 * /{cc}/county/{county_slug}, /{cc}/solar-panel-installer-directory/{city},
 * /{cc}/district/{district_slug} and /rooftop-solar/roi. The first three need a
 * geo_locations lookup to build their target, which is why they are handlers
 * and not rules in middleware.ts.
 *
 * ⚠️ They redirect *after* routing, so unlike middleware.ts they do not carry
 * the query string. The SvelteKit shims they are ported from did not either.
 */
import { NextResponse } from 'next/server';

/**
 * The status is written out rather than using `redirect()` from
 * next/navigation: that helper answers 307 from a route handler and
 * `permanentRedirect()` answers 308. These are indexed GET URLs and their
 * SvelteKit originals were 301, so they stay 301.
 */
export function movedTo(path: string, request: Request): NextResponse {
  return NextResponse.redirect(new URL(path, request.url), 301);
}

/**
 * A plain 404, not the app's not-found page: a route handler returns a
 * Response, and nothing renders a page shell for one. Matches what the other
 * handlers under app/[country]/api/ do.
 */
export function shimNotFound(): NextResponse {
  return new NextResponse('Not found', { status: 404 });
}
