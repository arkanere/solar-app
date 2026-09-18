/**
 * Archetype 2 — geo listing, district level. 245 pages, sitemap priority 1.0,
 * the highest on the site. Spec: archetype/geo-listing.md.
 *
 * Now the whole district page. The previous slice was the sparse page — the
 * sections a US district renders — and this one adds everything that was
 * gated behind a country feature flag: the lead form, the social-proof line,
 * the project gallery, the subsidy block, the quote CTA, the two IN-only SEO
 * chip rows, the recommended-systems table and the FAQ.
 *
 * The gating is real, not decorative. A US county page renders sections 2, 3,
 * 7, 8, 14 and 15 and nothing else; an Indian district renders all of them.
 * Both come out of this one file, and `lib/countries/` is what decides which —
 * which is why that port had to land first.
 *
 * Section order follows geo-listing.md §5, with one change carried over from
 * the previous slice: the video hero (section 1) is a typographic PlaceHeader.
 *
 * ⚠️ The lead form does not submit. See components/directory/LeadForm.tsx.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell, Section, Stack } from '@/components/layout';
import {
  Breadcrumb,
  ChipList,
  CityChips,
  FAQ,
  InstallerList,
  LeadFormSection,
  PlaceHeader,
  ProjectGallery,
  QuoteCTA,
  RecommendedSystems,
  SocialProof,
  SubsidySection
} from '@/components/directory';
import { getCountry, isCountry } from '@/lib/countries';
import { faqFor } from '@/lib/countries/faq';
import { getDistrict } from '@/lib/directory/data';
import { contentUrl, geoUrl } from '@/lib/directory/urls';
import { breadcrumbLD, faqLD, itemListLD, localBusinessLD } from '@/lib/directory/structuredData';
import { pageMetadata, pluralise } from '@/lib/metadata';

/**
 * 15 days, the same window as the SvelteKit page's
 * `config.isr.expiration = 1296000`. The directory changes when an installer
 * is added, not by the hour.
 */
export const revalidate = 1296000;

/** Section 16. IN only, and the sizes the leaf route actually serves. */
const COMMON_SIZES = [1, 2, 3, 5, 10];

/**
 * Section 12. Three hand-picked editorial links, through `contentUrl` because
 * these families are mid-migration out from under the /in prefix — all three
 * are already in MOVED_TO_ROOT, so today they emit country-less hrefs.
 */
const GUIDES = [
  { label: 'Solar system cost guide', href: contentUrl('/rooftop-solar/cost/') },
  { label: 'PM Surya Ghar subsidy', href: contentUrl('/solar-subsidy/pm-surya-ghar/') },
  { label: 'Installation process', href: contentUrl('/solar-installation/process/') }
];

/**
 * Ported from the SvelteKit head, which is the fullest of the five — title,
 * description, canonical, eight OG tags, five Twitter tags and the two geo
 * ones. `pageMetadata` emits that set for every page now, so this one only
 * supplies the copy.
 *
 * `getDistrict` is memoised per request, so this and the page below share one
 * set of queries.
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ country: string; state: string; district: string }>;
}): Promise<Metadata> {
  const { country, state, district } = await params;
  if (!isCountry(country)) return {};

  const { locale } = getCountry(country);
  const level1Slug = state.toLowerCase();
  const level2Slug = district.toLowerCase();

  const data = await getDistrict(country, level1Slug, level2Slug);
  // The page 404s on the same null — an empty district is a thin page (§4).
  if (!data) return {};

  const { level1, level2, installers } = data;

  return pageMetadata({
    title: `Top Solar Panel Installers in ${level2}, ${level1}`,
    description:
      `Find ${pluralise(
        installers.length,
        'verified solar panel installer',
        'verified solar panel installers'
      )} in ${level2}, ${level1}. Compare quotes, view recent projects, and get the best ` +
      `solar installation deals.`,
    path: geoUrl(country, level1Slug, level2Slug),
    locale,
    imageAlt: `Solar panel installers in ${level2}`,
    geo: { region: country.toUpperCase(), placename: `${level2}, ${level1}` }
  });
}

export default async function Page({
  params
}: {
  params: Promise<{ country: string; state: string; district: string }>;
}) {
  const { country, state, district } = await params;

  // middleware.ts already rejects an unknown two-letter prefix, but this page
  // reads a country CONFIG, and `getCountry` throws rather than returning
  // null. Narrowing here turns a would-be 500 into the 404 it should be, and
  // stops the page depending on middleware for its own type safety.
  if (!isCountry(country)) notFound();

  const config = getCountry(country);
  const { features, locale } = config;
  const level1Slug = state.toLowerCase();
  const level2Slug = district.toLowerCase();

  const data = await getDistrict(country, level1Slug, level2Slug);

  // A district with no businesses 404s. The city leaf does the opposite and
  // 301s here, because the district is the canonical listing — that asymmetry
  // is what keeps thin pages out of the index (§4).
  if (!data) notFound();

  const { level1, level2, installers, cities, projects, leadCount, postalCode } = data;
  const citiesCovered = cities.filter((c) => c.linked).length;

  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Solar', href: geoUrl(country) },
    { name: level1, href: geoUrl(country, level1Slug) },
    { name: level2 }
  ];

  // The FAQ copy and the FAQPage structured data come from this one array, so
  // the markup cannot claim questions the page does not show, or vice versa.
  // A country with no entry in lib/countries/faq.ts gets neither.
  const faqItems = faqFor(country)?.generateDistrictFAQ(level2, level1, installers.length) ?? [];

  return (
    <PageShell>
      {/* Breadcrumb and header are ONE section. The breadcrumb labels the page
          it sits on, so a section gap between them would read as two blocks
          that happen to be adjacent rather than one header. The social-proof
          line joins them for the same reason: it is a fact about this place,
          not a section of its own. */}
      <Section>
        <Stack gap="md">
          <Breadcrumb trail={trail} />
          <PlaceHeader
            level2={level2}
            level1={level1}
            installerCount={installers.length}
            citiesCovered={citiesCovered}
            citiesTotal={cities.length}
          />
          <SocialProof count={leadCount} place={level2} locale={locale} />
        </Stack>
      </Section>

      <Section>
        <LeadFormSection country={config} place={level2} />
      </Section>

      <Section>
        <InstallerList
          installers={installers}
          country={country}
          level1={level1}
          level1Slug={level1Slug}
          level2={level2}
        />
      </Section>

      {features.projects && projects.length > 0 ? (
        <Section>
          <ProjectGallery
            projects={projects}
            country={country}
            place={level2}
            locale={locale}
          />
        </Section>
      ) : null}

      {features.subsidy ? (
        <Section>
          <SubsidySection place={level2} />
        </Section>
      ) : null}

      {/* Section 11 is `cc === 'in'` in the original rather than a feature
          flag, and stays so: /get-quotes is a single IN page, not a family
          with a flag. */}
      {country === 'in' ? (
        <Section>
          <QuoteCTA country={country} place={level2} />
        </Section>
      ) : null}

      {/* Sections 12, 13 and 16 — the IN-only SEO surface.
          DECIDED 2026-09-16 (geo-listing.md §12 question 3): they stay three
          separate sections rather than folding into one "related" block. The
          heading is what tells three visually identical chip rows apart, and
          "guides to read" and "places to go next" are genuinely different
          offers — one box asserting otherwise is shorter, not clearer. */}
      {features.seoContentFamilies ? (
        <Section>
          <nav aria-label="Solar guides">
            <ChipList heading="Solar guides" chips={GUIDES} />
          </nav>
        </Section>
      ) : null}

      {features.seoContentFamilies ? (
        <Section>
          <RecommendedSystems />
        </Section>
      ) : null}

      {faqItems.length > 0 ? (
        <Section>
          <FAQ items={faqItems} place={level2} />
        </Section>
      ) : null}

      <Section>
        <CityChips
          cities={cities}
          country={country}
          level1Slug={level1Slug}
          level2Slug={level2Slug}
          level2={level2}
        />
      </Section>

      {features.seoContentFamilies ? (
        <Section>
          <nav aria-label={`Solar systems by size in ${level2}`}>
            <ChipList
              heading={`Solar systems by size in ${level2}`}
              chips={COMMON_SIZES.map((kw) => ({
                label: `${kw} kW solar system`,
                href: `${geoUrl(country, level1Slug, level2Slug)}/${kw}kw-solar-system`
              }))}
            />
          </nav>
        </Section>
      ) : null}

      {/* geo-listing.md §10. The ItemList was the obvious addition the
          SvelteKit page never emitted, and it was blocked on there being a
          defined order to describe; §3 settled that. LocalBusiness is capped
          at 5, as in the original — it is a sample of the list, and twenty-two
          of them on one page is a feed, not a page description. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbLD(trail),
            itemListLD(`Solar installers in ${level2}, ${level1}`, installers, country),
            ...installers.slice(0, 5).map((b) =>
              localBusinessLD(
                {
                  name: b.name,
                  slug: b.slug,
                  address: b.address,
                  city: b.city || level2,
                  state: level1,
                  postalCode,
                  phone: b.phone
                },
                country
              )
            ),
            ...(faqItems.length > 0 ? [faqLD(faqItems)] : [])
          ])
        }}
      />
    </PageShell>
  );
}
