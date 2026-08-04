import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { seoPages, inBusinessProfiles } from '@solar/db/schema';
import { and, asc, count, eq } from 'drizzle-orm';
import { SEO_PILLAR_SELECTION, SEO_CLUSTER_LINK_SELECTION } from '$lib/server/seo';

export const config = {
	isr: { expiration: 1296000 }
};

const PILLAR = 'rooftop-solar';

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
		h1: 'Rooftop Solar in India',
		meta_title: 'Rooftop Solar — Complete Guide for India | Solar Vipani',
		meta_description: 'Complete guide to rooftop solar systems for homes and businesses in India. Learn about costs, benefits, and how to go solar.',
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
