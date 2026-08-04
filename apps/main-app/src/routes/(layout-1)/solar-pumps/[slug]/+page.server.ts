import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { seoPages, solarBrands, solarProducts } from '@solar/db/schema';
import { and, asc, eq, ne } from 'drizzle-orm';
import {
	SEO_CLUSTER_SELECTION,
	SEO_CLUSTER_LINK_SELECTION,
	BRAND_SELECTION,
	PRODUCT_CARD_SELECTION
} from '$lib/server/seo';
import { error } from '@sveltejs/kit';
import { isClusterSlug } from '$lib/in/pillar-config';
import { resolveBrandSlug } from '$lib/server/slug-resolver';
import { getTopDistricts } from '$lib/server/queries';

export const config = {
	isr: { expiration: 1296000 }
};

const PILLAR = 'solar-pumps';
const CATEGORY = 'pumps';

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug.toLowerCase();

	// 1. Check cluster whitelist
	if (isClusterSlug(PILLAR, slug)) {
		const [clusterRows, siblingRows, topDistricts] = await Promise.all([
			db
				.select(SEO_CLUSTER_SELECTION)
				.from(seoPages)
				.where(
					and(
						eq(seoPages.slug, slug),
						eq(seoPages.pillarSlug, PILLAR),
						eq(seoPages.status, 'published')
					)
				),
			db
				.select(SEO_CLUSTER_LINK_SELECTION)
				.from(seoPages)
				.where(
					and(
						eq(seoPages.pillarSlug, PILLAR),
						eq(seoPages.pageType, 'cluster'),
						eq(seoPages.status, 'published')
					)
				)
				.orderBy(asc(seoPages.slug)),
			getTopDistricts()
		]);

		const clusterData = clusterRows[0];
		if (!clusterData) {
			error(404, 'Page not found');
		}

		return {
			pageType: 'cluster' as const,
			clusterData,
			siblingClusters: siblingRows,
			pillarSlug: PILLAR,
			pillarName: 'Solar Pumps',
			topDistricts
		};
	}

	// 2. Try brand resolution
	const resolved = await resolveBrandSlug(slug, CATEGORY);
	if (resolved) {
		const brand = resolved.data as { slug: string; name: string; product_category: string };

		const [brandRows, productRows] = await Promise.all([
			db.select(BRAND_SELECTION).from(solarBrands).where(eq(solarBrands.slug, brand.slug)),
			db
				.select(PRODUCT_CARD_SELECTION)
				.from(solarProducts)
				.where(and(eq(solarProducts.brandSlug, brand.slug), ne(solarProducts.status, 'draft')))
				.orderBy(asc(solarProducts.name))
		]);

		const brandData = brandRows[0];
		if (!brandData) {
			error(404, 'Brand not found');
		}

		return {
			pageType: 'brand' as const,
			brand: brandData,
			products: productRows,
			pillarSlug: PILLAR,
			pillarName: 'Solar Pumps'
		};
	}

	error(404, 'Page not found');
};
