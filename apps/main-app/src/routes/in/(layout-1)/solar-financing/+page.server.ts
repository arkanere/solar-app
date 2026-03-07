import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';

export const config = {
	isr: { expiration: 604800 }
};

export const load: PageServerLoad = async () => {
	const [pillarResult, clustersResult, banksResult] = await Promise.all([
		pool.query(
			`SELECT h1, meta_title, meta_description, content, faq
			 FROM seo_pages WHERE slug = $1 AND status = $2`,
			['solar-financing', 'published']
		),
		pool.query(
			`SELECT slug, h1 as name FROM seo_pages
			 WHERE pillar_slug = $1 AND page_type = $2 AND status = $3
			 ORDER BY slug ASC`,
			['solar-financing', 'cluster', 'published']
		),
		pool.query(
			`SELECT COUNT(*) as total FROM solar_financing_banks WHERE status = $1`,
			['published']
		)
	]);

	const pillarData = pillarResult.rows[0] ?? {
		h1: 'Solar Financing in India',
		meta_title: 'Solar Financing — Loans, EMI & Bank Schemes | Solar Vipani',
		meta_description: 'Compare solar loan options, EMI plans and financing schemes from banks in India. Find the best solar financing for your needs.',
		content: [],
		faq: []
	};

	const clusters = clustersResult.rows.map((r: { slug: string; name: string }) => ({
		...r,
		pillarSlug: 'solar-financing'
	}));

	return {
		pillarData,
		clusters,
		stats: { stateCount: Number(banksResult.rows[0]?.total || 0) }
	};
};
