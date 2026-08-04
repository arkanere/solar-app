import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { seoPages, inBusinessProfiles } from '@solar/db/schema';
import { and, asc, count, eq } from 'drizzle-orm';
import { SEO_PILLAR_SELECTION, SEO_CLUSTER_LINK_SELECTION } from '$lib/server/seo';

export const config = {
	isr: { expiration: 1296000 }
};

const PILLAR = 'solar-pumps';

export const load: PageServerLoad = async () => {
	const [pillarRows, clusterRows, statsRows] = await Promise.all([
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
			.from(inBusinessProfiles)
			.where(eq(inBusinessProfiles.isvisible, true))
	]);

	const pillarData = pillarRows[0] ?? {
		h1: 'Solar Pumps in India',
		meta_title: 'Solar Pumps — Types, Prices & Subsidies | Solar Vipani',
		meta_description: 'Compare solar water pump types, prices and government subsidies in India. Find the best solar pump for agriculture and irrigation.',
		content: [],
		faq: []
	};

	const clusters = clusterRows.map((r) => ({
		...r,
		pillarSlug: PILLAR
	}));

	return {
		pillarData,
		clusters,
		stats: { installerCount: Number(statsRows[0]?.total || 0) }
	};
};
