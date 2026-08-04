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

	const page = 1;
	const limit = 9;
	const offset = 0;

	try {
		const { projects, totalProjects } = await listVisibleProjects(limit, offset);
		const totalPages = Math.ceil(totalProjects / limit);

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
	} catch (error) {
		console.error('Database query error:', error);
		return {
			success: false,
			error: 'Failed to fetch projects: ' + (error instanceof Error ? error.message : String(error))
		};
	}
};
