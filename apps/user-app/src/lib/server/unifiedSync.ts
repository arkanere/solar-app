// App-level dual-write half of the phase-2 cutover (main-app migration 047):
// after a write endpoint touches leaddata, it calls sv_sync_lead() to project
// the row into the unified `leads` table. The 045 trigger currently runs the
// same function, so the explicit call is idempotent — but it keeps user-app
// correct on its own once that trigger is dropped (phase 2.4).

import { sql } from 'drizzle-orm';
import type { Database } from '@solar/db';

// Accepts the module-scoped `db` or a transaction handle from `db.transaction()`
// — both expose `execute`, so a caller inside a transaction still projects its
// rows on the same connection. sv_sync_lead has no query-builder equivalent, so
// the call is a deliberate `sql` escape hatch. Same shape as main-app's and
// business-app's copies (its Phase 6a).
type SyncExecutor = Pick<Database, 'execute'>;

/**
 * @param sourceId legacy-table id (leaddata.id)
 */
export async function syncLeadToUnified(
	db: SyncExecutor,
	country: 'in' | 'us',
	sourceId: number
): Promise<void> {
	await db.execute(sql`SELECT sv_sync_lead(${country}, ${sourceId})`);
}
