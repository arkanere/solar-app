import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { businessAccounts, businessProfiles } from '@solar/db/schema';
import { accountOfProfile, businessInCountry } from '$lib/server/writeTargets';
import { and, eq } from 'drizzle-orm';
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

// Nothing here reads the slug any more — the business comes from the session's
// businessId, and the acceptance record is keyed by that id and the country.
export const load: PageServerLoad<PageData> = async ({ parent }) => {
	// The parent layout already handles authentication and redirects
	const parentData = await parent();
	if (!parentData.business_session) {
		throw error(403, 'Not authorized');
	}

	// The country comes from the layout, which resolved it from the slug. It
	// feeds three call sites here, not just the business lookup —
	// checkLeadDataPolicy and getAcceptanceHistory both take it too, and a
	// literal 'in' there would have read another country's acceptance record.
	// Not defaulted to 'in' when absent.
	const { country } = parentData;
	if (!country) {
		return { errorMessage: 'Business not found', history: [] };
	}

	try {
		// Resolved by the session's businessId, not by the slug: slugs are not
		// unique (next-steps.md item 1), and this id is what the acceptance lookup
		// and the history below are keyed by — landing on a twin would report
		// another company's acceptance as this one's.
		const businessRows = await db
			.select({ id: businessProfiles.businessId })
			.from(businessProfiles)
			// The country predicate is NOT redundant beside the id — see
			// businessInCountry's doc comment in $lib/server/writeTargets. It asserts
			// that the session's business and the country the layout resolved from the
			// slug agree, which they can fail to do when a slug exists in both
			// countries.
			.innerJoin(businessAccounts, accountOfProfile)
			.where(and(businessInCountry(country), eq(businessProfiles.businessId, parentData.business_session.businessId)));

		if (businessRows.length === 0) {
			return { errorMessage: 'Business not found', history: [] };
		}

		const businessId = businessRows[0].id as number;

		const [policy, acceptance, history] = await Promise.all([
			getActiveLeadDataPolicy(),
			checkLeadDataPolicy(businessId, country),
			getAcceptanceHistory(businessId, country)
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
	}
};
