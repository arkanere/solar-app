// Legal compliance module — shared types (PII compliance plan, item 8).

/** Policy categories tracked by the compliance module. */
export type PolicyType = 'lead_data_handling';

/** The active version of a legal policy, as shown to installers. */
export interface ActivePolicy {
	id: number;
	type: PolicyType;
	version: string;
	summary: string;
}

/** Result of checking whether an installer's acceptance is current. */
export interface AcceptanceStatus {
	compliant: boolean;
	acceptedAt: Date | null;
}

/** Acceptances are considered valid for this many days before re-acceptance. */
export const ACCEPTANCE_VALIDITY_DAYS = 90;

/** Within this many days of expiry, the compliance page shows an "expiring" warning. */
export const EXPIRY_WARNING_DAYS = 14;

/** Overall compliance standing shown on the compliance page. */
export type ComplianceState = 'compliant' | 'expiring' | 'expired';

/** A single historical acceptance, joined with the policy version it covered. */
export interface AcceptanceRecord {
	id: number;
	policyVersion: string;
	policySummary: string;
	acceptedAt: Date;
}
