import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async ({ params }) => {
	const brandSlug = params.slug.toLowerCase();
	const modelSlug = params.model_slug.toLowerCase();

	const [productResult, brandResult, siblingsResult] = await Promise.all([
		pool.query(
			`SELECT name, model_slug, specs, price_range_min, price_range_max, datasheet_url
			 FROM solar_products WHERE brand_slug = $1 AND model_slug = $2 AND status != $3`,
			[brandSlug, modelSlug, 'draft']
		),
		pool.query(
			`SELECT slug, name FROM solar_brands WHERE slug = $1`,
			[brandSlug]
		),
		pool.query(
			`SELECT model_slug, name FROM solar_products
			 WHERE brand_slug = $1 AND status != $2
			 ORDER BY name ASC`,
			[brandSlug, 'draft']
		)
	]);

	const product = productResult.rows[0];
	const brand = brandResult.rows[0];

	if (!product || !brand) {
		error(404, 'Product not found');
	}

	return {
		product,
		brand,
		siblingProducts: siblingsResult.rows,
		pillarSlug: 'solar-panels',
		pillarName: 'Solar Panels'
	};
};
