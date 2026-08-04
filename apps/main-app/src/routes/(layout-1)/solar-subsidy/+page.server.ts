import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { seoPages, stateSubsidies as stateSubsidiesTable } from '@solar/db/schema';
import { and, asc, count, eq } from 'drizzle-orm';
import { SEO_PILLAR_SELECTION, SEO_CLUSTER_LINK_SELECTION } from '$lib/server/seo';

export const config = {
	isr: { expiration: 1296000 }
};

const PILLAR = 'solar-subsidy';

export const load: PageServerLoad = async () => {
	const [pillarRows, clusterRows, stateCountRows, stateRows] = await Promise.all([
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
			.from(stateSubsidiesTable)
			.where(eq(stateSubsidiesTable.status, 'published')),
		db
			.select({
				state_slug: stateSubsidiesTable.stateSlug,
				state_name: stateSubsidiesTable.stateName
			})
			.from(stateSubsidiesTable)
			.where(eq(stateSubsidiesTable.status, 'published'))
			.orderBy(asc(stateSubsidiesTable.stateName))
	]);

	const pillarData = pillarRows[0] ?? {
		h1: 'Solar Subsidy in India',
		meta_title: 'Solar Subsidy — State-wise Rates & Application | Solar Vipani',
		meta_description: 'Complete guide to solar subsidies in India. State-wise rates, eligibility, application process and DISCOM policies.',
		content: [],
		faq: []
	};

	const clusters = clusterRows.map((r) => ({
		...r,
		pillarSlug: PILLAR
	}));

	const stateSubsidies = stateRows.map((r) => ({
		name: r.state_name,
		href: `/solar-subsidy/${r.state_slug}/`
	}));

	return {
		pillarData,
		clusters,
		stats: { stateCount: Number(stateCountRows[0]?.total || 0) },
		stateSubsidies
	};
};
