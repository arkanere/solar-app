import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async () => {
	const [pillarResult, clustersResult, statsResult] = await Promise.all([
		pool.query(
			`SELECT h1, meta_title, meta_description, content, faq
			 FROM seo_pages WHERE slug = $1 AND status = $2`,
			['rooftop-solar', 'published']
		),
		pool.query(
			`SELECT slug, h1 as name FROM seo_pages
			 WHERE pillar_slug = $1 AND page_type = $2 AND status = $3
			 ORDER BY slug ASC`,
			['rooftop-solar', 'cluster', 'published']
		),
		pool.query(`SELECT COUNT(*) as total FROM businesses_1 WHERE isvisible = true`)
	]);

	const pillarData = pillarResult.rows[0] ?? {
		h1: 'Rooftop Solar in India',
		meta_title: 'Rooftop Solar — Complete Guide for India | Solar Vipani',
		meta_description: 'Complete guide to rooftop solar systems for homes and businesses in India. Learn about costs, benefits, and how to go solar.',
		content: [],
		faq: []
	};

	const clusters = clustersResult.rows.map((r: { slug: string; name: string }) => ({
		...r,
		pillarSlug: 'rooftop-solar'
	}));

	return {
		pillarData,
		clusters,
		stats: { installerCount: Number(statsResult.rows[0]?.total || 0) }
	};
};
