import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { solarBrands, solarProducts } from '@solar/db/schema';
import { and, asc, eq, ne } from 'drizzle-orm';
import { PRODUCT_SELECTION } from '$lib/server/seo';
import { error } from '@sveltejs/kit';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async ({ params }) => {
	const brandSlug = params.slug.toLowerCase();
	const modelSlug = params.model_slug.toLowerCase();

	const [productRows, brandRows, siblingRows] = await Promise.all([
		db
			.select(PRODUCT_SELECTION)
			.from(solarProducts)
			.where(
				and(
					eq(solarProducts.brandSlug, brandSlug),
					eq(solarProducts.modelSlug, modelSlug),
					ne(solarProducts.status, 'draft')
				)
			),
		db
			.select({ slug: solarBrands.slug, name: solarBrands.name })
			.from(solarBrands)
			.where(eq(solarBrands.slug, brandSlug)),
		db
			.select({ model_slug: solarProducts.modelSlug, name: solarProducts.name })
			.from(solarProducts)
			.where(and(eq(solarProducts.brandSlug, brandSlug), ne(solarProducts.status, 'draft')))
			.orderBy(asc(solarProducts.name))
	]);

	const product = productRows[0];
	const brand = brandRows[0];

	if (!product || !brand) {
		error(404, 'Product not found');
	}

	return {
		product,
		brand,
		siblingProducts: siblingRows,
		pillarSlug: 'solar-inverters',
		pillarName: 'Solar Inverters'
	};
};
