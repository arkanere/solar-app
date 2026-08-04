import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { seoPages } from '@solar/db/schema';
import { and, asc, eq } from 'drizzle-orm';
import { SEO_CLUSTER_SELECTION, SEO_CLUSTER_LINK_SELECTION } from '$lib/server/seo';
import { error } from '@sveltejs/kit';
import { isClusterSlug } from '$lib/in/pillar-config';
import { getTopDistricts } from '$lib/server/queries';

export const config = {
	isr: { expiration: 1296000 }
};

const PILLAR = 'rooftop-solar';

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug.toLowerCase();

	if (!isClusterSlug(PILLAR, slug)) {
		error(404, 'Page not found');
	}

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

	const clusterData = clusterRows[0] ?? {
		slug,
		h1: `Rooftop Solar ${slug
			.split('-')
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' ')}`,
		meta_title: `Rooftop Solar ${slug
			.split('-')
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' ')} — Guide for India | Solar Vipani`,
		meta_description: `Learn about rooftop solar ${slug.replace(/-/g, ' ')} in India. Compare options, get pricing, and find the best solutions.`,
		content: [],
		faq: []
	};

	return {
		pageType: 'cluster' as const,
		clusterData,
		siblingClusters: siblingRows,
		pillarSlug: PILLAR,
		pillarName: 'Rooftop Solar',
		topDistricts
	};
};
