/**
 * Outbound email, via Brevo's transactional API. Ported from
 * apps/main-app/src/lib/sendEmail.ts.
 *
 * Only `sendEmail` comes across. The original also exports
 * `sendEmailIndividually` and `sendTemplatedEmail`; neither has a caller in
 * this app, and a port is the moment to stop carrying them. Add them back
 * when something needs them.
 *
 * The API key is read at call time, not at module load. `db.ts` throws on a
 * missing POSTGRES_URL because a page without a database is nothing but an
 * error page; a missing BREVO_API_KEY must NOT take the process down, because
 * the lead is already written by the time this runs and losing the request
 * would be worse than losing the email. It returns a failed result instead.
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const SENDER = { name: 'Solar Vipani', email: 'admin@solarvipani.com' };

export type EmailResult = { success: true; messageId?: string } | { success: false; error: string };

export async function sendEmail(
  recipients: string | string[],
  subject: string,
  message: string,
  options: { isHtml?: boolean } = {}
): Promise<EmailResult> {
  const to = Array.isArray(recipients) ? recipients : [recipients];

  if (!to.length || !subject || !message) {
    return { success: false, error: 'Missing recipients, subject or message' };
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return { success: false, error: 'BREVO_API_KEY is not set' };
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify({
        sender: SENDER,
        to: to.map((email) => ({ email })),
        subject,
        ...(options.isHtml ? { htmlContent: message } : { textContent: message })
      })
    });

    const body = await response.json();

    if (!response.ok) {
      console.error('Brevo API error:', body);
      return { success: false, error: body?.message ?? 'Failed to send email' };
    }

    return { success: true, messageId: body?.messageId };
  } catch (error) {
    console.error('Error sending email via Brevo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error while sending email'
    };
  }
}
