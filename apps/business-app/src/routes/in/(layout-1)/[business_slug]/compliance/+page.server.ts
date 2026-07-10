import type { PageServerLoad } from './$types';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
import {
	getActiveLeadDataPolicy,
	checkLeadDataPolicy,
	getAcceptanceHistory,
	deriveComplianceState,
	ACCEPTANCE_VALIDITY_DAYS,
	type ComplianceState
} from '$lib/compliance';

export const prerender = false;

interface PageData {
	policy?: { version: string; summary: string } | null;
	status?: {
		state: ComplianceState;
		acceptedAt: string | null;
		expiresAt: string | null;
	};
	history?: {
		id: number;
		policyVersion: string;
		policySummary: string;
		acceptedAt: string;
	}[];
	errorMessage?: string;
}

export const load: PageServerLoad<PageData> = async ({ params, parent }) => {
	const businessSlug = params.business_slug;

	// The parent layout already handles authentication and redirects
	const parentData = await parent();
	if (!parentData.business_session) {
		throw error(403, 'Not authorized');
	}

	const pool = createPool({ connectionString: POSTGRES_URL });

	try {
		const businessResult = await pool.query<{ id: number }>(
			`SELECT id FROM businesses_1 WHERE slug = $1`,
			[businessSlug]
		);

		if (businessResult.rows.length === 0) {
			return { errorMessage: 'Business not found', history: [] };
		}

		const businessId = businessResult.rows[0].id;

		const [policy, acceptance, history] = await Promise.all([
			getActiveLeadDataPolicy(pool),
			checkLeadDataPolicy(pool, businessId),
			getAcceptanceHistory(pool, businessId)
		]);

		const expiresAt = acceptance.acceptedAt
			? new Date(
					acceptance.acceptedAt.getTime() + ACCEPTANCE_VALIDITY_DAYS * 24 * 60 * 60 * 1000
				)
			: null;

		return {
			policy: policy ? { version: policy.version, summary: policy.summary } : null,
			status: {
				state: deriveComplianceState(acceptance.acceptedAt),
				acceptedAt: acceptance.acceptedAt?.toISOString() ?? null,
				expiresAt: expiresAt?.toISOString() ?? null
			},
			history: history.map((record) => ({
				id: record.id,
				policyVersion: record.policyVersion,
				policySummary: record.policySummary,
				acceptedAt: record.acceptedAt.toISOString()
			}))
		};
	} catch (err) {
		console.error('❌ Error loading compliance data:', err);
		return { errorMessage: 'Failed to load compliance data', history: [] };
	} finally {
		await pool.end();
	}
};
