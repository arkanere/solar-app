import { NextResponse, type NextRequest } from 'next/server';

// Next has no equivalent of SvelteKit's `[country=country]` param matcher, so
// country validation lives here. The list is now the real registry rather than
// a hardcoded copy of it — `lib/countries/index.ts` landed with the district
// page's feature gates. TODO: the legacy 301s/rewrites from the SvelteKit
// hooks.server.ts still have to come across.
import { isCountry } from '@/lib/countries';

export function middleware(request: NextRequest) {
  const [, first] = request.nextUrl.pathname.split('/');
  if (first && first.length === 2 && !isCountry(first)) {
    return new NextResponse('Unknown country', { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
