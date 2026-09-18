/**
 * Archetype 3 — geo index, state hub. 27 pages. Spec: archetype/geo-index.md.
 *
 * The country hub one level down, and deliberately the same six parts at a
 * different scope (§1): both pages list CHILD LOCATIONS and show no
 * businesses, which is why the country and state hubs are one archetype with
 * the district page and city leaf in another — the split is by what the page
 * lists, not by zoom level.
 *
 * Vocabulary is data, never a hardcoded string: `levels.level2` is
 * District/Districts on IN and County/Counties on US, and every label below
 * comes from the country config.
 *
 * Decisions specific to this level:
 *
 *  - **The coverage bar is here now**, which §9 question 2 asked about. The
 *    numbers were already in the loader and were never drawn. It sits under
 *    the header at page scale, because a state has ONE ratio to report — where
 *    the country hub has one per card.
 *  - **Cards are ordered by installer count, not alphabetically.** DECIDED
 *    2026-09-18 (§9). Someone browsing a state is looking for somewhere with
 *    options; a name they already knew they could have searched for. The
 *    ItemList below describes that order rather than claiming another.
 *  - **The CTA moved below the grid**, which is the drift §3 flagged: it was
 *    above the grid here and below it on the country hub. The grid is the
 *    page, so it goes below at both levels.
 *  - **The subsidy callout is not built.** §3 lists it, gated on
 *    `features.subsidy` and a published `state_subsidies` row — but that table
 *    is empty on live in every status (verified 2026-09-18), so the gate can
 *    never open. It is recorded in lib/directory/data.ts rather than shipped
 *    as a section that cannot render.
 *
 * No client components: the FAQ is native `<details>` and every card is an
 * anchor.
 */
import { notFound } from 'next/navigation';
import { PageShell, Section, Stack } from '@/components/layout';
import { Breadcrumb, CoverageBar, FAQ, LocationGrid, QuoteCTA } from '@/components/directory';
import { getCountry, isCountry } from '@/lib/countries';
import { faqFor } from '@/lib/countries/faq';
import { getStateHub } from '@/lib/directory/data';
import { geoUrl } from '@/lib/directory/urls';
import { BASE_URL, breadcrumbLD, faqLD } from '@/lib/directory/structuredData';

/** 15 days, matching the SvelteKit page's `config.isr.expiration`. */
export const revalidate = 1296000;

export default async function Page({
  params
}: {
  params: Promise<{ country: string; state: string }>;
}) {
  const { country, state } = await params;

  if (!isCountry(country)) notFound();

  const config = getCountry(country);
  const { levels, name: countryName } = config;
  const level1Slug = state.toLowerCase();

  const data = await getStateHub(country, level1Slug);

  // Only an unknown slug 404s. A state with no installers is a real place with
  // an honest empty answer, unlike a district page with no businesses — that
  // one is a thin page and does 404 (geo-listing.md §4).
  if (!data) notFound();

  const { level1, level2s, installerCount, level2Count, totalLevel2Count } = data;

  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Solar', href: geoUrl(country) },
    { name: level1 }
  ];

  const level2Label = levels.level2.plural.toLowerCase();

  // The FAQ copy and the FAQPage structured data come from this one array, so
  // the markup cannot claim questions the page does not show.
  //
  // Suppressed entirely on a state with no installers. The generator's first
  // question is "How many districts in X have solar installers?" and it
  // answers "verified solar installers listed across 0 districts" — copy that
  // reads as a bug and that the FAQPage markup would then publish to search.
  // /in/solar/sikkim is the live case: a real state, reachable directly, with
  // nothing in it. A page with no answer should not run a Q&A.
  const faqItems =
    installerCount > 0 ? (faqFor(country)?.generateStateFAQ(level1, level2Count) ?? []) : [];

  return (
    <PageShell>
      <Section>
        <Stack gap="md">
          <Breadcrumb trail={trail} />
          <header>
            <h1 className="text-2xl leading-tight">Solar installers in {level1}</h1>
            {/* One sentence carrying the numbers, as on the country hub — the
                original's chips and tinted callout said the same figures twice
                (§4), and the callout's links were `text-primary-strong`, the
                same token as the bold text around them. */}
            <p className="mt-sm max-w-prose text-ink-muted">
              {installerCount === 0 ? (
                <>
                  No installers are listed in {level1} yet.{' '}
                  <a href={geoUrl(country)}>
                    See coverage across {countryName}
                  </a>
                  .
                </>
              ) : (
                <>
                  <span className="font-semibold tabular-nums text-ink">{installerCount}</span>{' '}
                  {installerCount === 1 ? 'installer' : 'installers'} across{' '}
                  <span className="font-semibold tabular-nums text-ink">{level2Count}</span> of{' '}
                  {level1}&rsquo;s <span className="tabular-nums">{totalLevel2Count}</span>{' '}
                  {level2Label}.
                </>
              )}
            </p>
            {installerCount > 0 ? (
              // Page scale, not card scale: a state has one ratio to report.
              // aria-hidden because the sentence above states the same figures.
              <div className="mt-md max-w-narrow">
                <CoverageBar
                  covered={level2Count}
                  total={totalLevel2Count}
                  label={level2Label}
                  labelled={false}
                />
              </div>
            ) : null}
          </header>
        </Stack>
      </Section>

      {/* The heading lives inside the guard, not above the grid. `LocationGrid`
          returns null on an empty list, so a state with no installers would
          otherwise render "Browse by district" over nothing — a heading
          promising navigation the page does not have. */}
      {level2s.length > 0 ? (
        <Section>
          <nav aria-label={`Solar installers by ${levels.level2.singular.toLowerCase()}`}>
            <h2 className="text-xl">Browse by {levels.level2.singular.toLowerCase()}</h2>
            <LocationGrid
              items={level2s.map((d) => ({
                name: d.name,
                href: geoUrl(country, level1Slug, d.slug),
                installerCount: d.installerCount
                // No `coverage`: a district has no further level to report a
                // ratio over. The card's shape says so rather than a flag.
              }))}
            />
          </nav>
        </Section>
      ) : null}

      {faqItems.length > 0 ? (
        <Section>
          <FAQ items={faqItems} place={level1} />
        </Section>
      ) : null}

      {country === 'in' ? (
        <Section>
          <QuoteCTA country={country} place={level1} />
        </Section>
      ) : null}

      {/* §7. BreadcrumbList and FAQPage are what the original emitted; the
          ItemList is the addition, and it describes the order the grid
          actually renders — deepest choice first. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbLD(trail),
            // Omitted rather than emitted with numberOfItems: 0 — an empty
            // ItemList is a claim that the list exists and is empty, which is
            // not what a state with no coverage should publish.
            ...(level2s.length > 0
              ? [
                  {
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    name: `Solar installers in ${level1} by ${levels.level2.singular.toLowerCase()}`,
                    numberOfItems: level2s.length,
                    itemListElement: level2s.map((d, i) => ({
                      '@type': 'ListItem',
                      position: i + 1,
                      url: `${BASE_URL}${geoUrl(country, level1Slug, d.slug)}`,
                      name: d.name
                    }))
                  }
                ]
              : []),
            ...(faqItems.length > 0 ? [faqLD(faqItems)] : [])
          ])
        }}
      />
    </PageShell>
  );
}
