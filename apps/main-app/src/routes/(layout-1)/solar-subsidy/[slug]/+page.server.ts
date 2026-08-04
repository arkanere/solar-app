import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { discoms, seoPages, stateSubsidies } from '@solar/db/schema';
import { and, asc, eq, ne, sql } from 'drizzle-orm';
import { SEO_CLUSTER_SELECTION, SEO_CLUSTER_LINK_SELECTION, type FaqItem } from '$lib/server/seo';
import { error } from '@sveltejs/kit';
import { isClusterSlug } from '$lib/in/pillar-config';
import { resolveSubsidySlug } from '$lib/server/slug-resolver';
import { getTopDistricts } from '$lib/server/queries';

export const config = {
	isr: { expiration: 1296000 }
};

const PILLAR = 'solar-subsidy';

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
			pillarName: 'Solar Subsidy',
			topDistricts
		};
	}

	// 2. Try state/discom resolution
	const resolved = await resolveSubsidySlug(slug);

	if (resolved?.type === 'state') {
		const stateSlug = resolved.data.state_slug as string;

		const [subsidyRows, discomRows] = await Promise.all([
			db
				.select({
					state_slug: stateSubsidies.stateSlug,
					state_name: stateSubsidies.stateName,
					central_subsidy_rate: stateSubsidies.centralSubsidyRate,
					state_topup_rate: stateSubsidies.stateTopupRate,
					eligibility: stateSubsidies.eligibility,
					application_process: stateSubsidies.applicationProcess,
					content: stateSubsidies.content,
					faq: sql<FaqItem[]>`${stateSubsidies.faq}`
				})
				.from(stateSubsidies)
				.where(eq(stateSubsidies.stateSlug, stateSlug)),
			db
				.select({ slug: discoms.slug, name: discoms.name })
				.from(discoms)
				.where(and(eq(discoms.stateSlug, stateSlug), eq(discoms.status, 'published')))
				.orderBy(asc(discoms.name))
		]);

		const subsidy = subsidyRows[0];
		if (!subsidy) {
			error(404, 'State subsidy not found');
		}

		return {
			pageType: 'state-subsidy' as const,
			subsidy,
			discoms: discomRows,
			pillarSlug: PILLAR,
			pillarName: 'Solar Subsidy'
		};
	}

	if (resolved?.type === 'discom') {
		const discomSlug = resolved.data.slug as string;
		const stateSlug = resolved.data.state_slug as string;

		const [discomRows, stateRows, siblingRows] = await Promise.all([
			db
				.select({
					slug: discoms.slug,
					name: discoms.name,
					state_slug: discoms.stateSlug,
					net_metering_policy: discoms.netMeteringPolicy,
					tariff_structure: discoms.tariffStructure,
					application_process: discoms.applicationProcess,
					content: discoms.content,
					faq: sql<FaqItem[]>`${discoms.faq}`
				})
				.from(discoms)
				.where(eq(discoms.slug, discomSlug)),
			db
				.select({ state_name: stateSubsidies.stateName })
				.from(stateSubsidies)
				.where(eq(stateSubsidies.stateSlug, stateSlug)),
			db
				.select({ slug: discoms.slug, name: discoms.name })
				.from(discoms)
				.where(
					and(
						eq(discoms.stateSlug, stateSlug),
						ne(discoms.slug, discomSlug),
						eq(discoms.status, 'published')
					)
				)
				.orderBy(asc(discoms.name))
		]);

		const discom = discomRows[0];
		if (!discom) {
			error(404, 'DISCOM not found');
		}

		return {
			pageType: 'discom' as const,
			discom,
			stateSubsidy: stateRows[0] ?? null,
			siblingDiscoms: siblingRows,
			pillarSlug: PILLAR,
			pillarName: 'Solar Subsidy'
		};
	}

	error(404, 'Page not found');
};
