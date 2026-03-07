import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const config = {
	isr: { expiration: 604800 }
};

export const load: PageServerLoad = async () => {
	const [pillarResult, clustersResult, statsResult] = await Promise.all([
		pool.query(
			`SELECT h1, meta_title, meta_description, content, faq
			 FROM seo_pages WHERE slug = $1 AND status = $2`,
			['solar-panels', 'published']
		),
		pool.query(
			`SELECT slug, h1 as name FROM seo_pages
			 WHERE pillar_slug = $1 AND page_type = $2 AND status = $3
			 ORDER BY slug ASC`,
			['solar-panels', 'cluster', 'published']
		),
		pool.query(`SELECT COUNT(*) as total FROM businesses_1 WHERE isvisible = true`)
	]);

	const pillarData = pillarResult.rows[0] ?? {
		h1: 'Solar Panels in India',
		meta_title: 'Solar Panels — Types, Prices & Brands | Solar Vipani',
		meta_description: 'Compare solar panel types, brands, prices and specifications in India. Find the best solar panels for your home or business.',
		content: [],
		faq: []
	};

	const clusters = clustersResult.rows.map((r: { slug: string; name: string }) => ({
		...r,
		pillarSlug: 'solar-panels'
	}));

	return {
		pillarData,
		clusters,
		stats: { installerCount: Number(statsResult.rows[0]?.total || 0) }
	};
};
