/**
 * Privacy Policy. Ported from
 * apps/main-app/src/routes/(layout-1)/privacy-policy/+page.svelte.
 *
 * Same treatment as terms-of-use: copy verbatim, shape from the primitives.
 * The one thing this page has that the Terms do not is the sub-processor
 * table, and it reuses the table rules ArticleBody.tsx settled for the 282
 * editorial tables rather than inventing a second set — sans face, line under
 * the header, line between rows, no vertical rules.
 *
 * What it does NOT take from there is `min-w-[34rem]` and the scroll box. That
 * pair exists because a four-column editorial table wraps every cell onto
 * three lines on a phone and doubles in height. This one is three columns and
 * no cell is over 45 characters, so at 390px it wraps to two lines and stays
 * readable — cheaper than a sideways scroll for six rows.
 *
 * `LAST_UPDATED` stays a hand-edited constant, as it was in the Svelte page.
 * Deriving it from the file's mtime or the build date would date the document
 * every time the site deploys, which is the opposite of what the line means.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell, Section, Stack } from '@/components/layout';
import { getCountry } from '@/lib/countries';
import { pageMetadata } from '@/lib/metadata';

const LAST_UPDATED = 'June 2026';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    "Privacy policy of Solar Vipani regarding user data collection, usage, and protection under India's Digital Personal Data Protection Act, 2023.",
  path: '/privacy-policy',
  locale: getCountry('in').locale,
  imageAlt: 'Solar Vipani'
});

const SUB_PROCESSORS = [
  { name: 'Brevo', purpose: 'Transactional & notification email', data: 'Name, email' },
  { name: 'Twilio', purpose: 'SMS / WhatsApp notifications', data: 'Phone number' },
  {
    name: 'Cloudinary',
    purpose: 'Secure storage of uploaded electricity bills',
    data: 'Electricity bill files'
  },
  {
    name: 'PostHog',
    purpose: 'Website analytics (only with your consent)',
    data: 'Usage / device data'
  },
  { name: 'OpenAI', purpose: 'Powers our support chatbot', data: 'Chatbot messages' },
  { name: 'Vercel', purpose: 'Website hosting & infrastructure', data: 'All data in transit' }
];

function Clause({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-xl text-ink">
        {n}. {title}
      </h2>
      <div className="mt-sm font-serif text-prose text-ink-muted">{children}</div>
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
          <h1 className="font-serif text-2xl text-ink">Privacy Policy</h1>
          <p className="text-sm text-ink-subtle">Last updated: {LAST_UPDATED}</p>
          <p className="font-serif text-prose text-ink-muted">
            At Solarvipani.com (&ldquo;Solar Vipani&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), we
            are committed to safeguarding your privacy and protecting your personal data. This
            Privacy Policy explains how we collect, use, share, and protect your personal data when
            you use our services, and describes your rights under India&rsquo;s{' '}
            <Ink>Digital Personal Data Protection Act, 2023 (DPDP Act)</Ink> and the Information
            Technology Act, 2000. For the purposes of the DPDP Act, Solar Vipani acts as a{' '}
            <Ink>Data Fiduciary</Ink> in respect of the personal data you provide.
          </p>
        </Stack>
      </Section>

      <Section width="narrow">
        <Stack gap="xl">
          <Clause n={1} title="Information We Collect">
            <p>
              When you submit an inquiry (a &ldquo;lead&rdquo;) or otherwise use our services, we
              may collect:
            </p>
            <ul className="mt-sm flex list-disc flex-col gap-2xs pl-lg">
              <li>Your name, phone number and email address</li>
              <li>Your PIN code, district and state (to match you with installers near you)</li>
              <li>Details of your solar inquiry and any comments you provide</li>
              <li>
                Your electricity bill, if you choose to upload one, so installers can prepare an
                accurate quote
              </li>
              <li>
                Limited technical and usage data (e.g. pages visited) where you have consented to
                analytics cookies
              </li>
              <li>Messages you send to our chatbot</li>
            </ul>
          </Clause>

          <Clause n={2} title="How We Use Your Information">
            <p>
              We use your personal data to connect you with solar installers in your area, to enable
              those installers to respond to your inquiry, to operate and improve our website, to
              communicate with you about your inquiry, and to comply with our legal obligations. We
              process your data only for these specified, lawful purposes.
            </p>
          </Clause>

          <Clause n={3} title="Consent and Legal Basis">
            <p>
              We process your personal data on the basis of the consent you give when you submit a
              lead form and tick the consent checkbox, in accordance with Section 6 of the DPDP Act.
              Your consent is free, specific, informed, and unambiguous. You may withdraw your
              consent at any time by contacting our Grievance Officer (Section 9) or by using our{' '}
              <Link href="/data-deletion">Data Deletion Request</Link> page; withdrawal does not
              affect processing carried out before withdrawal.
            </p>
          </Clause>

          <Clause n={4} title="Data Sharing and Disclosure">
            <p>
              When you consent, we share your contact details with one or more solar installers in
              your area so that they can follow up on your inquiry. These installers are{' '}
              <Ink>independent Data Fiduciaries (controllers) in their own right</Ink>, not our
              processors. This means that once your details are transferred to an installer, the
              installer is independently responsible for how it handles your data under applicable
              law. Installers accept binding data-handling obligations — including using your
              details solely to respond to your inquiry, not selling or onward-transferring them,
              and deleting them on request — before they are permitted to receive any lead.
            </p>
            <p className="mt-sm">
              We do not sell your personal data, and we do not share it with any third party other
              than the installers you have consented to connect with and the service providers
              listed in Section 5.
            </p>
          </Clause>

          <Clause n={5} title="Service Providers (Sub-processors)">
            <p>
              We use a small number of trusted service providers to operate our platform. They
              process personal data only on our instructions and under data protection agreements:
            </p>
            {/* Sans, not serif: a table is data, for the reason ArticleBody.tsx
                gives — Inter is the better face at small sizes. */}
            <table className="mt-md w-full border-collapse font-sans text-sm">
              <thead>
                <tr className="border-b border-line-strong bg-surface-sunken">
                  <th className="px-sm py-xs text-left font-semibold text-ink">Provider</th>
                  <th className="px-sm py-xs text-left font-semibold text-ink">Purpose</th>
                  <th className="px-sm py-xs text-left font-semibold text-ink">Data Handled</th>
                </tr>
              </thead>
              <tbody>
                {SUB_PROCESSORS.map((p) => (
                  <tr key={p.name} className="border-b border-line even:bg-surface-sunken/40">
                    <td className="px-sm py-xs align-top text-ink">{p.name}</td>
                    <td className="px-sm py-xs align-top text-ink-muted">{p.purpose}</td>
                    <td className="px-sm py-xs align-top text-ink-muted">{p.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Clause>

          <Clause n={6} title="Data Retention">
            <p>
              We retain unclaimed lead data for a maximum of six months from the date of collection,
              after which it is automatically and securely deleted from our systems along with any
              uploaded electricity bill. Where a lead has been claimed by an installer, the
              installer becomes responsible for retention of the copy it holds as an independent
              Data Fiduciary.
            </p>
          </Clause>

          <Clause n={7} title="Your Rights as a Data Principal">
            <p>
              Under the DPDP Act, 2023 you have the following rights in respect of your personal
              data:
            </p>
            <ul className="mt-sm flex list-disc flex-col gap-xs pl-lg">
              <li>
                <Ink>Right to access:</Ink> obtain a summary of the personal data we hold about you
                and who it has been shared with, via our{' '}
                <Link href="/data-access">Request My Data</Link> page. We will respond within 30
                days.
              </li>
              <li>
                <Ink>Right to correction:</Ink> request correction of inaccurate or incomplete data
                by contacting our Grievance Officer.
              </li>
              <li>
                <Ink>Right to erasure:</Ink> request deletion of your personal data via our{' '}
                <Link href="/data-deletion">Data Deletion Request</Link> page. We will process your
                request within 30 days.
              </li>
              <li>
                <Ink>Right to data portability:</Ink> request a copy of the data you provided in a
                structured, commonly used format. On request, our team will send you a CSV export of
                your data.
              </li>
              <li>
                <Ink>Right to grievance redressal:</Ink> raise any concern with our Grievance
                Officer (Section 9).
              </li>
              <li>
                <Ink>Right to nominate:</Ink> nominate another individual to exercise your rights in
                the event of your death or incapacity.
              </li>
            </ul>
          </Clause>

          <Clause n={8} title="Cookies and Analytics">
            <p>
              We do not load any analytics or tracking cookies until you give consent through the
              cookie banner shown on your first visit. If you decline, no analytics scripts are
              loaded. You can change your choice at any time by clearing your browser storage for
              this site.
            </p>
          </Clause>

          <Clause n={9} title="Grievance Officer">
            <p>
              In accordance with the DPDP Act, 2023 and the Information Technology Act, 2000, you
              may contact our Grievance Officer with any question, concern, or complaint regarding
              your personal data:
            </p>
            <div className="mt-md rounded-lg border border-line p-md">
              <p>
                <Ink>Grievance Officer</Ink>, Solar Vipani
              </p>
              <p>
                Email: <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>
              </p>
              <p>We acknowledge complaints promptly and resolve them within 30 days.</p>
            </div>
          </Clause>

          <Clause n={10} title="AI Chatbot">
            <p>
              Messages you send to our support chatbot are processed by OpenAI solely to generate a
              response to you. These messages are <Ink>not used to train AI models</Ink>. Please
              avoid sharing sensitive personal information in the chatbot.
            </p>
          </Clause>

          <Clause n={11} title="Compliance and Data Fiduciary Obligations">
            <p>
              As a Data Fiduciary, we process personal data lawfully and transparently, collect only
              what is necessary for the stated purposes, keep it accurate, retain it only as long as
              needed, secure it with appropriate technical and organisational measures, and act on
              the rights you exercise. We comply with the Digital Personal Data Protection Act,
              2023, the Information Technology Act, 2000, and the rules made thereunder.
            </p>
          </Clause>

          <Clause n={12} title="Security Measures">
            <p>
              We implement appropriate technical and organizational measures to protect your data
              against unauthorized access, alteration, disclosure, or destruction, including
              encryption of data in transit, access controls, and authenticated, time-limited access
              to uploaded files.
            </p>
          </Clause>

          <Clause n={13} title="Children's Data">
            <p>
              Our services are intended for adults. We do not knowingly collect personal data of
              children without verifiable parental or guardian consent as required by the DPDP Act,
              2023.
            </p>
          </Clause>

          <Clause n={14} title="Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on
              this page with an updated revision date shown at the top.
            </p>
          </Clause>

          <Clause n={15} title="Contact Us">
            <p>
              If you have any questions or concerns about this Privacy Policy or our data practices,
              please contact us at <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>.
            </p>
          </Clause>
        </Stack>
      </Section>
    </PageShell>
  );
}
