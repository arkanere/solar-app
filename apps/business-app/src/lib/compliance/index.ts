// Legal compliance module — SERVER-side public surface (PII compliance plan, item 8).
//
// Everything here reaches $lib/server/db, so this barrel must never be imported
// from a component: SvelteKit refuses to build when server code is pulled into
// the browser bundle. PolicyAcceptanceModal is therefore imported from its own
// file rather than re-exported here — four components did that through this
// barrel, and it broke `npm run build` for business-app entirely.
//
// Gates lead claims behind installer acceptance of the data-handling policy.
// Acceptances are valid for 90 days; the check runs passively at claim time.
// The compliance page surfaces status, history, and proactive renewal.

export {
	checkLeadDataPolicy,
	getActiveLeadDataPolicy,
	recordLeadDataAcceptance,
	getAcceptanceHistory,
	deriveComplianceState
} from './ComplianceChecker';

export {
	ACCEPTANCE_VALIDITY_DAYS,
	EXPIRY_WARNING_DAYS,
	type PolicyType,
	type ActivePolicy,
	type AcceptanceStatus,
	type AcceptanceRecord,
	type ComplianceState
} from './types';
