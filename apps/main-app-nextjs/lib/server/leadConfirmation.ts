/**
 * The lead confirmation email. Ported from
 * apps/main-app/src/routes/[country=country]/api/sendLeadSubmissionConfirmation/+server.ts.
 *
 * The body lives here rather than in the route because two callers need it:
 * the route itself (kept, so the URL inventory in routes.md still holds) and
 * `submitLead`, which in SvelteKit reached the route over HTTP with
 * `event.fetch`. There is no reason to pay for a second request and a second
 * cold start to call code in the same process, and the HTTP hop is what made
 * `internalSecretHeaders` necessary.
 *
 * Two departures from the original, both in the message body:
 *
 *  - **Values are HTML-escaped.** The original interpolates `name` and
 *    `comment` straight into the markup. Whatever the visitor typed is then
 *    live HTML in an inbox — including admin@solarvipani.com's, which is
 *    copied on every one of these.
 *  - **An empty comment drops its row** instead of printing `undefined` or a
 *    blank bullet. `comment` is optional in `leadSchema`.
 *  - **The link is this app's action colour**, not the legacy `#0056b3`, which
 *    was user-app's old accidental blue. An email cannot read a CSS variable,
 *    so the hex is written out — the one place in this app where that is true,
 *    hence the lint exemption below.
 *
 * The magic-link block is still conditional on having a URL, which is what let
 * the IN version's two near-identical templates collapse into one.
 */
import type { CountryConfig } from '@/lib/countries';
import { sendEmail } from '@/lib/server/email';
import { mintUserMagicLink } from '@/lib/server/magicLink';

const ADMIN_EMAIL = 'admin@solarvipani.com';

/* eslint-disable-next-line no-restricted-syntax -- `--color-action`,
   oklch(47.5% 0.155 240), resolved to sRGB. Mail clients have no token layer
   and many strip <style>, so an inline hex is the only way to colour a link in
   an email. Re-run `npm run check:contrast` if the token moves: 6.33:1 on white. */
const LINK_COLOUR = '#0062a9';

export type LeadConfirmation = {
  name: string;
  phone: string;
  email: string;
  postalCode: string;
  comment?: string | null;
  urlParam?: string | null;
};

export type LeadConfirmationResult = {
  magicLinkGenerated: boolean;
  isExclusiveLead: boolean;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendLeadConfirmation(
  country: CountryConfig,
  lead: LeadConfirmation
): Promise<LeadConfirmationResult> {
  const { name, phone, email, postalCode, comment, urlParam } = lead;

  // Exclusive leads go to a single installer, so they get no dashboard link.
  const isExclusiveLead = Boolean(urlParam && urlParam.includes('/solar-panel-installer/'));

  let magicLinkUrl = '';
  if (country.features.userAccounts && !isExclusiveLead) {
    try {
      magicLinkUrl = await mintUserMagicLink(country.code, { email, name });
    } catch (magicLinkError) {
      // The confirmation is still worth sending without a dashboard link.
      console.error('Error generating magic link:', magicLinkError);
    }
  }

  const subject = `Thank You for Your Inquiry - ${country.brandName}`;

  const message = `
            <p>Dear ${escapeHtml(name)},</p>
            <p>Thank you for submitting your inquiry on ${country.brandName}! We appreciate your interest in solar energy solutions.</p>
            <p>Here are the details of your request:</p>
            <ul>
                <li><strong>Phone:</strong> ${escapeHtml(phone)}</li>
                <li><strong>Email:</strong> ${escapeHtml(email)}</li>
                <li><strong>${country.postalCode.label}:</strong> ${escapeHtml(postalCode)}</li>
                ${comment ? `<li><strong>Comment:</strong> ${escapeHtml(comment)}</li>` : ''}
            </ul>
            ${
              magicLinkUrl
                ? `
            <p><strong>Track Your Solar Journey:</strong></p>
            <p>Access your personalized dashboard to track your installation progress and view interested installers: <a href="${magicLinkUrl}" style="color: ${LINK_COLOUR}; font-weight: bold;">Click here to access your dashboard</a></p>
            `
                : ''
            }
            <p>One of our team members or a verified solar installer in your area will be in touch with you shortly to assist you further.</p>
            <p>If you have any questions or need immediate assistance, feel free to contact us at <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a>.</p>
            <p>Thank you for choosing ${country.brandName}. We look forward to helping you find the perfect solar solution!</p>
            <p>Best Regards,<br><strong>${country.brandName} Team</strong></p>
        `;

  // Send to both the customer and admin.
  const result = await sendEmail([email, ADMIN_EMAIL], subject, message, { isHtml: true });
  if (!result.success) {
    throw new Error(result.error);
  }

  return { magicLinkGenerated: Boolean(magicLinkUrl), isExclusiveLead };
}
