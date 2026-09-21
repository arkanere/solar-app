/**
 * Terms of Use. Ported from
 * apps/main-app/src/routes/(layout-1)/terms-of-use/+page.svelte.
 *
 * The copy is carried across verbatim — it is a legal document, so the port
 * changes nothing in it. What the port does change is where the shape comes
 * from: the Svelte page set its own type scale, its own greys and its own
 * `mb-8` between every block. Here the measure is `narrow` (44rem, which
 * design-foundation.md §6 assigns to "forms, legal"), the rhythm is a
 * <Stack>, and the colours are tokens.
 *
 * Serif body, sans headings is deliberately NOT what this does: the body is
 * in the serif with the headings, because fourteen numbered clauses is
 * long-form reading, which is what design-foundation.md buys Source Serif
 * for. The directory surface is the sans one.
 *
 * No data, so no loader and no ISR window to match — the SvelteKit
 * `+page.server.ts` existed only to carry `config.isr`, and a page with no
 * dynamic call is already static here.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell, Section, Stack } from '@/components/layout';
import { getCountry } from '@/lib/countries';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Terms of Use',
  description:
    'Read the Terms of Use for Solar Vipani, detailing user responsibilities, platform rules, and service limitations for a trusted and secure solar marketplace experience.',
  path: '/terms-of-use',
  locale: getCountry('in').locale,
  imageAlt: 'Solar Vipani'
});

/** A numbered clause: heading, then whatever the clause is made of. */
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

/** A clause whose body is a list of "label: text" obligations. */
function Duties({ items }: { items: { label: string; text: string }[] }) {
  return (
    <ul className="flex list-disc flex-col gap-xs pl-lg">
      {items.map((item) => (
        <li key={item.label}>
          <strong className="font-semibold text-ink">{item.label}:</strong> {item.text}
        </li>
      ))}
    </ul>
  );
}

export default function Page() {
  return (
    <PageShell>
      <Section width="narrow">
        <Stack gap="md">
          <h1 className="font-serif text-2xl text-ink">Terms of Use</h1>
          <p className="font-serif text-prose text-ink-muted">
            Welcome to SolarVipani.com (&ldquo;the Website&rdquo;). By accessing or using the
            Website, you agree to comply with these Terms of Use (&ldquo;Terms&rdquo;). If you do
            not agree with these Terms, you may not use the Website.
          </p>
        </Stack>
      </Section>

      <Section width="narrow">
        <Stack gap="xl">
          <Clause n={1} title="Acceptance of Terms">
            <p>
              By using the Website, you acknowledge that you have read, understood, and agree to be
              bound by these Terms, along with our Privacy Policy.
            </p>
          </Clause>

          <Clause n={2} title="Description of Services">
            <p>
              Solar Vipani connects users seeking solar panel installation services with verified
              installers. We act as a marketplace platform and are not responsible for the services
              provided by the installers.
            </p>
          </Clause>

          <Clause n={3} title="User Responsibilities">
            <Duties
              items={[
                {
                  label: 'Provide Accurate Information',
                  text: 'Users must provide truthful and accurate details when interacting with the Website.'
                },
                {
                  label: 'Comply with Laws',
                  text: 'Users must adhere to all applicable laws and regulations while using the Website.'
                }
              ]}
            />
          </Clause>

          <Clause n={4} title="Installer Responsibilities">
            <Duties
              items={[
                {
                  label: 'Qualifications',
                  text: 'Installers must ensure they have all required licenses, certifications, and insurance to operate legally.'
                },
                {
                  label: 'Accurate Listings',
                  text: 'Installers must provide up-to-date and accurate information about their services.'
                }
              ]}
            />
          </Clause>

          <Clause n={5} title="Platform Use and Restrictions">
            <p>
              Users and Installers agree to use the Website only for its intended purposes.
              Activities such as posting misleading content, conducting illegal activities, or
              interfering with the Website&rsquo;s functionality are strictly prohibited.
            </p>
          </Clause>

          <Clause n={6} title="Fees and Payments">
            <p>
              Solar Vipani may charge fees for certain features. Fees will be disclosed upfront.
              Note that Solar Vipani does not handle transactions between users and installers.
            </p>
          </Clause>

          <Clause n={7} title="Dispute Resolution">
            <p>
              Solar Vipani is not responsible for disputes between users and installers. While we
              may offer optional mediation services, the responsibility for resolving disputes lies
              with the parties involved.
            </p>
          </Clause>

          <Clause n={8} title="Intellectual Property">
            <p>
              All content, logos, and trademarks on the Website are owned by Solar Vipani or its
              licensors. Unauthorized reproduction or use is prohibited.
            </p>
          </Clause>

          <Clause n={9} title="Limitation of Liability">
            <p>
              Solar Vipani is not liable for damages arising from the use of the Website, including
              service quality issues or content posted on the platform.
            </p>
          </Clause>

          <Clause n={10} title="Privacy Policy">
            <p>
              Your use of the Website is governed by our{' '}
              <Link href="/privacy-policy">Privacy Policy</Link>.
            </p>
          </Clause>

          <Clause n={11} title="Changes to Terms">
            <p>
              We reserve the right to modify these Terms at any time. Updates will be posted on this
              page, and continued use of the Website implies acceptance of the revised Terms.
            </p>
          </Clause>

          <Clause n={12} title="Termination">
            <p>
              We reserve the right to terminate or suspend your access to the Website for any
              reason, including violations of these Terms.
            </p>
          </Clause>

          <Clause n={13} title="Governing Law">
            <p>These Terms are governed by the laws of Republic of India.</p>
          </Clause>

          <Clause n={14} title="Contact Us">
            <p>For questions or concerns about these Terms, please contact us:</p>
            <ul className="mt-sm flex list-disc flex-col gap-xs pl-lg">
              <li>
                Email: <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a>
              </li>
              <li>
                Phone: <a href="tel:+918983066701">+91 8983066701</a>
              </li>
            </ul>
          </Clause>
        </Stack>
      </Section>
    </PageShell>
  );
}
