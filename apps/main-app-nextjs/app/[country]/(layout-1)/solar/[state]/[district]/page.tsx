/**
 * Archetype 2 — geo listing, district level. 245 pages, sitemap priority 1.0,
 * the highest on the site. Spec: archetype/geo-listing.md.
 *
 * Scoped to the sparse page on purpose (§5): the US district page is sections
 * 1, 2, 3, 8 and 15 only, and everything else — the lead form, the project
 * gallery, subsidy, the quote CTA, the FAQ, the IN-only SEO blocks — is gated
 * on a country feature flag or on data this app does not read yet. Build the
 * sparse page first; the IN page is the fat one and will look fine either way.
 *
 * Data comes from lib/directory/data.ts, which answers from fixtures today and
 * becomes the Drizzle loader next. Nothing in this file changes when it does.
 */
import { notFound } from 'next/navigation';
import { PageShell, Section, Stack } from '@/components/layout';
import { Breadcrumb, CityChips, InstallerList, PlaceHeader } from '@/components/directory';
import { getDistrict } from '@/lib/directory/data';
import { geoUrl, installerUrl } from '@/lib/directory/urls';

/**
 * 15 days, the same window as the SvelteKit page's
 * `config.isr.expiration = 1296000`. The directory changes when an installer
 * is added, not by the hour.
 */
export const revalidate = 1296000;

export default async function Page({
  params
}: {
  params: Promise<{ country: string; state: string; district: string }>;
}) {
  const { country, state, district } = await params;
  const level1Slug = state.toLowerCase();
  const level2Slug = district.toLowerCase();

  const data = await getDistrict(country, level1Slug, level2Slug);

  // A district with no businesses 404s. The city leaf does the opposite and
  // 301s here, because the district is the canonical listing — that asymmetry
  // is what keeps thin pages out of the index (§4).
  if (!data) notFound();

  const { level1, level2, installers, cities } = data;
  const citiesCovered = cities.filter((c) => c.linked).length;

  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Solar', href: geoUrl(country) },
    { name: level1, href: geoUrl(country, level1Slug) },
    { name: level2 }
  ];

  return (
    <PageShell>
      {/* Breadcrumb and header are ONE section. The breadcrumb labels the page
          it sits on, so a section gap between them would read as two blocks
          that happen to be adjacent rather than one header. */}
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
        </Stack>
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

      <Section>
        <CityChips
          cities={cities}
          country={country}
          level1Slug={level1Slug}
          level2Slug={level2Slug}
          level2={level2}
        />
      </Section>

      {/* geo-listing.md §10: an ItemList over the installer rows was the obvious
          addition the SvelteKit page never emitted, and it was blocked on there
          being a defined order to describe. §3 settled that, so it goes in now.
          This is a ranked list of local businesses, which is what ItemList is
          for. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: trail.map((c, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: c.name,
                ...(c.href ? { item: c.href } : {})
              }))
            },
            {
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: `Solar installers in ${level2}, ${level1}`,
              numberOfItems: installers.length,
              itemListElement: installers.map((b, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: installerUrl(country, b.slug),
                name: b.name.trim()
              }))
            }
          ])
        }}
      />
    </PageShell>
  );
}
