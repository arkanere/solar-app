/**
 * The two DPDP compliance requests: access and deletion. Ported from
 * apps/main-app/src/routes/api/submitDataAccess/+server.ts and
 * .../submitDataDeletion/+server.ts.
 *
 * They are one module because they are one shape — `dataRequestSchema` is the
 * body of both, and both write a single row and return its id. Only the table
 * differs. The endpoints stay two because the URLs are two.
 *
 * Neither request is FULFILLED here. A row in `data_access_requests` or
 * `data_deletion_requests` is a work item; the team acts on it by hand within
 * 30 days, which is what both pages promise. Nothing in this app reads these
 * tables back.
 *
 * `status` and `created_at` are left to the column defaults ('pending' and
 * defaultNow()). The SvelteKit deletion handler wrote both explicitly — an
 * `sql\`NOW()\`` escape hatch and a literal 'pending' — while its access
 * handler relied on the defaults for exactly the same columns. The defaults
 * are the same value either way, so the two are made to agree rather than
 * carrying the inconsistency across.
 *
 * THE TWO TABLES DISAGREE ON WIDTH, and `dataRequestSchema` is wider than
 * both. `data_access_requests` types email and phone as `text`, so anything
 * the schema accepts fits. `data_deletion_requests` types them
 * `varchar(255)` and `varchar(20)`, while the schema allows a 40-character
 * phone and puts no ceiling on an email — so a 21-character phone is a
 * database error and therefore a 500 on the deletion endpoint only. Live
 * SvelteKit has the same hole. Not fixed here: the ceiling belongs to
 * `@solar/validation`, which both apps share, and narrowing it is a change to
 * live behaviour rather than to this port. README open item.
 */
import { dataAccessRequests, dataDeletionRequests } from '@solar/db/schema';
import { db } from '@/lib/server/db';

export type DataRequest = {
  email: string;
  phone?: string | null;
  reason?: string | null;
};

/** Returns the new row's id — what the endpoint echoes back to the form. */
export async function insertDataAccessRequest(request: DataRequest): Promise<number> {
  const [row] = await db
    .insert(dataAccessRequests)
    .values({ email: request.email, phone: request.phone, reason: request.reason })
    .returning({ id: dataAccessRequests.id });

  return row!.id;
}

export async function insertDataDeletionRequest(request: DataRequest): Promise<number> {
  const [row] = await db
    .insert(dataDeletionRequests)
    .values({ email: request.email, phone: request.phone, reason: request.reason })
    .returning({ id: dataDeletionRequests.id });

  return row!.id;
}
