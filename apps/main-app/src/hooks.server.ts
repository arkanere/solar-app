import type { Handle } from '@sveltejs/kit';

// All SEO redirects are in vercel.json (edge, zero serverless cost). Only cross-domain redirects remain here.
export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/business/')) {
		const businessPath = event.url.pathname.replace('/business/', '');
		return new Response(null, {
			status: 301,
			headers: { location: `https://business.solarvipani.com/${businessPath}` }
		});
	}

	return await resolve(event);
};
