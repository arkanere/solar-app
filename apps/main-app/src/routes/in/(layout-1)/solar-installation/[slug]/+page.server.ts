import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { isClusterSlug } from '$lib/in/pillar-config';
import { getTopDistricts } from '$lib/server/queries';

export const config = {
	isr: { expiration: 1296000 }
};

const PILLAR = 'solar-installation';

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug.toLowerCase();

	if (!isClusterSlug(PILLAR, slug)) {
		error(404, 'Page not found');
	}

	const [clusterResult, siblingsResult, topDistricts] = await Promise.all([
		pool.query(
			`SELECT slug, h1, meta_title, meta_description, content, faq
			 FROM seo_pages WHERE slug = $1 AND pillar_slug = $2 AND status = $3`,
			[slug, PILLAR, 'published']
		),
		pool.query(
			`SELECT slug, h1 as name FROM seo_pages
			 WHERE pillar_slug = $1 AND page_type = $2 AND status = $3
			 ORDER BY slug ASC`,
			[PILLAR, 'cluster', 'published']
		),
		getTopDistricts()
	]);

	const clusterData = clusterResult.rows[0];
	if (!clusterData) {
		error(404, 'Page not found');
	}

	return {
		pageType: 'cluster' as const,
		clusterData,
		siblingClusters: siblingsResult.rows,
		pillarSlug: PILLAR,
		pillarName: 'Solar Installation',
		topDistricts
	};
};
