/**
 * The business-signup confirmation email. Ported from
 * apps/main-app/src/routes/[country=country]/api/sendBusinessSubmissionConfirmation/+server.ts.
 *
 * The body lives here rather than in the route for the same reason
 * `leadConfirmation.ts` does: two callers need it. `submitBusiness` calls this
 * directly — in SvelteKit it reached the route over `event.fetch`, which buys
 * a second request and a second cold start to run code already in this
 * process — and the route itself is kept so the URL inventory in routes.md
 * still holds.
 *
 * The same two departures from the original as the lead confirmation:
 *
 *  - **Values are HTML-escaped.** The original interpolates the business name,
 *    address and website straight into the markup, and admin@solarvipani.com
 *    is copied on every one of these. A signup form is a lower-trust input
 *    than a lead form, not a higher one.
 *  - **An absent optional field drops nothing.** It prints "Not provided",
 *    which is what the original does and is right here: an operator reading
 *    this is checking a form for completeness, so a missing Plus Code is
 *    information. That is the opposite call to the lead confirmation, where a
 *    blank comment row is noise.
 *
 * The country differences the original had already collapsed are kept
 * collapsed: one template, with the level2 noun and the tax-id label coming
 * from the config, and the tax-id line shown only when a value is present
 * (US does not collect one at signup).
 */
import type { CountryConfig } from '@/lib/countries';
import { sendEmail } from '@/lib/server/email';

const ADMIN_EMAIL = 'admin@solarvipani.com';

export type BusinessConfirmation = {
  businessName: string;
  address: string;
  city: string;
  /** District (IN) or county (US) — the caller resolves which. */
  level2: string;
  state: string;
  plusCode?: string | null;
  phoneNumber: string;
  /** The public address shown on the profile. */
  email: string;
  /** Where the login instructions go. */
  loginEmail: string;
  /**
   * Accepted and NOT rendered, matching the original: `submitBusiness` has
   * always passed a WhatsApp number to this template and the template has
   * never printed it. That looks like an oversight, but adding the line would
   * change what an operator reads in a live email, so it stays as it is and
   * is recorded here instead.
   */
  whatsappNumber?: string | null;
  website?: string | null;
  /** GSTN for IN; absent for US. */
  taxId?: string | null;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** "Not provided" for an empty optional, escaped for everything else. */
function show(value: string | null | undefined): string {
  return value ? escapeHtml(value) : 'Not provided';
}

export async function sendBusinessConfirmation(
  country: CountryConfig,
  business: BusinessConfirmation
): Promise<void> {
  const subject = `Business Details Received For Listing - ${country.brandName}`;

  const message = `
            <p>Dear ${escapeHtml(business.businessName)} Team,</p>
            <p>Thank you for submitting your business details with ${country.brandName} for business listing!</p>
            <p>Here are the business details submitted in the form:</p>
            <ul>
                <li><strong>Business Name:</strong> ${escapeHtml(business.businessName)}</li>
                <li><strong>Address:</strong> ${escapeHtml(business.address)}</li>
                <li><strong>City:</strong> ${escapeHtml(business.city)}</li>
                <li><strong>${country.levels.level2.singular}:</strong> ${escapeHtml(business.level2)}</li>
                <li><strong>State:</strong> ${escapeHtml(business.state)}</li>
                <li><strong>Plus Code:</strong> ${show(business.plusCode)}</li>
                <li><strong>Phone Number:</strong> ${escapeHtml(business.phoneNumber)}</li>
                <li><strong>Email:</strong> ${escapeHtml(business.email)}</li>
                <li><strong>Login Email:</strong> ${escapeHtml(business.loginEmail)}</li>
                <li><strong>Website:</strong> ${show(business.website)}</li>
                ${
                  business.taxId
                    ? `<li><strong>${country.taxId.label}:</strong> ${escapeHtml(business.taxId)}</li>`
                    : ''
                }
            </ul>
            <p>Our team will review your business details shortly. Once verified, your business will be visible on our platform.</p>
            <p>After verification, you will receive login credentials to manage your business profile via email.</p>
            <p>If you have any questions or need immediate assistance, feel free to contact us at <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a>.</p>
            <p>Thank you for choosing ${country.brandName}. We look forward to a successful partnership!</p>
            <p>Best Regards,<br><strong>${country.brandName} Team</strong></p>
        `;

  // To the login address and admin. The public `email` is deliberately not a
  // recipient: it is the address that goes on the profile page, which is often
  // a shared inbox, and the login instructions this promises are not for it.
  const result = await sendEmail([business.loginEmail, ADMIN_EMAIL], subject, message, {
    isHtml: true
  });
  if (!result.success) {
    throw new Error(result.error);
  }
}
