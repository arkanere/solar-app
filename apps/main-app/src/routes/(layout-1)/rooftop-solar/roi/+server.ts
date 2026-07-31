import { redirect } from '@sveltejs/kit';
import { contentUrl } from '$lib/countries/urls';
import type { RequestHandler } from './$types';

// solar-financing does not move to the root until stage 7c, so this target must
// follow MOVED_TO_ROOT rather than being hardcoded either way: a literal
// /solar-financing/roi/ would 404 until 7c, and a literal /in/... would become a
// two-hop chain the moment 7c lands.
//
// No trailing slash: trailingSlash is 'never', so '/solar-financing/roi/' costs an
// extra normalization hop on top of this redirect.
export const GET: RequestHandler = () => {
	redirect(301, contentUrl('/solar-financing/roi'));
};
