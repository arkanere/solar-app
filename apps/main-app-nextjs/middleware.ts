import { NextResponse, type NextRequest } from 'next/server';

// Next has no equivalent of SvelteKit's `[country=country]` param matcher, so
// country validation lives here. TODO: port the COUNTRIES list and the legacy
// 301s/rewrites from the SvelteKit hooks.server.ts.
const COUNTRIES = new Set(['in', 'us']);

export function middleware(request: NextRequest) {
  const [, first] = request.nextUrl.pathname.split('/');
  if (first && first.length === 2 && !COUNTRIES.has(first)) {
    return new NextResponse('Unknown country', { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
