/**
 * The site footer. Ported from apps/main-app/src/lib/components/chrome/SiteFooter.svelte.
 *
 * Same `country` contract as SiteHeader: without one, only the country-less
 * columns render.
 *
 * The original's hand-rolled `mx-auto max-w-[1140px]` is a <Container> here —
 * that is the lint rule the layout primitives exist to enforce, and it also
 * puts the footer on the same measure and the same gutter as every page above
 * it, which the 1140px never quite was.
 *
 * No <Stack>: the columns are a grid and the rows inside them are a <ul>, so
 * the rhythm is the grid's gap, not a stack of blocks.
 */
import type { CountryConfig } from '@/lib/countries';
import { contentUrl } from '@/lib/directory/urls';
import { Container } from '@/components/layout';

const LINK =
  'text-sm text-ink no-underline transition-colors duration-fast ease-standard hover:text-action';

const TOPICS = [
  { href: contentUrl('/rooftop-solar'), label: 'Rooftop Solar' },
  { href: contentUrl('/solar-panels'), label: 'Solar Panels' },
  { href: contentUrl('/solar-inverters'), label: 'Solar Inverters' },
  { href: contentUrl('/solar-installation'), label: 'Solar Installation' },
  { href: contentUrl('/solar-subsidy'), label: 'Solar Subsidy' },
  { href: contentUrl('/solar-financing'), label: 'Solar Financing' },
  { href: contentUrl('/solar-pumps'), label: 'Solar Pumps' }
];

const TOOLS = [
  { href: contentUrl('/tools/solar-calculator'), label: 'Solar Calculator' },
  { href: contentUrl('/tools/emi-calculator'), label: 'EMI Calculator' },
  { href: contentUrl('/tools/subsidy-checker'), label: 'Subsidy Checker' }
];

function Column({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="mb-sm text-sm font-semibold text-ink">{title}</h2>
      <ul className="flex flex-col gap-xs">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className={LINK}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter({ country }: { country?: CountryConfig }) {
  const cc = country?.code;
  const features = country?.features;

  const findSolar = country
    ? [
        { href: `/${cc}/solar`, label: 'Solar Directory' },
        ...(features?.projects
          ? [{ href: `/${cc}/recent-solar-installation-projects`, label: 'Recent Projects' }]
          : []),
        ...(cc === 'in' ? [{ href: `/${cc}/get-quotes`, label: 'Get Quotes' }] : [])
      ]
    : [];

  // Installer acquisition. Each country's entry point is a different page: IN
  // pitches at /in/partners, US at /us/business-listing — which is also what
  // the legacy hooks.server.ts 301s /us/partners to.
  const company = [
    { href: '/about-us', label: 'About Us' },
    ...(cc === 'in' ? [{ href: `/${cc}/partners`, label: 'Partner with Us' }] : []),
    ...(cc === 'us' ? [{ href: `/${cc}/business-listing`, label: 'List Your Business' }] : [])
  ];

  return (
    <footer className="mt-2xl border-t border-line bg-surface">
      <Container>
        <div className="grid grid-cols-2 gap-xl py-xl sm:grid-cols-3 lg:grid-cols-5">
          {!country || features?.seoContentFamilies ? (
            <Column title="Solar Topics" links={TOPICS} />
          ) : null}

          {country ? <Column title="Find Solar" links={findSolar} /> : null}

          <Column title="Company" links={company} />

          {!country || features?.tools ? <Column title="Tools" links={TOOLS} /> : null}

          <div>
            <h2 className="mb-sm text-sm font-semibold text-ink">Solar Vipani</h2>
            <p className="text-sm leading-relaxed text-ink-muted">
              The open-source platform helping homeowners and businesses go solar with confidence.
            </p>
          </div>
        </div>

        <div className="border-t border-line py-md text-center">
          <p className="text-2xs text-ink-subtle">
            &copy; {new Date().getFullYear()} Solar Vipani. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
