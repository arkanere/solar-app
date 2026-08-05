// App-level dual-write half of the phase-2 cutover (main-app migration 047):
// after a write endpoint touches leaddata, it calls sv_sync_lead() to project
// the row into the unified `leads` table. The 045 trigger currently runs the
// same function, so the explicit call is idempotent — but it keeps user-app
// correct on its own once that trigger is dropped (phase 2.4).

/**
 * The seam to the Drizzle phase. main-app and business-app's copies of this
 * module take `Pick<Database, 'execute'>`, which both `db` and a
 * `db.transaction()` handle satisfy, so a caller inside a transaction projects
 * on the same connection. user-app has no `@solar/db` dependency yet, so this
 * still names the raw-pool shape — replacing this one type with that import is
 * what the Drizzle phase does here.
 */
export interface Queryable {
	query(text: string, params?: unknown[]): Promise<unknown>;
}

/**
 * @param sourceId legacy-table id (leaddata.id / us_leaddata.id)
 */
export async function syncLeadToUnified(
	db: Queryable,
	country: 'in' | 'us',
	sourceId: number
): Promise<void> {
	await db.query('SELECT sv_sync_lead($1, $2)', [country, sourceId]);
}
