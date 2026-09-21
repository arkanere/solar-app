/**
 * POST /api/submitDataAccess — the DPDP right-of-access request behind
 * `/data-access`. Ported from
 * apps/main-app/src/routes/api/submitDataAccess/+server.ts.
 *
 * Not under `/{cc}`, and that is the original's shape rather than an
 * oversight: the two compliance pages live at the root for every country
 * (`lib/countries/moved-content.ts`), so the endpoints they post to do too.
 * There is no country to gate on and no country column on either table.
 *
 * The acknowledgement email is sent to the requester AND to
 * admin@solarvipani.com, because that second copy is how the team learns a
 * request exists — nothing in this app reads `data_access_requests` back.
 * A mail failure is logged and swallowed for the reason `submitLead` gives:
 * the row is already committed, and turning a recorded compliance request
 * into a 500 would make the visitor submit it again.
 *
 * Fulfilment itself is manual — the team emails a copy of the data within 30
 * days, which is what the page promises and what this mail repeats.
 *
 * ONE THING NOT CARRIED ACROSS: both SvelteKit handlers branch on Postgres
 * error 42P01 and answer "Database table not found. Please contact support."
 * That tells a visitor which of our tables is missing and tells them to do
 * something about it, neither of which is theirs to act on — a missing table
 * is a deploy fault, not a bad request. It is a 500 with the same message as
 * any other failure, and the real cause is in the log.
 */
import { dataRequestSchema, parseBody } from '@solar/validation';
import { sendEmail } from '@/lib/server/email';
import { insertDataAccessRequest } from '@/lib/server/dataRequests';

/** A compliance request is a row per request; nothing here may be cached. */
export const dynamic = 'force-dynamic';

/** A local const, as leadConfirmation.ts and businessConfirmation.ts have it. */
const ADMIN_EMAIL = 'admin@solarvipani.com';

const SUBJECT = 'We received your data access request - Solar Vipani';

function acknowledgement(): string {
  return `
    <p>Hello,</p>
    <p>We have received your request to access the personal data we hold about you.</p>
    <p>Our team will review your request and email you a copy of your data within 30 days,
       in line with applicable data protection laws.</p>
    <p>If you have any questions, please contact us at
       <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a>.</p>
    <p>Best Regards,<br><strong>Solar Vipani Team</strong></p>
    `;
}

export async function POST(request: Request) {
  const parsed = await parseBody(request, dataRequestSchema);
  if (!parsed.ok) {
    return Response.json(
      { success: false, error: parsed.error, fields: parsed.fields },
      { status: 400 }
    );
  }

  const { email, phone, reason } = parsed.data;

  let id: number;
  try {
    id = await insertDataAccessRequest({ email, phone, reason });
  } catch (error) {
    console.error('Error inserting data access request:', error);
    return Response.json(
      { success: false, error: 'Failed to submit data access request' },
      { status: 500 }
    );
  }

  // `sendEmail` reports failure as a result rather than throwing, so this is a
  // check and not a try/catch.
  const mail = await sendEmail([email, ADMIN_EMAIL], SUBJECT, acknowledgement(), { isHtml: true });
  if (!mail.success) {
    console.error('Error sending data access acknowledgement email:', mail.error);
  }

  return Response.json({
    success: true,
    id,
    message: 'Data access request submitted successfully'
  });
}
