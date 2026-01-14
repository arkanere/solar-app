import { computeSourceRoute } from '@vercel/microfrontends/experimental/sveltekit';

export async function handle({ event, resolve }) {
	// MICROFRONTENDS: Route requests to correct microfrontend
	const microfrontendResponse = await computeSourceRoute(event);
	if (microfrontendResponse) {
		return microfrontendResponse;
	}

	// REDIRECT: Business paths to business.solarvipani.com
	if (event.url.pathname.startsWith('/business/')) {
		const businessPath = event.url.pathname.replace('/business/', '');
		const targetUrl = `https://business.solarvipani.com/${businessPath}`;
		console.log('🔀 BUSINESS REDIRECT:', {
			from: event.url.href,
			to: targetUrl,
			method: event.request.method,
			timestamp: new Date().toISOString()
		});
		return new Response(null, {
			status: 301,
			headers: {
				location: targetUrl
			}
		});
	}

	// Continue with normal request handling
	const response = await resolve(event);
	return response;
}