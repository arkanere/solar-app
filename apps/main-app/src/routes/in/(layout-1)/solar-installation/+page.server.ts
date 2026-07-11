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
			['solar-installation', 'published']
		),
		pool.query(
			`SELECT slug, h1 as name FROM seo_pages
			 WHERE pillar_slug = $1 AND page_type = $2 AND status = $3
			 ORDER BY slug ASC`,
			['solar-installation', 'cluster', 'published']
		),
		pool.query(`SELECT COUNT(*) as total FROM in_business_profiles WHERE isvisible = true`)
	]);

	const pillarData = pillarResult.rows[0] ?? {
		h1: 'Solar Installation Guide',
		meta_title: 'Solar Installation — Process, Timeline & Guide | Solar Vipani',
		meta_description: 'Complete guide to solar panel installation in India. Learn about process, timeline, permits and best practices.',
		content: [],
		faq: []
	};

	const clusters = clustersResult.rows.map((r: { slug: string; name: string }) => ({
		...r,
		pillarSlug: 'solar-installation'
	}));

	return {
		pillarData,
		clusters,
		stats: { installerCount: Number(statsResult.rows[0]?.total || 0) }
	};
};
