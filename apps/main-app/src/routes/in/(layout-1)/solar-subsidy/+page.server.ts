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
			['solar-subsidy', 'published']
		),
		pool.query(
			`SELECT slug, h1 as name FROM seo_pages
			 WHERE pillar_slug = $1 AND page_type = $2 AND status = $3
			 ORDER BY slug ASC`,
			['solar-subsidy', 'cluster', 'published']
		),
		pool.query(
			`SELECT COUNT(*) as total FROM state_subsidies WHERE status = $1`,
			['published']
		)
	]);

	const pillarData = pillarResult.rows[0] ?? {
		h1: 'Solar Subsidy in India',
		meta_title: 'Solar Subsidy — State-wise Rates & Application | Solar Vipani',
		meta_description: 'Complete guide to solar subsidies in India. State-wise rates, eligibility, application process and DISCOM policies.',
		content: [],
		faq: []
	};

	const clusters = clustersResult.rows.map((r: { slug: string; name: string }) => ({
		...r,
		pillarSlug: 'solar-subsidy'
	}));

	return {
		pillarData,
		clusters,
		stats: { stateCount: Number(statsResult.rows[0]?.total || 0) }
	};
};
