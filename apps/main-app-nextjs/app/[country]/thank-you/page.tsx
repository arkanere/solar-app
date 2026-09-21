/**
 * `/{cc}/thank-you?ref={uuid}` — the customer's lead receipt.
 *
 * **Dynamic, not ISR.** Every other page in this tree is `revalidate` plus an
 * empty `generateStaticParams`; this one reads a query string and prints one
 * visitor's own contact details, so there is nothing cacheable about it. A
 * shared cache entry keyed on the path alone would serve one person's phone
 * number to the next visitor — which is the whole reason the exception is
 * written out here rather than left implicit in the absence of a `revalidate`.
 *
 * **The lead detail is IN-only**, as in SvelteKit: `reference_uuid` is
 * returned by `insertLead` for IN alone (lib/server/leads.ts records why), so
 * a US visitor never holds a `ref` to present. /us has only ever shown the
 * headline, and that is preserved — giving /us a real receipt means reading
 * US lead rows by reference, which is a behaviour addition and not a port.
 *
 * **Nothing in this app routes here yet.** `LeadForm` confirms in place
 * instead of redirecting — its header explains why, and that reasoning still
 * holds now that this page is real: an in-place panel cannot be reached by
 * pressing back into a stale form, and it does not put a lead's details in a
 * URL that gets pasted around. The page is reached from the confirmation
 * email's link and is ported for that. Whether the form should start
 * redirecting here is a product decision, recorded in the README.
 *
 * The uuid is the only access control: there is no session, so anyone holding
 * the link sees the row. That is the SvelteKit behaviour and the link only
 * ever reaches the person who submitted it.
 *
 * The Meta Pixel `Lead` event on the original is not ported — see the note in
 * `business-form/page.tsx`.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell, Section, Stack } from '@/components/layout';
import { getCountry, isCountry } from '@/lib/countries';
import { getLeadReceipt, type LeadReceipt } from '@/lib/forms/data';
import { pageMetadata } from '@/lib/metadata';

/** Reads a query string and prints one visitor's own row. Never cached. */
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  if (!isCountry(country)) return {};
  const config = getCountry(country);

  return {
    ...pageMetadata({
      title: 'Thank You',
      description: 'Thank you for submitting your details. We will contact you soon.',
      path: `/${country}/thank-you`,
      locale: config.locale,
      imageAlt: `${config.brandName} enquiry received`
    }),
    robots: { index: false, follow: true }
  };
}

/** One term/value row of the receipt. */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2xs border-b border-line py-sm last:border-b-0 sm:flex-row sm:justify-between sm:gap-md">
      <dt className="text-sm font-semibold text-ink-muted">{label}</dt>
      <dd className="text-sm text-ink sm:text-right">{value}</dd>
    </div>
  );
}

/**
 * The submitted-at stamp, in the country's own locale.
 *
 * Null-safe because `leaddata.created_at` is nullable — the row is dropped
 * rather than printed as "Invalid Date", which is what `new Date(null)`
 * formats to.
 */
function formatSubmitted(value: string | null, locale: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function Receipt({ lead, locale }: { lead: LeadReceipt; locale: string }) {
  const submitted = formatSubmitted(lead.submittedAt, locale);
  return (
    <dl className="rounded-lg border border-line bg-surface p-lg">
      <Row label="Name" value={lead.name} />
      <Row label="Phone" value={lead.phone} />
      <Row label="Email" value={lead.email || 'Not provided'} />
      <Row
        label="Location"
        value={lead.district ? `${lead.postalCode}, ${lead.district}` : lead.postalCode}
      />
      {/* The three optional columns are dropped when empty rather than
          printed as "Not provided". Unlike the business confirmation email —
          which an operator reads to check a form for completeness — this is
          the visitor's own receipt, and a row telling them they did not
          answer an optional question is noise. */}
      {lead.type ? <Row label="Installation type" value={lead.type} /> : null}
      {lead.comment ? <Row label="Requirements" value={lead.comment} /> : null}
      {submitted ? <Row label="Submitted" value={submitted} /> : null}
    </dl>
  );
}

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ country: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { country } = await params;
  if (!isCountry(country)) notFound();
  const config = getCountry(country);

  const { ref } = await searchParams;

  // US never has a reference, so it never reaches the lookup and always gets
  // the plain headline below.
  const lead = country === 'in' && ref ? await getLeadReceipt(ref) : null;

  // A `ref` that resolves to nothing is the "Details not found" branch. No
  // `ref` at all is not an error — it is the ordinary confirmation, which is
  // what /us always shows and what an IN visitor gets if the link lost its
  // query string.
  const notFoundRef = country === 'in' && Boolean(ref) && !lead;

  if (notFoundRef) {
    return (
      <PageShell>
        <Section width="narrow">
          <Stack gap="md">
            <h1 className="text-2xl leading-tight">Details not found</h1>
            <p className="text-ink-muted">
              We could not find the enquiry this link points at. Please contact us if you need
              assistance.
            </p>
            <p className="text-ink-muted">
              To speak to us, call{' '}
              <a href="tel:+918983066701" className="text-action">
                +91 8983066701
              </a>
              .
            </p>
          </Stack>
        </Section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Section width="narrow">
        <h1 className="text-2xl leading-tight">
          {lead ? 'We have received your details' : 'Thank you for submitting your details'}
        </h1>
      </Section>

      {lead ? (
        <Section width="narrow">
          <Receipt lead={lead} locale={config.locale} />
        </Section>
      ) : null}

      {lead && !lead.hasVerifiedInstaller && lead.district ? (
        <Section width="narrow">
          {/* Said before the "next steps" below, because it changes what those
              steps are. The original renders it in the same order.

              `brand`, not a warning colour: globals.css says there is no
              warning token because no archetype had a use for one, and daisyUI's
              `--color-warning` is mapped to `--color-brand` for exactly this
              reason. This is also not really a warning — it is the honest
              version of the same good news. */}
          <div className="rounded-lg border border-brand bg-brand-surface p-lg">
            <h2 className="text-lg">Service area update</h2>
            <p className="mt-sm text-sm text-ink-muted">
              We are expanding to <strong className="font-semibold text-ink">{lead.district}</strong>
              . We will reach out once we have a verified installer there.
            </p>
          </div>
        </Section>
      ) : null}

      <Section width="narrow">
        <Stack gap="md">
          <h2 className="text-lg">Next steps</h2>
          {lead && !lead.hasVerifiedInstaller ? (
            <p className="text-ink-muted">
              Once we have verified installers in {lead.district ?? 'your area'}, we will connect
              you with 2–3 who can quote for your requirement.
            </p>
          ) : (
            <>
              <p className="text-ink-muted">
                We will call you within 24 hours to get your exact requirement and clear up any
                questions.
              </p>
              <p className="text-ink-muted">
                We then share that requirement with 2–3 verified installers in your area so they
                can quote for it.
              </p>
            </>
          )}
          <p className="text-ink-muted">
            If you would like to speak to us right away, call{' '}
            <a href="tel:+918983066701" className="text-action">
              +91 8983066701
            </a>
            .
          </p>
        </Stack>
      </Section>
    </PageShell>
  );
}
