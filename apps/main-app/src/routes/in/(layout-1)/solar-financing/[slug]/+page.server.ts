import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { isClusterSlug } from '$lib/in/pillar-config';

export const config = {
	isr: { expiration: 604800 }
};

const PILLAR = 'solar-financing';

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug.toLowerCase();

	// 1. Check cluster whitelist
	if (isClusterSlug(PILLAR, slug)) {
		const [clusterResult, siblingsResult] = await Promise.all([
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
			)
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
			pillarName: 'Solar Financing'
		};
	}

	// 2. Try bank resolution
	const bankResult = await pool.query(
		`SELECT slug, name, interest_rate, max_amount, tenure, eligibility, documents, content, faq
		 FROM solar_financing_banks WHERE slug = $1 AND status = $2`,
		[slug, 'published']
	);

	if (bankResult.rows.length > 0) {
		return {
			pageType: 'bank' as const,
			bank: bankResult.rows[0],
			pillarSlug: PILLAR,
			pillarName: 'Solar Financing'
		};
	}

	error(404, 'Page not found');
};
