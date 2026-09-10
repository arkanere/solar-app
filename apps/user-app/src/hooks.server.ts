import type { Handle } from '@sveltejs/kit';

const ALLOWED_ORIGINS = ['https://solarvipani.com', 'https://www.solarvipani.com'];

export const handle: Handle = async ({ event, resolve }) => {
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

	// Both prefixes, deliberately. submitLead answers at /in/api/, the rest at
	// /api/, and this header is what lets main-app read the response at all.
	// Miss it and the POST still inserts the lead — only the reply is unreadable
	// — so the bug hides behind a form that ignores its own response.
	const isApi =
		event.url.pathname.startsWith('/api/') || event.url.pathname.startsWith('/in/api/');

	if (origin && ALLOWED_ORIGINS.includes(origin) && isApi) {
		response.headers.set('Access-Control-Allow-Origin', origin);
	}

	return response;
};
