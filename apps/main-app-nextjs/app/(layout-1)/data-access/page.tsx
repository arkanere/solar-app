/**
 * Request My Data — the DPDP right of access. Ported from
 * apps/main-app/src/routes/(layout-1)/data-access/+page.svelte.
 *
 * Copy verbatim, shape from the primitives, the same treatment as
 * privacy-policy and terms-of-use. This page is the other half of Privacy
 * Policy §7, which links here by name, so the two must keep saying the same
 * thing: a summary of the data we hold and who it was shared with, within 30
 * days.
 *
 * NO `revalidate`. Every word is a literal and nothing here reads the
 * database, so the page prerenders at build and never needs to be asked
 * again. The SvelteKit sibling's `config.isr.expiration` existed to stop
 * SvelteKit rendering it per request; there is nothing to expire.
 *
 * The form is the one client leaf. `/data-deletion` renders the same
 * component against the other endpoint — see `DataRequestForm`'s header.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { DataRequestForm } from '@/components/forms';
import { PageShell, Section, Stack } from '@/components/layout';
import { getCountry } from '@/lib/countries';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Request My Data',
  description:
    'Request a copy of the personal data Solar Vipani holds about you. Submit a data access request and we will email you your information within 30 days.',
  path: '/data-access',
  locale: getCountry('in').locale,
  imageAlt: 'Solar Vipani'
});

const WHAT_YOU_CAN_REQUEST = [
  {
    who: 'For Customers:',
    items: [
      'Your contact information (phone number, email address)',
      'Lead submissions and requirements',
      'Which installers received your details, and when'
    ]
  },
  {
    who: 'For Solar Installers/Businesses:',
    items: [
      'Business profile and contact information',
      'Service area and specialization details',
      'Lead claims and interaction history'
    ]
  }
];

/**
 * The bordered block the Svelte page got from `<Card>`. There is no Card in
 * this app and this page does not justify inventing one — three uses on two
 * pages is a local helper, not a design-system component. If a fourth caller
 * appears outside these two pages, that is the moment to promote it.
 */
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-line p-lg">
      <h2 className="font-serif text-xl text-ink">{title}</h2>
      <div className="mt-md font-serif text-prose text-ink-muted">{children}</div>
    </section>
  );
}

export default function Page() {
  return (
    <PageShell>
      <Section width="narrow">
        <Stack gap="md">
          <h1 className="font-serif text-2xl text-ink">Request My Data</h1>
          <p className="font-serif text-prose text-ink-muted">
            You have the right to access the personal data we hold about you. Whether you are a
            customer or a registered solar installer on our platform, fill out the form below and
            our team will email you a copy of your data within 30 days.
          </p>
        </Stack>
      </Section>

      <Section width="narrow">
        <Stack gap="lg">
          <Panel title="What you can request">
            <Stack gap="md">
              {WHAT_YOU_CAN_REQUEST.map((group) => (
                <div key={group.who}>
                  <h3 className="font-sans text-base font-semibold text-ink">{group.who}</h3>
                  <ul className="mt-xs flex list-disc flex-col gap-2xs pl-lg">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Stack>
          </Panel>

          <Panel title="Request a Copy of Your Data">
            <DataRequestForm
              endpoint="/api/submitDataAccess"
              submitLabel="Submit Data Access Request"
              reasonLabel="Additional details"
              reasonPlaceholder="Any details that help us locate your records (optional)"
              confirmation={
                <>
                  <p className="font-semibold text-ink">Request submitted successfully</p>
                  <p className="mt-sm">
                    Your data access request has been received. We will email you a copy of your
                    data within 30 days. A confirmation has been sent to the email address you
                    provided.
                  </p>
                  <p className="mt-sm">
                    If you have any questions, please contact us at{' '}
                    <a href="mailto:admin@solarvipani.com" className="text-action underline">
                      admin@solarvipani.com
                    </a>
                    .
                  </p>
                </>
              }
            />
          </Panel>

          <Panel title="Important Information">
            <ul className="flex list-disc flex-col gap-xs pl-lg">
              <li>Data access requests are fulfilled within 30 days</li>
              <li>
                We will email your data to the address you provide, so please ensure it is correct
              </li>
              <li>
                To protect your privacy, we may ask you to verify your identity before releasing
                data
              </li>
              <li>
                If you instead want your data deleted, use our{' '}
                <Link href="/data-deletion" className="text-action underline">
                  Data Deletion
                </Link>{' '}
                page
              </li>
            </ul>
            <p className="mt-md">
              For any questions or concerns about your data access request, please contact us at{' '}
              <a href="mailto:admin@solarvipani.com" className="text-action underline">
                admin@solarvipani.com
              </a>
              .
            </p>
          </Panel>
        </Stack>
      </Section>
    </PageShell>
  );
}
