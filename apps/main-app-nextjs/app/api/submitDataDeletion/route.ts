/**
 * POST /api/submitDataDeletion — the DPDP erasure request behind
 * `/data-deletion`. Ported from
 * apps/main-app/src/routes/api/submitDataDeletion/+server.ts.
 *
 * The sibling of `submitDataAccess`, and the same shape for the same reasons
 * — see that file's header for why both live at the root rather than under
 * `/{cc}` and why the 42P01 branch is not carried across.
 *
 * **No email.** The access handler acknowledges by mail; this one never has,
 * and the page says so: the visitor is told the request is processed within
 * 30 days and that the confirmation arrives when it IS processed, not when it
 * is received. The asymmetry is real, not an omission — but it does mean
 * nothing mails the team that a deletion request has landed, so the queue is
 * only visible in the table. Worth closing when someone owns that queue.
 */
import { dataRequestSchema, parseBody } from '@solar/validation';
import { insertDataDeletionRequest } from '@/lib/server/dataRequests';

/** A compliance request is a row per request; nothing here may be cached. */
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const parsed = await parseBody(request, dataRequestSchema);
  if (!parsed.ok) {
    return Response.json(
      { success: false, error: parsed.error, fields: parsed.fields },
      { status: 400 }
    );
  }

  const { email, phone, reason } = parsed.data;

  try {
    const id = await insertDataDeletionRequest({ email, phone, reason });
    return Response.json({
      success: true,
      id,
      message: 'Data deletion request submitted successfully'
    });
  } catch (error) {
    console.error('Error inserting data deletion request:', error);
    return Response.json(
      { success: false, error: 'Failed to submit data deletion request' },
      { status: 500 }
    );
  }
}
