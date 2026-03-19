import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { isClusterSlug } from '$lib/in/pillar-config';
import { resolveSubsidySlug } from '$lib/server/slug-resolver';
import { getTopDistricts } from '$lib/server/queries';

export const config = {
	isr: { expiration: 604800 }
};

const PILLAR = 'solar-subsidy';

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug.toLowerCase();

	// 1. Check cluster whitelist
	if (isClusterSlug(PILLAR, slug)) {
		const [clusterResult, siblingsResult, topDistricts] = await Promise.all([
			pool.query(
				`SELECT slug, h1, meta_title, meta_description, content, faq
				 FROM seo_pages WHERE slug = $1 AND pillar_slug = $2 AND status = $3`,
				[slug, PILLAR, 'published']
			),
			pool.query(
				`SELECT slug, h1 as name FROM seo_pages
				 WHERE pillar_slug = $1 AND page_type = $2 AND status = $3
				 ORDER BY slug ASC`,
				[PILLAR, 'cluster', 'published']
			),
			getTopDistricts()
		]);

		const clusterData = clusterResult.rows[0];
		if (!clusterData) {
			error(404, 'Page not found');
		}

		return {
			pageType: 'cluster' as const,
			clusterData,
			siblingClusters: siblingsResult.rows,
			pillarSlug: PILLAR,
			pillarName: 'Solar Subsidy',
			topDistricts
		};
	}

	// 2. Try state/discom resolution
	const resolved = await resolveSubsidySlug(pool, slug);

	if (resolved?.type === 'state') {
		const stateSlug = resolved.data.state_slug as string;

		const [subsidyResult, discomsResult] = await Promise.all([
			pool.query(
				`SELECT state_slug, state_name, central_subsidy_rate, state_topup_rate,
				        eligibility, application_process, content, faq
				 FROM state_subsidies WHERE state_slug = $1`,
				[stateSlug]
			),
			pool.query(
				`SELECT slug, name FROM discoms WHERE state_slug = $1 AND status = $2 ORDER BY name ASC`,
				[stateSlug, 'published']
			)
		]);

		const subsidy = subsidyResult.rows[0];
		if (!subsidy) {
			error(404, 'State subsidy not found');
		}

		return {
			pageType: 'state-subsidy' as const,
			subsidy,
			discoms: discomsResult.rows,
			pillarSlug: PILLAR,
			pillarName: 'Solar Subsidy'
		};
	}

	if (resolved?.type === 'discom') {
		const discomSlug = resolved.data.slug as string;
		const stateSlug = resolved.data.state_slug as string;

		const [discomResult, stateResult, siblingsResult] = await Promise.all([
			pool.query(
				`SELECT slug, name, state_slug, net_metering_policy, tariff_structure,
				        application_process, content, faq
				 FROM discoms WHERE slug = $1`,
				[discomSlug]
			),
			pool.query(
				`SELECT state_name FROM state_subsidies WHERE state_slug = $1`,
				[stateSlug]
			),
			pool.query(
				`SELECT slug, name FROM discoms
				 WHERE state_slug = $1 AND slug != $2 AND status = $3
				 ORDER BY name ASC`,
				[stateSlug, discomSlug, 'published']
			)
		]);

		const discom = discomResult.rows[0];
		if (!discom) {
			error(404, 'DISCOM not found');
		}

		return {
			pageType: 'discom' as const,
			discom,
			stateSubsidy: stateResult.rows[0] ?? null,
			siblingDiscoms: siblingsResult.rows,
			pillarSlug: PILLAR,
			pillarName: 'Solar Subsidy'
		};
	}

	error(404, 'Page not found');
};
