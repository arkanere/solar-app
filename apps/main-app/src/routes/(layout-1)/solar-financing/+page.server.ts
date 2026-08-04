import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { seoPages, solarFinancingBanks } from '@solar/db/schema';
import { and, asc, count, eq } from 'drizzle-orm';
import { SEO_PILLAR_SELECTION, SEO_CLUSTER_LINK_SELECTION } from '$lib/server/seo';

export const config = {
	isr: { expiration: 1296000 }
};

const PILLAR = 'solar-financing';

export const load: PageServerLoad = async () => {
	const [pillarRows, clusterRows, bankCountRows, bankRows] = await Promise.all([
		db
			.select(SEO_PILLAR_SELECTION)
			.from(seoPages)
			.where(and(eq(seoPages.slug, PILLAR), eq(seoPages.status, 'published'))),
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
		db
			.select({ total: count() })
			.from(solarFinancingBanks)
			.where(eq(solarFinancingBanks.status, 'published')),
		db
			.select({ slug: solarFinancingBanks.slug, name: solarFinancingBanks.name })
			.from(solarFinancingBanks)
			.where(eq(solarFinancingBanks.status, 'published'))
			.orderBy(asc(solarFinancingBanks.name))
	]);

	const pillarData = pillarRows[0] ?? {
		h1: 'Solar Financing in India',
		meta_title: 'Solar Financing — Loans, EMI & Bank Schemes | Solar Vipani',
		meta_description:
			'Compare solar loan options, EMI plans and financing schemes from banks in India. Find the best solar financing for your needs.',
		content: [],
		faq: []
	};

	const clusters = clusterRows.map((r) => ({
		...r,
		pillarSlug: PILLAR
	}));

	const bankSchemes = bankRows.map((r) => ({
		name: r.name,
		href: `/solar-financing/${r.slug}/`
	}));

	return {
		pillarData,
		clusters,
		stats: { stateCount: Number(bankCountRows[0]?.total || 0) },
		bankSchemes
	};
};
