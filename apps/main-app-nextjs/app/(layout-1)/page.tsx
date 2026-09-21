/**
 * The homepage — `/`. Spec: archetype/home.md. Ported from
 * apps/main-app/src/lib/components/HomePage.svelte, which is the whole of the
 * SvelteKit `/`.
 *
 * Not an archetype — one page — but the only long-tail page whose source
 * design contradicts the design system on every axis it has (§3), so what
 * comes across is the copy and the structure, not the styling:
 *
 *  - headings are ink and left-aligned, not centred brand orange with a rule;
 *  - cards are a hairline on bg-surface and do not lift on a shadow;
 *  - the two hero buttons are new — the live front door has no call to action
 *    anywhere above the fold (§2). They are the country choice itself, one
 *    per market, because that is this page's first job;
 *  - the counts are new. The original's comment refused them because the true
 *    figure "would need a query this page otherwise does not make" (§4). It
 *    does now: `getCountryHub` is the country hub's own query, memoised.
 *
 * **The page no longer leads with India.** It used to open on India's coverage
 * sentence and then offer a country grid below it, which made /in the default
 * and /us a second thought. Both are gone: the hero offers the two markets
 * side by side and carries the per-country installer counts under them, so
 * the counts survive the deletion and the choice is made once. The per-country
 * coverage ratios — districts and counties covered — are not carried over;
 * each country hub still prints its own.
 *
 * The 4.5MB decorative hero video does not come across (§6). Without it the
 * page needs no JavaScript at all: the AVIF is the LCP element, `priority`
 * preloads it, and nothing here is a client component.
 */
import type { Metadata } from 'next';
import Image from 'next/image';
import {
  Banknote,
  BadgeIndianRupee,
  Calculator,
  CreditCard,
  Droplets,
  HardHat,
  House,
  Landmark,
  PlugZap,
  SolarPanel
} from 'lucide-react';
import { Container, PageShell, Section, Stack } from '@/components/layout';
import { COUNTRIES, getCountry } from '@/lib/countries';
import { getCountryHub } from '@/lib/directory/data';
import { contentUrl, geoUrl } from '@/lib/directory/urls';
import { BASE_URL } from '@/lib/directory/structuredData';
import { OG_IMAGE, SITE_NAME, pageMetadata } from '@/lib/metadata';

/**
 * 15 days, matching `config.isr.expiration` on the SvelteKit root loader, and
 * a literal here per the README's Route Segment Config note.
 *
 * It is what keeps the coverage counts honest: without it they are read once
 * at build and the page's claim silently ages.
 */
export const revalidate = 1296000;

/**
 * The original's title and description, which are good and stay. The title
 * already carried the site name, so it is passed without it — `pageMetadata`
 * appends the suffix.
 */
export const metadata: Metadata = pageMetadata({
  title: 'Find Verified Solar Installers',
  description:
    'Browse verified solar panel installers by state. Compare quotes, read reviews and go solar. Free to use.',
  path: '/',
  locale: getCountry('in').locale,
  imageAlt: 'Solar Vipani'
});

/** The seven editorial families, through `contentUrl` — they are mid-migration
    out from under the /{country} prefix. Copy is the original's, verbatim. */
const PILLARS = [
  {
    href: contentUrl('/rooftop-solar'),
    title: 'Rooftop Solar',
    desc: 'System sizing, costs, and what to expect from a rooftop installation',
    icon: House
  },
  {
    href: contentUrl('/solar-panels'),
    title: 'Solar Panels',
    desc: 'Compare panel brands, technologies, and specifications',
    icon: SolarPanel
  },
  {
    href: contentUrl('/solar-inverters'),
    title: 'Solar Inverters',
    desc: 'On-grid, hybrid, and micro inverter options for your system',
    icon: PlugZap
  },
  {
    href: contentUrl('/solar-installation'),
    title: 'Solar Installation',
    desc: 'Site assessment, installation process, and timeline',
    icon: HardHat
  },
  {
    href: contentUrl('/solar-subsidy'),
    title: 'Solar Subsidy',
    desc: 'PM Surya Ghar Yojana, state subsidies, and how to apply',
    icon: Landmark
  },
  {
    href: contentUrl('/solar-financing'),
    title: 'Solar Financing',
    desc: 'Solar loans, EMI options, and bank schemes',
    icon: CreditCard
  },
  {
    href: contentUrl('/solar-pumps'),
    title: 'Solar Pumps',
    desc: 'Agricultural and residential solar pump solutions',
    icon: Droplets
  }
];

/** §7 section 5, new to this page: the three calculators are reachable today
    only from the footer. Copy from the SvelteKit /tools loader. */
const TOOLS = [
  {
    href: contentUrl('/tools/solar-calculator'),
    title: 'Solar Calculator',
    desc: 'Estimate system size, cost, savings, and payback period from your electricity bill.',
    icon: Calculator
  },
  {
    href: contentUrl('/tools/emi-calculator'),
    title: 'EMI Calculator',
    desc: 'Calculate monthly EMI for solar loans and compare rates across banks.',
    icon: Banknote
  },
  {
    href: contentUrl('/tools/subsidy-checker'),
    title: 'Subsidy Checker',
    desc: 'Check the central and state subsidies your system qualifies for.',
    icon: BadgeIndianRupee
  }
];

/** The card the app already has — LocationGrid's, minus the count. Local to
    this page because the two grids below are the only icon cards in the app. */
function IconCard({
  href,
  title,
  desc,
  icon: Icon
}: {
  href: string;
  title: string;
  desc: string;
  icon: typeof House;
}) {
  return (
    <li>
      <a
        href={href}
        className="flex h-full flex-col rounded-lg border border-line bg-surface p-md text-ink no-underline transition-shadow duration-fast ease-standard hover:shadow-raised"
      >
        {/* Decoration in a card, but seven different glyphs across seven cards
            is navigation rather than the identical marker LocationGrid dropped
            its pin for (§8). aria-hidden: the title carries the meaning. */}
        <Icon aria-hidden className="size-6 text-ink-subtle" />
        <h3 className="mt-sm text-base leading-snug text-action underline decoration-action/40 underline-offset-2">
          {title}
        </h3>
        <p className="mt-2xs text-sm text-ink-muted">{desc}</p>
      </a>
    </li>
  );
}

export default async function Page() {
  // Both hubs in parallel, both memoised, nothing added to data.ts (§9).
  const [inHub, usHub] = await Promise.all([getCountryHub('in'), getCountryHub('us')]);
  const hubs = { in: inHub, us: usHub };

  const india = getCountry('in');

  const hero = (
    /* Full-bleed: the <section> is the photograph and the scrim, and the copy
       inside sits in a normal Container so the h1 aligns with every heading
       below it. ~24rem, not the live page's 42rem poster — the band earns its
       height with a headline, a lede and two buttons (§6). */
    <section className="relative isolate flex min-h-[24rem] items-center overflow-hidden py-2xl">
      {/* Decorative, so alt="". The copy on top carries the meaning. The
          intrinsic size is the asset's; object-cover does the rest. */}
      <Image
        src="/header/header.avif"
        alt=""
        width={1920}
        height={600}
        priority
        className="absolute inset-0 -z-10 size-full object-cover object-center"
      />
      {/* White on a photograph is the one legitimate exception to the contrast
          system (§11 q1): this is not text on a token surface, so the scrim is
          carried across from the original unchanged and unverified. */}
      <div className="absolute inset-0 -z-10 bg-black/55" />
      <Container>
        <Stack gap="lg">
          <div className="max-w-prose">
            <h1 className="text-3xl leading-tight text-white">
              Get 2-3 Free Quotes from Verified Installers in Your Area
            </h1>
            {/* A <p>, not the original's <h2>: a subtitle as a heading puts a
                phantom entry in the outline above the page's real sections. */}
            <p className="mt-md text-lg text-white">
              Save 10-20% on installation costs with competitive solar quotations online
            </p>
          </div>
          {/* The page's first job is a choice between two countries, so the
              two buttons ARE that choice. One fill, one outline — the fill is
              the only sky on the band, which is rule 2, and it goes to India
              because this is an IN-first site. */}
          <div className="flex flex-wrap gap-sm">
            <a
              href={geoUrl('in')}
              className="inline-flex items-center justify-center rounded-md bg-action px-lg py-sm text-base font-semibold text-action-ink no-underline transition-colors duration-fast ease-standard hover:bg-action-hover"
            >
              Installers in {india.shortName}
            </a>
            <a
              href={geoUrl('us')}
              className="inline-flex items-center justify-center rounded-md border border-white px-lg py-sm text-base font-semibold text-white no-underline transition-colors duration-fast ease-standard hover:bg-white/10"
            >
              Installers in {getCountry('us').shortName}
            </a>
          </div>
          {/* The country-wise counts, which the two deleted sections used to
              carry. Here because this is the band where the choice is made and
              the count is what it turns on. `tabular-nums` so the figures read
              as data, as on /{cc}/solar. */}
          <p className="text-sm text-white">
            {Object.values(COUNTRIES).map((market, i) => (
              <span key={market.code}>
                {i > 0 ? <span aria-hidden> · </span> : null}
                <span className="font-semibold tabular-nums">
                  {hubs[market.code].totalInstallers.toLocaleString(india.locale)}
                </span>{' '}
                in {market.shortName}
              </span>
            ))}
          </p>
        </Stack>
      </Container>
    </section>
  );

  return (
    <PageShell hero={hero}>
      <Section>
        <nav aria-label="Solar guides">
          <h2 className="text-xl">Learn about solar</h2>
          <p className="mt-sm max-w-prose text-ink-muted">
            Everything worth knowing before going solar — from panels and inverters to subsidies
            and financing.
          </p>
          <ul className="mt-lg grid gap-md sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((pillar) => (
              <IconCard key={pillar.href} {...pillar} />
            ))}
          </ul>
        </nav>
      </Section>

      <Section>
        <nav aria-label="Solar tools and calculators">
          <h2 className="text-xl">Tools</h2>
          <ul className="mt-lg grid gap-md sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <IconCard key={tool.href} {...tool} />
            ))}
          </ul>
        </nav>
      </Section>

      {/* The original's @graph, minus `sameAs`: it asserted Facebook and
          LinkedIn profiles that nothing on the page or in SiteFooter links to,
          which is the same mismatch /about-us dropped it for (§10). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                name: SITE_NAME,
                url: BASE_URL,
                logo: OG_IMAGE.url,
                description:
                  'Platform connecting customers with verified solar panel installers',
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'customer service',
                  availableLanguage: ['English', 'Hindi']
                }
              },
              {
                '@type': 'WebSite',
                name: SITE_NAME,
                url: BASE_URL,
                description: 'Find verified solar panel installers near you'
              }
            ]
          })
        }}
      />
    </PageShell>
  );
}
