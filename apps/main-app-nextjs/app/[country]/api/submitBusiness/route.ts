/**
 * POST /{cc}/api/submitBusiness — the business signup.
 *
 * The write is `lib/server/business.ts`; this is the HTTP shape around it.
 * Validation is `@solar/validation`'s `submitBusinessSchema` through
 * `parseBody`, which is what the SvelteKit handler already does — unlike
 * `submitLead`, which logs there and enforces here, this endpoint has enforced
 * in both apps from the start.
 *
 * **Level2 is keyed by the country's own noun.** The form posts `district`
 * (IN) or `county` (US), never both, and the schema requires whichever one
 * belongs to the country. Reading the wrong key drops the value silently,
 * which is why the schema declares both and checks exactly one.
 *
 * The confirmation goes through `sendBusinessConfirmation` directly. The
 * SvelteKit handler reaches its own /{cc}/api/sendBusinessSubmissionConfirmation
 * over `event.fetch`; a second HTTP request and a second cold start to run
 * code in this process buys nothing, and the route still exists for outside
 * callers. It is awaited rather than floated — on a serverless invocation a
 * promise left running after the response is not guaranteed to finish — and
 * its failure is logged rather than returned, because by then both rows are
 * committed and a mail failure must not tell the signup it did not happen.
 */
import { parseBody, submitBusinessSchema } from '@solar/validation';
import { getCountry, isCountry } from '@/lib/countries';
import { insertBusiness, taxIdExists } from '@/lib/server/business';
import { sendBusinessConfirmation } from '@/lib/server/businessConfirmation';

/** Rows are written per request; nothing here may be cached or prerendered. */
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
  const parsed = await parseBody(request, submitBusinessSchema(country.code));
  if (!parsed.ok) {
    return Response.json(
      { success: false, error: parsed.error, fields: parsed.fields },
      { status: 400 }
    );
  }

  const data = parsed.data;
  // The schema guarantees the matching one is present.
  const level2 = (country.code === 'in' ? data.district : data.county) as string;

  try {
    // IN-only: see `taxIdExists`. `collectOnSignup` is the same condition the
    // form uses to decide whether to show the field, so the two cannot drift.
    if (country.taxId.collectOnSignup && data.gstn) {
      if (await taxIdExists(country.code, data.gstn)) {
        return Response.json(
          {
            success: false,
            error: `A business with this ${country.taxId.label} already exists. Please check your ${country.taxId.label} or contact support if you believe this is an error.`
          },
          { status: 400 }
        );
      }
    }

    const businessId = await insertBusiness(country.code, {
      businessName: data.businessName,
      address: data.address,
      plusCode: data.plusCode,
      phoneNumber: data.phoneNumber,
      whatsappNumber: data.whatsappNumber,
      email: data.email,
      loginEmail: data.login_email,
      website: data.website,
      taxId: data.gstn,
      state: data.state,
      level2,
      city: data.city
    });

    try {
      await sendBusinessConfirmation(country, {
        businessName: data.businessName,
        address: data.address,
        city: data.city,
        level2,
        state: data.state,
        plusCode: data.plusCode,
        phoneNumber: data.phoneNumber,
        whatsappNumber: data.whatsappNumber,
        email: data.email,
        loginEmail: data.login_email,
        website: data.website,
        taxId: data.gstn
      });
    } catch (mailError) {
      console.error('Business confirmation mail failed:', mailError);
    }

    return Response.json({ success: true, id: businessId });
  } catch (error) {
    console.error('Error inserting business data:', error);
    return Response.json({ success: false, error: 'Failed to submit business' }, { status: 500 });
  }
}
