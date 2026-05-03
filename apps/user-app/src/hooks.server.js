const ALLOWED_ORIGINS = ['https://solarvipani.com', 'https://www.solarvipani.com'];

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const origin = event.request.headers.get('origin');

	if (event.request.method === 'OPTIONS' && origin && ALLOWED_ORIGINS.includes(origin)) {
		return new Response(null, {
			status: 204,
			headers: {
				'Access-Control-Allow-Origin': origin,
				'Access-Control-Allow-Methods': 'POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type'
			}
		});
	}

	const response = await resolve(event);

	if (origin && ALLOWED_ORIGINS.includes(origin) && event.url.pathname.startsWith('/in/api/')) {
		response.headers.set('Access-Control-Allow-Origin', origin);
	}

	return response;
}
