/**
 * Archetype 2 — geo listing, leaf level. 356 pages.
 * Spec: archetype/geo-listing.md §4.
 *
 * **The route is polymorphic.** One slug resolves against a city, then a
 * brand, then the `{n}kw-solar-system` pattern, and the page dispatches on
 * what came back rather than being the city page with two special cases bolted
 * on (§4). Brand is unreachable today — `solar_brands` is empty — so it is a
 * named gap in `LeafLoad` and in `getLeaf`, not a branch here.
 *
 * Sections per §5, which differ by variant:
 *
 *   city  2, 3, 7, 8, 9, 10, 11, 14, 15 (nearby), 17
 *   size  2, 3, 5, 6, 7, 8, 11, 15 (other sizes), 17
 *
 * and everything past 8 is gated on a country flag on top of that, so a US
 * city leaf renders 2, 3, 7, 8, 14, 15, 17 and nothing else.
 *
 * The two failure modes are different on purpose and both come from the
 * loader:
 *
 *  - a slug that resolves to nothing is a **404**;
 *  - a city that exists but has no installers of its own is a **301 to the
 *    district**, because the district is the canonical listing. Losing that
 *    redirect is what would put 350-odd thin pages back in the index. The
 *    district page does the opposite and 404s when empty.
 *
 * `generateMetadata` is below, through the shared builder in lib/metadata.ts
 * — the whole directory surface got its head tags at once rather than one
 * page type at a time.
 */
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { PageShell, Section, Stack } from '@/components/layout';
import {
  BackLink,
  Breadcrumb,
  ChipList,
  FAQ,
  InstallerList,
  LeadFormSection,
  LeafHeader,
  ProjectGallery,
  QuoteCTA,
  SizePricing,
  SubsidySection
} from '@/components/directory';
import { getCountry, isCountry } from '@/lib/countries';
import { faqFor } from '@/lib/countries/faq';
import { getLeaf } from '@/lib/directory/data';
import { COMMON_SIZES } from '@/lib/directory/pricing';
import { contentUrl, geoUrl } from '@/lib/directory/urls';
import { breadcrumbLD, faqLD, itemListLD, localBusinessLD } from '@/lib/directory/structuredData';
import { pageMetadata, pluralise } from '@/lib/metadata';

/** 15 days, matching the district page and the SvelteKit `isr.expiration`. */
export const revalidate = 1296000;
/**
 * Empty on purpose: this is what turns ISR on, and it is the port of
 * `config.isr` from the SvelteKit load. Do not "tidy" it into a list of real
 * params — that is the variant that couples a ~1,380-page build to the
 * database. See "ISR needs `generateStaticParams` too" in the README.
 */
export async function generateStaticParams() {
  return [];
}


/**
 * Ported from the SvelteKit head, and it dispatches on the leaf variant the
 * same way the page does — a city and a 3 kW system are different subjects
 * and the original wrote them different copy.
 *
 * The two non-page results return `{}`: a `missing` leaf 404s and a
 * `redirect` leaf 301s, and neither renders a head. The canonical for a page
 * that does render is its own URL, never the district's — the redirect is
 * what carries a thin city to the district, not a canonical pointing away
 * from a page that has installers of its own.
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ country: string; state: string; district: string; slug: string }>;
}): Promise<Metadata> {
  const { country, state, district, slug } = await params;
  if (!isCountry(country)) return {};

  const { locale } = getCountry(country);
  const level1Slug = state.toLowerCase();
  const level2Slug = district.toLowerCase();

  const leaf = await getLeaf(country, level1Slug, level2Slug, slug.toLowerCase());
  if (leaf.kind === 'missing' || leaf.kind === 'redirect') return {};

  const { level1, level2, installers } = leaf;
  const place = leaf.kind === 'city' ? leaf.city : level2;

  return pageMetadata({
    title:
      leaf.kind === 'city'
        ? `Solar Panel Installers in ${leaf.city}, ${level2}`
        : `${leaf.sizeKw}kW Solar System in ${level2}, ${level1}`,
    description:
      leaf.kind === 'city'
        ? `Find ${pluralise(installers.length, 'solar installer', 'solar installers')} in ` +
          `${leaf.city}, ${level2}. Compare quotes and view recent projects.`
        : `Get ${leaf.sizeKw}kW solar system installed in ${level2}, ${level1}. Compare ` +
          `${pluralise(installers.length, 'verified installer', 'verified installers')}.`,
    // `leaf.citySlug` rather than the requested slug on a city: the loader
    // resolves the slug against geo_locations, so this is the spelling the
    // district's own chips link to. A canonical is the wrong place to echo
    // whatever the visitor typed.
    path: `${geoUrl(country, level1Slug, level2Slug)}/${
      leaf.kind === 'city' ? leaf.citySlug : `${leaf.sizeKw}kw-solar-system`
    }`,
    locale,
    imageAlt: `Solar panel installers in ${place}`,
    geo: { region: country.toUpperCase(), placename: `${place}, ${level1}` }
  });
}

export default async function Page({
  params
}: {
  params: Promise<{ country: string; state: string; district: string; slug: string }>;
}) {
  const { country, state, district, slug } = await params;

  if (!isCountry(country)) notFound();

  const config = getCountry(country);
  const { features, locale } = config;
  const level1Slug = state.toLowerCase();
  const level2Slug = district.toLowerCase();

  const leaf = await getLeaf(country, level1Slug, level2Slug, slug.toLowerCase());

  const districtUrl = geoUrl(country, level1Slug, level2Slug);

  if (leaf.kind === 'missing') notFound();
  // 301, not 307: this is a permanent statement about where the canonical
  // listing lives, and a temporary redirect would leave the thin URL indexed.
  if (leaf.kind === 'redirect') permanentRedirect(districtUrl);

  const { level1, level2, installers, postalCode } = leaf;

  // The one name this page is about, used for the breadcrumb leaf, the lead
  // form's heading and the CTA. Keeping it as a single value is what stops the
  // variant check spreading through the markup below.
  const place = leaf.kind === 'city' ? leaf.city : level2;
  const leafLabel = leaf.kind === 'city' ? leaf.city : `${leaf.sizeKw} kW solar system`;

  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Solar', href: geoUrl(country) },
    { name: level1, href: geoUrl(country, level1Slug) },
    { name: level2, href: districtUrl },
    { name: leafLabel }
  ];

  // City FAQ only. The size page has no generated copy in the original and
  // gets none here — inventing questions for it would be inventing answers.
  const faqItems =
    leaf.kind === 'city' ? (faqFor(country)?.generateFAQ(leaf.city) ?? []) : [];

  return (
    <PageShell>
      <Section>
        <Stack gap="md">
          <Breadcrumb trail={trail} />
          {leaf.kind === 'city' ? (
            <LeafHeader
              kind="city"
              city={leaf.city}
              level2={level2}
              level1={level1}
              installerCount={installers.length}
            />
          ) : (
            <LeafHeader
              kind="size"
              sizeKw={leaf.sizeKw}
              level2={level2}
              level1={level1}
              installerCount={installers.length}
            />
          )}
        </Stack>
      </Section>

      {/* Sections 5 and 6 — size only, and both about the system rather than
          the place, so they sit above the form: a reader who came for "what
          does 3 kW cost" gets the number before being asked for their phone
          number. Section 5 is gated on features.subsidy because the figures
          are PM Surya Ghar slabs; section 6 links an IN-only content family. */}
      {leaf.kind === 'size' && features.subsidy ? (
        <Section>
          <SizePricing sizeKw={leaf.sizeKw} place={level2} />
        </Section>
      ) : null}

      {leaf.kind === 'size' && features.seoContentFamilies ? (
        <Section>
          <p className="text-sm text-ink-muted">
            <a href={contentUrl(`/rooftop-solar/${leaf.sizeKw}kw-system/`)}>
              What a {leaf.sizeKw} kW system powers
            </a>{' '}
            — sizing, generation and payback, away from any one district.
          </p>
        </Section>
      ) : null}

      <Section>
        <LeadFormSection country={config} place={place} />
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

      {leaf.kind === 'city' && features.projects && leaf.projects.length > 0 ? (
        <Section>
          <ProjectGallery
            projects={leaf.projects}
            country={country}
            place={level2}
            locale={locale}
          />
        </Section>
      ) : null}

      {leaf.kind === 'city' && features.subsidy ? (
        <Section>
          <SubsidySection place={leaf.city} />
        </Section>
      ) : null}

      {country === 'in' ? (
        <Section>
          <QuoteCTA country={country} place={place} />
        </Section>
      ) : null}

      {faqItems.length > 0 ? (
        <Section>
          <FAQ items={faqItems} heading={`Common questions about solar in ${place}`} />
        </Section>
      ) : null}

      {/* Section 15 — sideways navigation, and the one section whose content
          is the variant. Cities go to other cities that have installers;
          sizes go to the other priced sizes. Both are links by construction,
          so neither needs the inert-chip treatment §6 forced on the district's
          city row. */}
      {leaf.kind === 'city' && leaf.siblingCities.length > 0 ? (
        <Section>
          <nav aria-label={`Other areas in ${level2}`}>
            <ChipList
              heading={`Other areas in ${level2}`}
              chips={leaf.siblingCities.map((c) => ({
                label: c.name,
                href: `${geoUrl(country, level1Slug, level2Slug, c.slug)}/`
              }))}
            />
          </nav>
        </Section>
      ) : null}

      {leaf.kind === 'size' && features.seoContentFamilies ? (
        <Section>
          <nav aria-label={`Other system sizes in ${level2}`}>
            <ChipList
              heading={`Other system sizes in ${level2}`}
              chips={COMMON_SIZES.filter((kw) => kw !== leaf.sizeKw).map((kw) => ({
                label: `${kw} kW solar system`,
                href: `${districtUrl}/${kw}kw-solar-system/`
              }))}
            />
          </nav>
        </Section>
      ) : null}

      <Section>
        <BackLink href={`${districtUrl}/`} label={`All installers in ${level2}`} />
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbLD(trail),
            itemListLD(
              leaf.kind === 'city'
                ? `Solar installers in ${leaf.city}, ${level2}`
                : `${leaf.sizeKw} kW solar installers in ${level2}, ${level1}`,
              installers,
              country
            ),
            ...installers.slice(0, 5).map((b) =>
              localBusinessLD(
                {
                  name: b.name,
                  slug: b.slug,
                  address: b.address,
                  city: b.city || place,
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
