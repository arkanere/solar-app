/**
 * POST /{cc}/api/sendLeadSubmissionConfirmation.
 *
 * Unified replacement for the two legacy handlers, exactly as the SvelteKit
 * port was: they differed only in brand name, postal-code label and whether a
 * dashboard magic link is offered, all of which come from CountryConfig.
 *
 * The body of the email is `lib/server/leadConfirmation.ts`, because
 * `submitLead` calls it too — in process, not over HTTP. This route stays
 * because it is a published URL (routes.md), and because it is the seam a
 * form that is not this app's own can use.
 *
 * No auth on it: it sends a fixed template to the address in the body and to
 * admin@, mints nothing an anonymous caller can read back, and matches the
 * live endpoint. `generateUserMagicLink` next door is the one that must stay
 * guarded, because that one returns a working sign-in link.
 */
import { getCountry, isCountry } from '@/lib/countries';
import { sendLeadConfirmation } from '@/lib/server/leadConfirmation';

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
    const { name, phone, comment, urlParam, email } = data;
    // Forms and submitLead send pinCode (IN) or zipCode (US).
    const postalCode = data.pinCode ?? data.zipCode ?? data.postalCode ?? '';

    if (!email) {
      return Response.json(
        { success: false, error: 'No email provided for confirmation' },
        { status: 400 }
      );
    }

    const result = await sendLeadConfirmation(country, {
      name,
      phone,
      email,
      postalCode,
      comment,
      urlParam
    });

    return Response.json({ success: true, ...result });
  } catch (error) {
    console.error('Error sending lead submission confirmation:', error);
    return Response.json(
      { success: false, error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
}
