import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { isClusterSlug } from '$lib/in/pillar-config';
import { resolveBrandSlug } from '$lib/server/slug-resolver';
import { getTopDistricts } from '$lib/server/queries';

export const config = {
	isr: { expiration: 604800 }
};

const PILLAR = 'solar-inverters';
const CATEGORY = 'inverters';

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug.toLowerCase();

	if (isClusterSlug(PILLAR, slug)) {
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
			pillarName: 'Solar Inverters',
			topDistricts
		};
	}

	const resolved = await resolveBrandSlug(pool, slug, CATEGORY);
	if (resolved) {
		const brand = resolved.data as { slug: string; name: string; product_category: string };

		const [brandResult, productsResult] = await Promise.all([
			pool.query(
				`SELECT slug, name, description, logo_url, meta_title, meta_description, faq
				 FROM solar_brands WHERE slug = $1`,
				[brand.slug]
			),
			pool.query(
				`SELECT model_slug, name, price_range_min, price_range_max
				 FROM solar_products WHERE brand_slug = $1 AND status != $2
				 ORDER BY name ASC`,
				[brand.slug, 'draft']
			)
		]);

		const brandData = brandResult.rows[0];
		if (!brandData) {
			error(404, 'Brand not found');
		}

		return {
			pageType: 'brand' as const,
			brand: brandData,
			products: productsResult.rows,
			pillarSlug: PILLAR,
			pillarName: 'Solar Inverters'
		};
	}

	error(404, 'Page not found');
};
