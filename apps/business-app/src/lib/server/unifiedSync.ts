// App-level dual-write half of the phase-2 cutover (migration 047): after a
// write endpoint touches a legacy table (leaddata/us_leaddata, businesses_1/
// us_businesses, in_business_profiles), it calls the matching sv_sync_*
// SQL function to project the row into the unified table. The 043/045/046
// triggers currently run the same functions, so the explicit call is
// idempotent — but it keeps business-app correct on its own once those
// triggers are dropped (after user-app/admin-app migrate).

interface Queryable {
	query(text: string, params?: unknown[]): Promise<unknown>;
}

export type SyncCountry = 'in' | 'us';

export async function syncLeadToUnified(
	db: Queryable,
	country: SyncCountry,
	sourceId: number
): Promise<void> {
	await db.query('SELECT sv_sync_lead($1, $2)', [country, sourceId]);
}

export async function syncBusinessToUnified(
	db: Queryable,
	country: SyncCountry,
	sourceId: number
): Promise<void> {
	await db.query('SELECT sv_sync_business($1, $2)', [country, sourceId]);
}

export async function syncAccountToUnified(
	db: Queryable,
	country: SyncCountry,
	sourceId: number
): Promise<void> {
	await db.query('SELECT sv_sync_account($1, $2)', [country, sourceId]);
}

// businesses_1 -> in_business_profiles/in_business_accounts (migration 050).
// IN-only: call after a businesses_1 write, BEFORE syncBusinessToUnified —
// sv_sync_business('in') sources from in_business_profiles. Idempotent with
// the 039/040 triggers; keeps the split tables fresh once those drop.
export async function syncInSplitTables(db: Queryable, sourceId: number): Promise<void> {
	await db.query('SELECT sv_sync_in_split($1)', [sourceId]);
}
