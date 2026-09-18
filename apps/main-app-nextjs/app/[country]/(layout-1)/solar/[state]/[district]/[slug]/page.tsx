/**
 * Archetype 2 — geo listing, leaf level. 356 pages. README open item 8,
 * spec archetype/geo-listing.md §4.
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
 * No `generateMetadata` — the SvelteKit leaf emits title, description,
 * canonical and OG tags, and nothing in this app emits any of them yet, not
 * even the district page at sitemap priority 1.0. Adding it to one page type
 * would make the gap harder to see, so it is README open item 13 covering all
 * of them.
 */
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

/** 15 days, matching the district page and the SvelteKit `isr.expiration`. */
export const revalidate = 1296000;

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
          <FAQ items={faqItems} place={place} />
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
