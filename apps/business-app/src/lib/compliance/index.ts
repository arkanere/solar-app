// Legal compliance module — public surface (PII compliance plan, item 8).
//
// Gates lead claims behind installer acceptance of the data-handling policy.
// Acceptances are valid for 90 days; the check runs passively at claim time.

export {
	checkLeadDataPolicy,
	getActiveLeadDataPolicy,
	recordLeadDataAcceptance,
	type Queryable
} from './ComplianceChecker';

export {
	ACCEPTANCE_VALIDITY_DAYS,
	type PolicyType,
	type ActivePolicy,
	type AcceptanceStatus
} from './types';

export { default as PolicyAcceptanceModal } from './PolicyAcceptanceModal.svelte';
