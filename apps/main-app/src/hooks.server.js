export async function handle({ event, resolve }) {
	// REDIRECT: Business paths to business.solarvipani.com
	if (event.url.pathname.startsWith('/business')) {
		const targetUrl = 'https://business.solarvipani.com';
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