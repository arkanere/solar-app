// Legal compliance module — server-side check logic (PII compliance plan, item 8).

import {
	ACCEPTANCE_VALIDITY_DAYS,
	EXPIRY_WARNING_DAYS,
	type ActivePolicy,
	type AcceptanceStatus,
	type AcceptanceRecord,
	type ComplianceState
} from './types';

// Minimal shape of the pg/@vercel/postgres pool or client we rely on.
export interface Queryable {
	query<T = Record<string, unknown>>(
		text: string,
		params?: unknown[]
	): Promise<{ rows: T[] }>;
}

const POLICY_TYPE = 'lead_data_handling';

/**
 * The active lead-data-handling policy: the most recent already-effective row.
 * Returns null if no policy has been seeded yet.
 */
export async function getActiveLeadDataPolicy(pool: Queryable): Promise<ActivePolicy | null> {
	const result = await pool.query<{
		id: number;
		version: string;
		summary: string;
	}>(
		`SELECT id, version, summary
		   FROM legal_policies
		  WHERE type = $1 AND effective_at <= NOW()
		  ORDER BY effective_at DESC
		  LIMIT 1`,
		[POLICY_TYPE]
	);

	const row = result.rows[0];
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
	pool: Queryable,
	businessId: number
): Promise<AcceptanceStatus> {
	const policy = await getActiveLeadDataPolicy(pool);
	if (!policy) return { compliant: false, acceptedAt: null };

	const result = await pool.query<{ accepted_at: string | null }>(
		`SELECT MAX(accepted_at) AS accepted_at
		   FROM legal_acceptances
		  WHERE business_id = $1 AND policy_id = $2`,
		[businessId, policy.id]
	);

	const acceptedAtRaw = result.rows[0]?.accepted_at ?? null;
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
	pool: Queryable,
	businessId: number,
	ipAddress: string | null
): Promise<ActivePolicy | null> {
	const policy = await getActiveLeadDataPolicy(pool);
	if (!policy) return null;

	await pool.query(
		`INSERT INTO legal_acceptances (business_id, policy_id, ip_address)
		 VALUES ($1, $2, $3)`,
		[businessId, policy.id, ipAddress]
	);

	return policy;
}

/**
 * All lead-data-handling acceptances by this business, newest first, joined
 * with the policy version each acceptance covered.
 */
export async function getAcceptanceHistory(
	pool: Queryable,
	businessId: number
): Promise<AcceptanceRecord[]> {
	const result = await pool.query<{
		id: number;
		version: string;
		summary: string;
		accepted_at: string;
	}>(
		`SELECT a.id, p.version, p.summary, a.accepted_at
		   FROM legal_acceptances a
		   JOIN legal_policies p ON p.id = a.policy_id
		  WHERE a.business_id = $1 AND p.type = $2
		  ORDER BY a.accepted_at DESC
		  LIMIT 50`,
		[businessId, POLICY_TYPE]
	);

	return result.rows.map((row) => ({
		id: row.id,
		policyVersion: row.version,
		policySummary: row.summary,
		acceptedAt: new Date(row.accepted_at)
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
