/**
 * Data Deletion Request — the DPDP right of erasure. Ported from
 * apps/main-app/src/routes/(layout-1)/data-deletion/+page.svelte.
 *
 * The sibling of `/data-access` and built the same way; that file's header
 * carries the reasoning about copy, `revalidate` and the shared form. Privacy
 * Policy §3 and §7 both link here by name, so the promises here and there
 * have to stay in step.
 *
 * `Panel` is duplicated rather than shared with `/data-access`. Two copies of
 * a ten-line helper is cheaper than a components/ entry that only these two
 * pages will ever import, and the moment a third page wants it is the moment
 * it earns a home.
 */
import type { Metadata } from 'next';
import { DataRequestForm } from '@/components/forms';
import { PageShell, Section, Stack } from '@/components/layout';
import { getCountry } from '@/lib/countries';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Data Deletion Request',
  description:
    'Request deletion of your personal data from Solar Vipani. Submit a data deletion request to remove your information from our database.',
  path: '/data-deletion',
  locale: getCountry('in').locale,
  imageAlt: 'Solar Vipani'
});

const WHAT_WILL_BE_DELETED = [
  {
    who: 'For Customers:',
    items: [
      'Your contact information (phone number, email address)',
      'Lead submissions and requirements',
      'Account information and preferences',
      'Communication history with our team'
    ]
  },
  {
    who: 'For Solar Installers/Businesses:',
    items: [
      'Business profile and contact information',
      'Service area and specialization details',
      'Lead claims and interaction history',
      'Project portfolios and showcase images',
      'Branch locations and team information',
      'Business verification documents'
    ]
  }
];

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-line p-lg">
      <h2 className="font-serif text-xl text-ink">{title}</h2>
      <div className="mt-md font-serif text-prose text-ink-muted">{children}</div>
    </section>
  );
}

function Ink({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>;
}

export default function Page() {
  return (
    <PageShell>
      <Section width="narrow">
        <Stack gap="md">
          <h1 className="font-serif text-2xl text-ink">Data Deletion Request</h1>
          <p className="font-serif text-prose text-ink-muted">
            We respect your privacy and your right to control your personal data. Whether you are a
            customer or a registered solar installer on our platform, if you would like to request
            deletion of your personal information from our database, please fill out the form below.
          </p>
        </Stack>
      </Section>

      <Section width="narrow">
        <Stack gap="lg">
          <Panel title="What data will be deleted?">
            <Stack gap="md">
              {WHAT_WILL_BE_DELETED.map((group) => (
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

          <Panel title="Request Data Deletion">
            <DataRequestForm
              endpoint="/api/submitDataDeletion"
              submitLabel="Submit Deletion Request"
              reasonLabel="Reason for deletion"
              reasonPlaceholder="Please let us know why you're requesting data deletion (customers and installers welcome)"
              confirmation={
                <>
                  <p className="font-semibold text-ink">Request submitted successfully</p>
                  <p className="mt-sm">
                    Your data deletion request has been received. We will process your request
                    within 30 days and send you a confirmation email once completed.
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
              <li>Data deletion requests are processed within 30 business days</li>
              <li>You will receive a confirmation email once your data has been deleted</li>
              <li>
                Some data may be retained for legal compliance purposes (financial records, tax
                documentation, government subsidy records)
              </li>
              <li>Deleting your data will remove you from our marketing communications</li>
              <li>
                <Ink>For Installers:</Ink> Your business will be removed from our directory and you
                will no longer receive leads
              </li>
              <li>
                <Ink>For Customers:</Ink> You will no longer receive solar installation quotes or
                updates
              </li>
            </ul>
            <p className="mt-md">
              For any questions or concerns about your data deletion request, please contact us at{' '}
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
