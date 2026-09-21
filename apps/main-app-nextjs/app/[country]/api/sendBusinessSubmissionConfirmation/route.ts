/**
 * POST /{cc}/api/sendBusinessSubmissionConfirmation — the business-signup
 * confirmation email.
 *
 * The body is in `lib/server/businessConfirmation.ts`, because `submitBusiness`
 * needs the same template and calls it directly rather than over HTTP. This
 * route is kept for the reason the lead equivalent is: it is in routes.md's
 * inventory and outside callers use it.
 *
 * **Level2 arrives under the country's own noun.** Callers send `district`
 * (IN) or `county` (US); `level2` is accepted too, since this app's own code
 * has no reason to know the noun. Reading the wrong key drops the value
 * silently, which is the trap `submitBusiness` documents.
 *
 * The `!email` 400 is carried across verbatim even though the mail goes to
 * `login_email` and not to `email`. It reads like a bug and is not fixed here:
 * `submitBusinessSchema` requires both, so no real signup can reach it, and
 * changing which field gates the send is a behaviour change to a live
 * endpoint that belongs with whatever needs it.
 */
import { getCountry, isCountry } from '@/lib/countries';
import { sendBusinessConfirmation } from '@/lib/server/businessConfirmation';

/** Sends mail per request; nothing here may be cached or prerendered. */
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

  try {
    const data = await request.json();
    const level2 = data.district ?? data.county ?? data.level2 ?? '';

    if (!data.email) {
      return Response.json(
        { success: false, error: 'No email provided for confirmation' },
        { status: 400 }
      );
    }

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

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error sending business submission confirmation:', error);
    return Response.json(
      { success: false, error: 'Failed to send business confirmation email' },
      { status: 500 }
    );
  }
}
