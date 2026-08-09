// App-level dual-write half of the phase-2 cutover (migration 047): after a
// write endpoint touches a legacy table (leaddata/us_leaddata, businesses_1/
// us_businesses, business_profiles), it calls the matching sv_sync_*
// SQL function to project the row into the unified table. The 043/045/046
// triggers currently run the same functions, so the explicit call is
// idempotent — but it keeps main-app correct on its own once those
// triggers are dropped (phase 2.4, after admin-app migrates).

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

export async function syncAccountToUnified(
	db: SyncExecutor,
	country: SyncCountry,
	sourceId: number
): Promise<void> {
	await db.execute(sql`SELECT sv_sync_account(${country}, ${sourceId})`);
}
