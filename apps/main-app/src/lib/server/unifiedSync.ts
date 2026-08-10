// App-level dual-write half of the phase-2 cutover (migration 047): after a
// write endpoint touches a store table (leaddata, business_profiles), it calls
// the matching sv_sync_* SQL function to project the row into the unified
// table. The 043/045/046 triggers that used to run the same functions are gone
// (051), so these explicit calls are now the only thing keeping the projections
// fresh.
//
// syncAccountToUnified went with migration 062: business_accounts stopped being
// a projection when businesses_1, its source, was archived. submitBusiness —
// this app's only caller — writes the account row directly now.
//
// `businesses` and `leads` are still projections. 063 retires the first of them.

import { sql } from 'drizzle-orm';
import type { Database } from '@solar/db';

// Accepts the module-scoped `db` or a transaction handle from `db.transaction()`
// — both expose `execute`, so a caller inside a transaction still projects its
// rows on the same connection. The sv_sync_* functions have no query-builder
// equivalent, so every call here is a deliberate `sql` escape hatch. Same
// shape as business-app's unifiedSync (its Phase 6a).
type SyncExecutor = Pick<Database, 'execute'>;

export type SyncCountry = 'in' | 'us';

export async function syncLeadToUnified(
	db: SyncExecutor,
	country: SyncCountry,
	sourceId: number
): Promise<void> {
	await db.execute(sql`SELECT sv_sync_lead(${country}, ${sourceId})`);
}

export async function syncBusinessToUnified(
	db: SyncExecutor,
	country: SyncCountry,
	sourceId: number
): Promise<void> {
	await db.execute(sql`SELECT sv_sync_business(${country}, ${sourceId})`);
}

