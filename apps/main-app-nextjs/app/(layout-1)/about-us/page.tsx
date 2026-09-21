/**
 * About Us. Ported from
 * apps/main-app/src/routes/(layout-1)/about-us/+page.svelte and its loader.
 *
 * Sans, not serif, and that is the one real design decision on the page. The
 * two legal pages next to it are documents you read top to bottom, so they
 * take Source Serif; this is a stat row, two card grids and eight short
 * paragraphs — UI, which design-foundation.md §6 gives to Inter.
 *
 * Every figure is counted live (lib/stats.ts). The SvelteKit page's own
 * comment records why: it used to claim "500+" businesses and "5,000+ Cities
 * & Towns" against 470 and 356 actual.
 *
 * Two blocks of the Svelte page do not come across:
 *
 *  - **the contact/legal strip at the bottom.** Terms, Privacy and the email
 *    are all in SiteFooter now, directly below this page. The Svelte page
 *    predates the shared footer and carried its own.
 *  - **the GitHub icon.** lucide-react dropped its brand glyphs in v1
 *    (ContactPanel.tsx hit the same thing with Instagram), so the repo link
 *    is a plain button. An icon here would be a vendored SVG for decoration.
 *
 * `AboutPage` JSON-LD is kept, minus `sameAs`: the SvelteKit version built it
 * from a `SOCIAL_LINKS` constant this app does not have, and asserting social
 * profiles that nothing on the page links to is exactly the mismatch
 * EditorialArticle.tsx avoids with its breadcrumb and FAQ markup.
 */
import type { Metadata } from 'next';
import { BookOpen, LifeBuoy, MapPin, Scale, TrendingUp, Users } from 'lucide-react';
import { PageShell, Section, Stack } from '@/components/layout';
import { getCountry } from '@/lib/countries';
import { BASE_URL } from '@/lib/directory/structuredData';
import { OG_IMAGE, pageMetadata } from '@/lib/metadata';
import { getPlatformStats } from '@/lib/stats';

const REPO_URL = 'https://github.com/arkanere/solar-app';

/**
 * 15 days, matching `config.isr.expiration` on the SvelteKit load and the
 * editorial routes. Without it the three counts are read once at build and
 * never move again — the page's own "counted live from our database" line
 * would stop being true the day after a deploy.
 */
export const revalidate = 1296000;

export const metadata: Metadata = pageMetadata({
  title: 'About Us',
  description:
    'Solar Vipani connects homeowners and businesses with local solar installers, and publishes the guides and tools to decide before you spend. Our platform is open source.',
  path: '/about-us',
  locale: getCountry('in').locale,
  imageAlt: 'Solar Vipani'
});

const OFFERINGS = [
  {
    title: 'Local installer listings',
    body: 'Browse solar companies by state, district and city, see the work they have completed, and request quotes from more than one before you commit.'
  },
  {
    title: 'Guides that explain the choice',
    body: 'Independent writing on rooftop solar, panels, inverters, solar pumps, subsidies and financing — written to educate before you spend, not to sell a brand.'
  },
  {
    title: 'Calculators and tools',
    body: 'Size a system against your electricity bill, check what subsidy you qualify for, and work out EMIs — so you can sanity-check a quote before you sign it.'
  },
  {
    title: 'Real installation projects',
    body: 'Photos, system sizes and locations from installations completed by companies on the platform, published by the installers themselves.'
  }
];

const REASONS = [
  {
    icon: Scale,
    title: 'Effortless Comparisons',
    body: 'Comparing options is as easy as browsing. See service area, completed work and contact details side by side, at a glance.'
  },
  {
    icon: BookOpen,
    title: 'Built to Inform, Not to Sell',
    body: 'We do not manufacture or install anything, so we have no product to push. Our guides describe trade-offs, including the ones that argue against going solar right now.'
  },
  {
    icon: MapPin,
    title: 'Local, Not National',
    body: 'Enquiries go to installers who actually work in your area, and to more than one of them, so you get comparable quotes from people who can service what they sell you.'
  },
  {
    icon: LifeBuoy,
    title: 'Customer-First Support',
    body: 'Our team is here to guide you through every step, from an initial question to feedback after your system is installed.'
  }
];

/** The shared card: a line around it, no shadow — design-foundation.md §7. */
function Card({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className={`rounded-lg border border-line bg-surface p-md ${center ? 'text-center' : ''}`}>
      {children}
    </div>
  );
}

export default async function Page() {
  const stats = await getPlatformStats();
  const locale = getCountry('in').locale;

  const figures = [
    { icon: Users, value: stats.installerCount, label: 'Installers on the Platform' },
    { icon: MapPin, value: stats.citiesServed, label: 'Cities Served' },
    { icon: TrendingUp, value: stats.leadsGenerated, label: 'Leads Generated' }
  ];

  return (
    <PageShell>
      <Section width="content">
        <Stack gap="sm">
          <h1 className="text-2xl text-ink">About Solar Vipani</h1>
          <p className="text-lg text-ink-muted">
            Your trusted marketplace for solar energy solutions.
          </p>
        </Stack>
      </Section>

      <Section width="content">
        <div className="max-w-prose">
          <Stack gap="md">
            <p className="text-lg font-medium text-ink">
              Going solar is a decision you live with for 25 years, and it involves a significant
              amount of money.
            </p>
            <p className="text-ink-muted">
              Most people start that decision with no way to tell a good installer from a bad one,
              and no independent source for what a system should cost. Solar Vipani exists to close
              that gap. We are not a manufacturer and not an installer — we are the layer in
              between: a marketplace that connects you with local solar installation and EPC
              companies, and a library of guides and tools that let you judge their quotes for
              yourself.
            </p>
            <p className="rounded-md bg-accent-surface p-md font-medium text-ink">
              Compare multiple options, get free quotes from installers near you, and choose with
              the numbers in front of you.
            </p>
            <p className="text-ink-muted">
              Listing is free for installers, and we never charge you for a quote. You decide who to
              talk to, and you keep control of your details until you do.
            </p>
          </Stack>
        </div>
      </Section>

      <Section width="content">
        <Stack gap="md">
          <div className="grid grid-cols-1 gap-md md:grid-cols-3">
            {figures.map((figure) => (
              <Card key={figure.label} center>
                <div className="flex justify-center">
                  <figure.icon aria-hidden className="mb-xs h-6 w-6 text-action" />
                </div>
                <div className="text-2xl font-bold tabular-nums text-ink">
                  {figure.value.toLocaleString(locale)}+
                </div>
                {/* h2, not a div: each figure is a claim the page makes, and
                    the three of them are its first level of structure. */}
                <h2 className="text-lg text-ink-muted">{figure.label}</h2>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-ink-subtle">
            Counted live from our database, across every country we operate in.
          </p>
        </Stack>
      </Section>

      <Section width="content">
        <div className="max-w-prose">
          <Stack gap="sm">
            <h2 className="text-xl text-ink">Our Purpose</h2>
            <p className="text-ink-muted">
              We believe going solar should be a straightforward, well-informed choice for everyone.
              Our mission is to make the transition as smooth as possible by{' '}
              <strong className="font-semibold text-ink">
                connecting you with solar providers who match your specific needs and goals
              </strong>
              , and by giving you enough information to know why they match. A decision that lasts
              25 years deserves more than a single quote from whoever knocked on your door.
            </p>
          </Stack>
        </div>
      </Section>

      <Section width="content">
        <div className="max-w-prose">
          <Stack gap="md">
            <h2 className="text-xl text-ink">Built in the Open</h2>
            <p className="text-ink-muted">
              A marketplace asks you to trust how it ranks and matches. We would rather you did not
              have to take that on faith:{' '}
              <strong className="font-semibold text-ink">Solar Vipani is open source</strong>. The
              code behind this site — how installers are matched to an enquiry, how our calculators
              work, how your data is handled — is public and MIT licensed. Read it, check our claims
              against it, or use it in your own project.
            </p>
            <div>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                View the source on GitHub
              </a>
            </div>
          </Stack>
        </div>
      </Section>

      <Section width="content">
        <Stack gap="md">
          <h2 className="text-xl text-ink">What You&rsquo;ll Find Here</h2>
          <div className="grid grid-cols-1 gap-md md:grid-cols-2">
            {OFFERINGS.map((item) => (
              <Card key={item.title}>
                <h3 className="text-lg text-ink">{item.title}</h3>
                <p className="mt-xs text-sm text-ink-muted">{item.body}</p>
              </Card>
            ))}
          </div>
        </Stack>
      </Section>

      <Section width="content">
        <Stack gap="md">
          <h2 className="text-xl text-ink">Why Choose Solar Vipani?</h2>
          <div className="grid grid-cols-1 gap-md md:grid-cols-2">
            {REASONS.map((item) => (
              <Card key={item.title} center>
                <div className="flex justify-center">
                  <item.icon aria-hidden className="mb-sm h-8 w-8 text-action" />
                </div>
                <h3 className="text-lg text-ink">{item.title}</h3>
                <p className="mt-xs text-sm text-ink-muted">{item.body}</p>
              </Card>
            ))}
          </div>
        </Stack>
      </Section>

      <Section width="content">
        <div className="max-w-prose">
          <Stack gap="md">
            <h2 className="text-xl text-ink">Building a Brighter Future, Together</h2>
            <p className="text-ink-muted">
              Choosing solar isn&rsquo;t only about savings; it&rsquo;s about what your roof is
              doing for the next 25 years. Whether you are exploring the idea for the first time or
              already comparing quotes, we&rsquo;re here to make that path clear.
            </p>
            <p className="rounded-md bg-accent-surface p-md text-center font-medium text-ink">
              Step into a greener future with Solar Vipani — high convenience, fair pricing and low
              risk, by design.
            </p>
            <p className="text-ink-muted">
              Write to us at <a href="mailto:admin@solarvipani.com">admin@solarvipani.com</a> or
              call us at <a href="tel:+918983066701">+91 8983066701</a>.
            </p>
          </Stack>
        </div>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About Solar Vipani',
            url: `${BASE_URL}/about-us`,
            mainEntity: {
              '@type': 'Organization',
              name: 'Solar Vipani',
              url: BASE_URL,
              logo: OG_IMAGE.url,
              description:
                'An open source marketplace connecting homeowners and businesses with local solar installers.',
              email: 'admin@solarvipani.com',
              telephone: '+91-8983066701',
              sameAs: [REPO_URL]
            }
          })
        }}
      />
    </PageShell>
  );
}
