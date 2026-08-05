// Legal compliance module — server-side check logic (PII compliance plan, item 8).

import { db } from '$lib/server/db';
import { legalAcceptances, legalPolicies } from '@solar/db/schema';
import { and, desc, eq, lte, max, sql } from 'drizzle-orm';
import type { AuthCountry } from '$lib/auth/business/countryTables';
import {
	ACCEPTANCE_VALIDITY_DAYS,
	EXPIRY_WARNING_DAYS,
	type ActivePolicy,
	type AcceptanceStatus,
	type AcceptanceRecord,
	type ComplianceState
} from './types';

const POLICY_TYPE = 'lead_data_handling';

/**
 * The active lead-data-handling policy: the most recent already-effective row.
 * Returns null if no policy has been seeded yet.
 */
export async function getActiveLeadDataPolicy(): Promise<ActivePolicy | null> {
	const [row] = await db
		.select({
			id: legalPolicies.id,
			version: legalPolicies.version,
			summary: legalPolicies.summary
		})
		.from(legalPolicies)
		.where(and(eq(legalPolicies.type, POLICY_TYPE), lte(legalPolicies.effectiveAt, sql`NOW()`)))
		.orderBy(desc(legalPolicies.effectiveAt))
		.limit(1);

	if (!row) return null;
	return { id: row.id, type: POLICY_TYPE, version: row.version, summary: row.summary };
}

/**
 * Whether this business has a valid acceptance of the active lead-data-handling
 * policy within the last ACCEPTANCE_VALIDITY_DAYS days.
 *
 * Returns compliant:false when no policy is seeded, when there is no acceptance,
 * or when the latest acceptance has expired.
 */
export async function checkLeadDataPolicy(
	businessId: number,
	country: AuthCountry
): Promise<AcceptanceStatus> {
	const policy = await getActiveLeadDataPolicy();
	if (!policy) return { compliant: false, acceptedAt: null };

	const [row] = await db
		.select({ acceptedAt: max(legalAcceptances.acceptedAt) })
		.from(legalAcceptances)
		.where(
			and(
				eq(legalAcceptances.countryCode, country),
				eq(legalAcceptances.businessId, businessId),
				eq(legalAcceptances.policyId, policy.id)
			)
		);

	const acceptedAtRaw = row?.acceptedAt ?? null;
	if (!acceptedAtRaw) return { compliant: false, acceptedAt: null };

	const acceptedAt = new Date(acceptedAtRaw);
	const cutoff = Date.now() - ACCEPTANCE_VALIDITY_DAYS * 24 * 60 * 60 * 1000;
	return { compliant: acceptedAt.getTime() >= cutoff, acceptedAt };
}

/**
 * Record an acceptance of the active lead-data-handling policy for this business.
 * Returns the policy accepted, or null if no policy is seeded.
 */
export async function recordLeadDataAcceptance(
	businessId: number,
	country: AuthCountry,
	ipAddress: string | null
): Promise<ActivePolicy | null> {
	const policy = await getActiveLeadDataPolicy();
	if (!policy) return null;

	await db
		.insert(legalAcceptances)
		.values({ businessId, countryCode: country, policyId: policy.id, ipAddress });

	return policy;
}

/**
 * All lead-data-handling acceptances by this business, newest first, joined
 * with the policy version each acceptance covered.
 */
export async function getAcceptanceHistory(
	businessId: number,
	country: AuthCountry
): Promise<AcceptanceRecord[]> {
	const rows = await db
		.select({
			id: legalAcceptances.id,
			version: legalPolicies.version,
			summary: legalPolicies.summary,
			acceptedAt: legalAcceptances.acceptedAt
		})
		.from(legalAcceptances)
		.innerJoin(legalPolicies, eq(legalPolicies.id, legalAcceptances.policyId))
		.where(
			and(
				eq(legalAcceptances.countryCode, country),
				eq(legalAcceptances.businessId, businessId),
				eq(legalPolicies.type, POLICY_TYPE)
			)
		)
		.orderBy(desc(legalAcceptances.acceptedAt))
		.limit(50);

	return rows.map((row) => ({
		id: row.id,
		policyVersion: row.version,
		policySummary: row.summary,
		acceptedAt: new Date(row.acceptedAt)
	}));
}

/**
 * Overall standing from the latest acceptance date: expired when missing or
 * past ACCEPTANCE_VALIDITY_DAYS, expiring within the last EXPIRY_WARNING_DAYS
 * of validity, compliant otherwise.
 */
export function deriveComplianceState(acceptedAt: Date | null): ComplianceState {
	if (!acceptedAt) return 'expired';

	const dayMs = 24 * 60 * 60 * 1000;
	const expiresAt = acceptedAt.getTime() + ACCEPTANCE_VALIDITY_DAYS * dayMs;
	const now = Date.now();

	if (now >= expiresAt) return 'expired';
	if (now >= expiresAt - EXPIRY_WARNING_DAYS * dayMs) return 'expiring';
	return 'compliant';
}
