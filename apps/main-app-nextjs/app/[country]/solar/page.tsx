/**
 * Archetype 3 — geo index, country hub. 2 pages, and the top of the directory
 * surface. Spec: archetype/geo-index.md.
 *
 * Small by count and large by consequence: this and the 27 state hubs are the
 * entry point to the other 1,250 URLs in the directory.
 *
 * The page's real subject is *where we have installers*, and coverage is thin
 * — 22 of 36 states on IN, 5 of 52 on US (live, 2026-09-18). §2 of the spec is
 * the whole design brief: report that honestly, as a ratio, rather than
 * implying the directory is everywhere.
 *
 * Four decisions the port made, all of them §9 open questions:
 *
 *  1. **The chips and the callout are gone, replaced by one sentence.** §4
 *     measured the original saying the same three numbers twice — three
 *     `bg-muted` chips, then the same three as prose in a tinted band with a
 *     percentage. Showing a figure twice is a large part of why these pages
 *     read as noisy. The header sentence is now the one carrier, which is what
 *     the approved specimen does.
 *  2. **"Where choice is deepest" is in**, from the specimen rather than the
 *     spec's anatomy. See components/directory/TopPlaces.tsx.
 *  3. **The CTA sits below the grid**, resolving the drift §3 found between
 *     the two levels. The grid is the page, so nothing goes above it but the
 *     header.
 *  4. **`lastUpdated` is dropped.** It was `new Date().toISOString()` — "now",
 *     not a last-updated date — and nothing rendered it. See data.ts.
 *
 * No client components. Every card is an anchor; there is nothing here that
 * needs JavaScript.
 */
import { notFound } from 'next/navigation';
import { PageShell, Section, Stack } from '@/components/layout';
import {
  Breadcrumb,
  ChipList,
  LocationGrid,
  QuoteCTA,
  TopPlaces
} from '@/components/directory';
import { getCountry, isCountry } from '@/lib/countries';
import { getCountryHub } from '@/lib/directory/data';
import { contentUrl, geoUrl } from '@/lib/directory/urls';
import { BASE_URL, breadcrumbLD } from '@/lib/directory/structuredData';

/** 15 days, matching the SvelteKit page's `config.isr.expiration`. */
export const revalidate = 1296000;

/**
 * The four editorial families the original links here, through `contentUrl`
 * because they are mid-migration out from under the /in prefix. These are the
 * family INDEXES, where the district page links three specific articles — a
 * country hub is the wrong place to pick one page out of a family.
 */
const GUIDES = [
  { label: 'Rooftop solar guide', href: contentUrl('/rooftop-solar/') },
  { label: 'Solar subsidy guide', href: contentUrl('/solar-subsidy/') },
  { label: 'Solar financing', href: contentUrl('/solar-financing/') },
  { label: 'Solar panels', href: contentUrl('/solar-panels/') }
];

export default async function Page({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;

  // Same guard as the district page: middleware rejects an unknown two-letter
  // prefix, but this page reads a country CONFIG and `getCountry` throws
  // rather than returning null. Narrowing here turns a would-be 500 into the
  // 404 it should be.
  if (!isCountry(country)) notFound();

  const config = getCountry(country);
  const { levels, features, locale, name } = config;
  const data = await getCountryHub(country);

  const trail = [{ name: 'Home', href: '/' }, { name: 'Solar' }];

  const level1Label = levels.level1.plural.toLowerCase();
  const level2Label = levels.level2.plural.toLowerCase();

  return (
    <PageShell>
      {/* Breadcrumb and header are ONE section, as on the district page: the
          breadcrumb labels the page it sits on, and a section gap between them
          would read as two adjacent blocks rather than one header. */}
      <Section>
        <Stack gap="md">
          <Breadcrumb trail={trail} />
          <header>
            <h1 className="text-2xl leading-tight">Solar installers across {name}</h1>
            {/* The one carrier of the coverage numbers (§4). Stated as ratios
                rather than bare counts — "22 of 36 states" is a claim a reader
                can check, where "22 states" implies coverage we do not have.
                tabular-nums so the figures read as data inside the sentence.

                No possessive on the country name: `config.name` is a bare
                'United States', so "of United States's 3,207 counties" is what
                that construction produces. The ratio does not need the name —
                the h1 directly above already established the country.

                Grouped through the locale, as SocialProof does. Only this
                page has four-figure numbers in it (3,207 US counties), and
                en-IN groups differently from en-US, which is the whole reason
                the locale is in the config. */}
            <p className="mt-sm max-w-prose text-ink-muted">
              <span className="font-semibold tabular-nums text-ink">
                {data.totalInstallers.toLocaleString(locale)}
              </span>{' '}
              installers listed in{' '}
              <span className="font-semibold tabular-nums text-ink">
                {data.coveredLevel2Count.toLocaleString(locale)}
              </span>{' '}
              of <span className="tabular-nums">{data.totalLevel2Count.toLocaleString(locale)}</span>{' '}
              {level2Label}, across{' '}
              <span className="font-semibold tabular-nums text-ink">{data.level1Count}</span>{' '}
              of <span className="tabular-nums">{data.totalLevel1Count}</span> {level1Label}.
            </p>
          </header>
        </Stack>
      </Section>

      {/* No <nav> wrapper — see TopPlaces.tsx. `nav a` strips link styling,
          which is right for the card grids below and wrong for a flat list. */}
      {data.topLevel2s.length > 0 ? (
        <Section>
          <TopPlaces places={data.topLevel2s} country={country} />
        </Section>
      ) : null}

      {/* Heading inside the guard, as on the state hub: `LocationGrid` returns
          null on an empty list, and a heading over nothing promises navigation
          the page does not have. */}
      {data.level1s.length > 0 ? (
        <Section>
          <nav aria-label={`Solar installers by ${levels.level1.singular.toLowerCase()}`}>
            <h2 className="text-xl">Browse by {levels.level1.singular.toLowerCase()}</h2>
            <LocationGrid
              items={data.level1s.map((s) => ({
                name: s.name,
                href: geoUrl(country, s.slug),
                installerCount: s.installerCount,
                // The bar, which §2 calls the best piece of information design
                // on the directory surface. The state hub draws the same ratio
                // one level up, at page scale rather than per card.
                coverage: {
                  covered: s.coveredLevel2Count,
                  total: s.level2Count,
                  label: level2Label
                }
              }))}
            />
          </nav>
        </Section>
      ) : null}

      {features.seoContentFamilies ? (
        <Section>
          <nav aria-label="Solar guides">
            <ChipList heading="Solar guides" chips={GUIDES} />
          </nav>
        </Section>
      ) : null}

      {/* `cc === 'in'` rather than a feature flag, as on the district page:
          /get-quotes is a single IN page, not a family with a flag. */}
      {country === 'in' ? (
        <Section>
          <QuoteCTA country={country} place={name} />
        </Section>
      ) : null}

      {/* §7. BreadcrumbList was all the original emitted. The ItemList is the
          obvious addition and, unlike archetype 2, was never blocked on
          anything: the order here is well defined, and it is the order the
          grid renders. It points at the state hubs, not at businesses, which
          is why this builds its URLs rather than reusing `itemListLD` — that
          helper maps items through `installerUrl`. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbLD(trail),
            ...(data.level1s.length > 0
              ? [
                  {
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    name: `Solar installers in ${name} by ${levels.level1.singular.toLowerCase()}`,
                    numberOfItems: data.level1s.length,
                    itemListElement: data.level1s.map((s, i) => ({
                      '@type': 'ListItem',
                      position: i + 1,
                      url: `${BASE_URL}${geoUrl(country, s.slug)}`,
                      name: s.name
                    }))
                  }
                ]
              : [])
          ])
        }}
      />
    </PageShell>
  );
}
