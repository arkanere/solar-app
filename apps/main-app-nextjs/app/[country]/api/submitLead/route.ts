/**
 * POST /{cc}/api/submitLead — README open item 7.
 *
 * Both countries post here. The SvelteKit form sends IN cross-origin to
 * user-app (user.solarvipani.com/in/api/submitLead) and only non-IN here;
 * decided 2026-09-18 that this app posts local for both, so there is one code
 * path and no dependency on another app's Access-Control-Allow-Origin
 * allowlist. The row it writes is the same row either way — user-app's handler
 * also inserts `leaddata` with country_code 'in'.
 *
 * Validation is `@solar/validation`'s `leadSchema`, the canonical rule set,
 * reached through `parseBody`. This endpoint briefly used the form's own
 * `validateLead` instead; that was wrong twice over. The package exists
 * precisely because hand-rolled copies had drifted — three incompatible phone
 * rules and two email rules were live at once — and the local copy had already
 * started a fourth divergence: a second email regex, a `comment` the live
 * endpoint treats as optional, and no max lengths at all, so an over-long name
 * reached `varchar(255)` and came back as a 500 instead of a 400.
 *
 * One deliberate difference from the SvelteKit handler remains: that one calls
 * `inspectBody`, which logs and never rejects, because three different forms
 * with three different phone rules feed it and rejecting on a guess would drop
 * real leads. Here the only caller is this app's own LeadForm, so `parseBody`
 * enforces. If another form is ever pointed at this endpoint, re-read that
 * reasoning before assuming enforcement is still safe.
 *
 * It now sends the confirmation email (README open item 1, closed 2026-09-18).
 * The SvelteKit handler reaches its own /{cc}/api/sendLeadSubmissionConfirmation
 * over `event.fetch`; this one calls `sendLeadConfirmation` directly, because a
 * second HTTP request and a second cold start to run code already in this
 * process buys nothing. The route still exists for outside callers.
 */
import { leadSchema, parseBody } from '@solar/validation';
import { getCountry, isCountry } from '@/lib/countries';
import { insertLead } from '@/lib/server/leads';
import { sendLeadConfirmation } from '@/lib/server/leadConfirmation';

/** Lead rows are written per request; nothing here may be cached or prerendered. */
export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ country: string }> }
) {
  const { country: code } = await params;
  if (!isCountry(code)) {
    return Response.json({ success: false, error: 'Unknown country' }, { status: 404 });
  }
  const country = getCountry(code);

  // `parseBody` reports malformed JSON as a validation failure rather than
  // throwing, so a bad body is a 400 and not a 500.
  const parsed = await parseBody(request, leadSchema(country.code));
  if (!parsed.ok) {
    return Response.json(
      { success: false, error: parsed.error, fields: parsed.fields },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Forms send pinCode (IN legacy name) or zipCode (US legacy name); this
  // app's form sends postalCode. Same coalescing order the schema validates on.
  const postalCode = data.pinCode ?? data.zipCode ?? data.postalCode ?? '';

  try {
    const lead = await insertLead(country.code, {
      name: data.name,
      phone: data.phone,
      postalCode,
      type: data.type,
      comment: data.comment,
      urlParams: data.urlParam,
      email: data.email,
      marketingConsent: data.marketing_consent === true
    });

    // The row is already committed, so a mail failure must not turn a captured
    // lead into a 500 — it is logged and the visitor still gets a success.
    // Awaited rather than floated: on a serverless invocation a promise left
    // running after the response is not guaranteed to finish. `email` is
    // optional in `leadSchema`, and there is nobody to confirm to without one.
    if (data.email) {
      try {
        await sendLeadConfirmation(country, {
          name: data.name,
          phone: data.phone,
          email: data.email,
          postalCode,
          comment: data.comment,
          urlParam: data.urlParam
        });
      } catch (mailError) {
        console.error('Lead confirmation mail failed:', mailError);
      }
    }

    return Response.json({
      success: true,
      id: lead.sourceId,
      reference_uuid: lead.referenceUuid
    });
  } catch (error) {
    console.error('Error inserting lead data:', error);
    return Response.json({ success: false, error: 'Failed to submit lead' }, { status: 500 });
  }
}
