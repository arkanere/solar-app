import { computeSourceRoute } from '@vercel/microfrontends/experimental/sveltekit';

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

export async function middleware(request: Request) {
	return computeSourceRoute(request);
}
