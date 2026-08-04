import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { seoPages, solarFinancingBanks } from '@solar/db/schema';
import { and, asc, eq, ne, sql } from 'drizzle-orm';
import { SEO_CLUSTER_SELECTION, SEO_CLUSTER_LINK_SELECTION, type FaqItem } from '$lib/server/seo';
import { error } from '@sveltejs/kit';
import { isClusterSlug } from '$lib/in/pillar-config';
import { getTopDistricts } from '$lib/server/queries';

export const config = {
	isr: { expiration: 1296000 }
};

const PILLAR = 'solar-financing';

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
			pillarName: 'Solar Financing',
			topDistricts
		};
	}

	// 2. Try bank resolution
	const [bankRows, siblingBankRows] = await Promise.all([
		db
			.select({
				slug: solarFinancingBanks.slug,
				name: solarFinancingBanks.name,
				interest_rate: solarFinancingBanks.interestRate,
				max_amount: solarFinancingBanks.maxAmount,
				tenure: solarFinancingBanks.tenure,
				eligibility: solarFinancingBanks.eligibility,
				documents: solarFinancingBanks.documents,
				content: solarFinancingBanks.content,
				faq: sql<FaqItem[]>`${solarFinancingBanks.faq}`
			})
			.from(solarFinancingBanks)
			.where(
				and(eq(solarFinancingBanks.slug, slug), eq(solarFinancingBanks.status, 'published'))
			),
		db
			.select({ slug: solarFinancingBanks.slug, name: solarFinancingBanks.name })
			.from(solarFinancingBanks)
			.where(
				and(ne(solarFinancingBanks.slug, slug), eq(solarFinancingBanks.status, 'published'))
			)
			.orderBy(asc(solarFinancingBanks.name))
	]);

	if (bankRows.length > 0) {
		return {
			pageType: 'bank' as const,
			bank: bankRows[0],
			siblingBanks: siblingBankRows,
			pillarSlug: PILLAR,
			pillarName: 'Solar Financing'
		};
	}

	error(404, 'Page not found');
};
