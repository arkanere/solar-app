import { redirect } from '@sveltejs/kit';
import { contentUrl } from '$lib/countries/urls';
import type { RequestHandler } from './$types';

// Kept on contentUrl() rather than inlined to the now country-less
// '/solar-financing/roi': one helper means this target cannot drift if the family
// ever moves again.
//
// No trailing slash: trailingSlash is 'never', so '/solar-financing/roi/' costs an
// extra normalization hop on top of this redirect.
export const GET: RequestHandler = () => {
	redirect(301, contentUrl('/solar-financing/roi'));
};
