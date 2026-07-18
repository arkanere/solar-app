// App-level dual-write half of the phase-2 cutover (main-app migration 047):
// after a write endpoint touches leaddata, it calls sv_sync_lead() to project
// the row into the unified `leads` table. The 045 trigger currently runs the
// same function, so the explicit call is idempotent — but it keeps user-app
// correct on its own once that trigger is dropped (phase 2.4).

/**
 * @param {{ query(text: string, params?: unknown[]): Promise<unknown> }} db
 * @param {'in' | 'us'} country
 * @param {number} sourceId legacy-table id (leaddata.id / us_leaddata.id)
 */
export async function syncLeadToUnified(db, country, sourceId) {
	await db.query('SELECT sv_sync_lead($1, $2)', [country, sourceId]);
}
