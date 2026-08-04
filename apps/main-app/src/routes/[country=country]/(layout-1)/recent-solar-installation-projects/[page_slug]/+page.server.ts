import type { PageServerLoad } from './$types';
import { getCountry } from '$lib/countries';
import { error } from '@sveltejs/kit';
import { listVisibleProjects } from '$lib/server/projects';

export const config = {
	isr: {
		expiration: 86400
	}
};

export const load: PageServerLoad = async ({ params }) => {
	// Projects are IN-only today (features.projects). No layout does this gate, so
	// each loader carries it — a moved route that is not gated silently serves
	// India's project data under every country prefix.
	const country = getCountry(params.country);
	if (!country.features.projects) {
		error(404, 'Not found');
	}

	const pageSlug = params.page_slug;
	const page = parseInt(pageSlug, 10);

	if (isNaN(page) || page < 1) {
		throw error(404, 'Invalid page number');
	}

	const limit = 9;
	const offset = (page - 1) * limit;

	try {
		const { projects, totalProjects } = await listVisibleProjects(limit, offset);
		const totalPages = Math.ceil(totalProjects / limit);

		if (page > totalPages && totalPages > 0) {
			throw error(404, 'Page not found');
		}

		return {
			success: true,
			projects,
			pagination: {
				currentPage: page,
				totalPages,
				totalProjects,
				limit,
				hasMore: page < totalPages
			},
			debug: {
				timestamp: new Date().toISOString(),
				projectCount: projects.length
			}
		};
	} catch (err) {
		if (typeof err === 'object' && err !== null && 'status' in err) throw err;
		console.error('Database query error:', err);
		return {
			success: false,
			error: 'Failed to fetch projects: ' + (err instanceof Error ? err.message : String(err))
		};
	}
};
