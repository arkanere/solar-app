// The app-level half of the projection cutover (migration 047): after a write
// endpoint touches `leaddata`, it calls sv_sync_lead to project the row into
// `leads`. The 043/045/046 triggers that used to run the same function are gone
// (051), so this explicit call is the only thing keeping `leads` fresh.
//
// `leads` is the last projection standing. The other three all became stores,
// and their sync helpers went with them:
//   syncInSplitTables      062 — sv_sync_in_split was businesses_1 ->
//                          business_profiles; the target has been written
//                          directly since 054.
//   syncAccountToUnified   062 — business_accounts stopped being a projection
//                          when businesses_1 was archived. There was nothing to
//                          repoint sv_sync_account at: business_profiles holds
//                          no credential columns, by the separation in
//                          docs/account-profile-separation.md.
//   syncBusinessToUnified  064 — `businesses` was a pure duplicate of
//                          business_profiles under different column names. 063
//                          gave the source those names and moved every read
//                          across; 064 dropped table and function together.
//
// So a business is now exactly two rows written directly — business_profiles +
// business_accounts — with nothing to project. See next-steps.md item 2 for why
// `leads` is a candidate to go the same way: 3 leaddata rows have no projection
// and 156 projected rows have no source, which is what a projection nobody
// drives reliably looks like.

import { sql } from 'drizzle-orm';
import type { Database } from '@solar/db';

// Accepts the module-scoped `db` or a transaction handle from `db.transaction()`
// — both expose `execute`, so a caller inside a transaction still projects its
// rows on the same connection. sv_sync_lead has no query-builder equivalent, so
// the call below is a deliberate `sql` escape hatch.
type SyncExecutor = Pick<Database, 'execute'>;

export type SyncCountry = 'in' | 'us';

export async function syncLeadToUnified(
	db: SyncExecutor,
	country: SyncCountry,
	sourceId: number
): Promise<void> {
	await db.execute(sql`SELECT sv_sync_lead(${country}, ${sourceId})`);
}
