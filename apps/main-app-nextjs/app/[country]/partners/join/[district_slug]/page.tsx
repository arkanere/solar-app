/**
 * `/{cc}/partners/join/{district_slug}` — the partner signup, pitched at one
 * district.
 *
 * `/partners/join` with a recruiting argument on top: how many installers are
 * already here, how many cities the district covers, and how many homeowners
 * asked for a quote in the last 30 days. The form underneath is the same one.
 *
 * **Not in any sitemap**, per routes.md, so this is a page the recruiting
 * links point at rather than one search reaches cold. That is also why the
 * lead count is the headline — it is the number that matters to the reader,
 * and it is the one a generic signup page cannot show.
 *
 * **IN in practice.** The slug space is the IN geo tree and nothing links this
 * from /us, but the loader takes the country as a parameter, so a US county
 * slug would resolve if one were ever linked. Nothing here assumes otherwise.
 *
 * Two things the port changes, both because a figure that is zero is not the
 * same as a figure that is small:
 *
 *  - **the stat row is dropped when the district is empty.** The original
 *    always renders "0 Installers in {district}" and "0 Cities Covered". On a
 *    RECRUITING page, "0 installers" reads as "nobody works here" rather than
 *    as the opportunity it is meant to be. The tiles appear when there is
 *    something to report; the pitch above them carries the page otherwise.
 *  - **the empty-district pitch is explicit.** The original's headline copy is
 *    conditional on `recentLeadCount > 0` and there is no alternative branch,
 *    so a district with no recent leads gets a bare `h1` and a form. Being
 *    first in a district is the argument there, and it is now made.
 *
 * The Meta Pixel on the SvelteKit original is not ported — see the note in
 * `business-form/page.tsx`.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MapPin, TrendingUp, Users } from 'lucide-react';
import { PageShell, Section, Stack } from '@/components/layout';
import { Breadcrumb, ChipList } from '@/components/directory';
import { BusinessForm } from '@/components/forms';
import { StatTile } from '@/components/tools/Panel';
import { getCountry, isCountry } from '@/lib/countries';
import { getPartnerDistrict } from '@/lib/forms/data';
import { breadcrumbLD } from '@/lib/directory/structuredData';
import { pageMetadata, pluralise } from '@/lib/metadata';

/** 15 days, matching the SvelteKit page's `config.isr.expiration`. */
export const revalidate = 1296000;

/** Empty on purpose — see "ISR needs `generateStaticParams` too" in the README. */
export async function generateStaticParams() {
  return [];
}

type Params = Promise<{ country: string; district_slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { country, district_slug } = await params;
  if (!isCountry(country)) return {};
  const config = getCountry(country);

  // Memoised for the request, so the page below re-reads this rather than
  // running the five queries a second time.
  const data = await getPartnerDistrict(country, district_slug.toLowerCase());
  if (!data) return {};

  const demand =
    data.recentLeadCount > 0
      ? ` ${pluralise(data.recentLeadCount, 'homeowner', 'homeowners', config.locale)} requested solar quotes there last month.`
      : '';

  return pageMetadata({
    title: `Become a Solar Installer Partner in ${data.district}`,
    description: `Join ${config.brandName}'s installer network in ${data.district}, ${data.state}.${demand} Get verified leads and grow your business.`,
    path: `/${country}/partners/join/${data.districtSlug}`,
    locale: config.locale,
    imageAlt: `Become a ${config.brandName} installer partner in ${data.district}`,
    geo: { region: data.state, placename: data.district }
  });
}

export default async function Page({ params }: { params: Params }) {
  const { country, district_slug } = await params;
  if (!isCountry(country)) notFound();
  const config = getCountry(country);

  const data = await getPartnerDistrict(country, district_slug.toLowerCase());
  if (!data) notFound();

  const level2Label = config.levels.level2;
  const trail = [
    { name: 'Home', href: `/${country}` },
    { name: 'Partners', href: `/${country}/partners` },
    { name: 'Join', href: `/${country}/partners/join` },
    { name: data.district }
  ];

  // Only the ones that have somebody in them. A chip for an empty district
  // sends the reader to another page that has nothing to report.
  const nearby = data.nearbyDistricts
    .filter((d) => d.installerCount > 0)
    .map((d) => ({ label: d.name, href: `/${country}/partners/join/${d.slug}` }));

  const hasStats = data.installerCount > 0 || data.cityCount > 0 || data.recentLeadCount > 0;

  return (
    <PageShell>
      <Section width="narrow">
        <Stack gap="md">
          <Breadcrumb trail={trail} />
          <header>
            <h1 className="text-2xl leading-tight">
              Become a solar installer partner in {data.district}
            </h1>
            <p className="mt-sm text-ink-muted">
              {data.recentLeadCount > 0 ? (
                <>
                  <strong className="font-semibold text-ink tabular-nums">
                    {pluralise(data.recentLeadCount, 'homeowner', 'homeowners', config.locale)}
                  </strong>{' '}
                  in {data.district} asked for solar quotes in the last month. List your business
                  and those enquiries can reach you.
                </>
              ) : data.installerCount === 0 ? (
                <>
                  No installer covers {data.district} yet. List your business and you are the one
                  we send {data.district} enquiries to.
                </>
              ) : (
                <>
                  List your business to reach homeowners looking for solar across {data.district},{' '}
                  {data.state}.
                </>
              )}
            </p>
          </header>
        </Stack>
      </Section>

      {hasStats ? (
        <Section width="narrow">
          {/* Stacked on a phone and N-up from md, which is the shape
              EmiCalculator's tile row uses. The column count follows the tile
              count so the optional third tile never orphans at half width on
              its own row. Both class strings are literal: Tailwind cannot see
              a composed one. */}
          <div
            className={
              data.recentLeadCount > 0
                ? 'grid grid-cols-1 gap-md md:grid-cols-3'
                : 'grid grid-cols-1 gap-md md:grid-cols-2'
            }
          >
            <StatTile
              icon={Users}
              value={data.installerCount.toLocaleString(config.locale)}
              label={`Installers in ${data.district}`}
            />
            <StatTile
              icon={MapPin}
              value={data.cityCount.toLocaleString(config.locale)}
              label="Cities covered"
            />
            {data.recentLeadCount > 0 ? (
              <StatTile
                icon={TrendingUp}
                value={data.recentLeadCount.toLocaleString(config.locale)}
                label="Quote requests, last 30 days"
              />
            ) : null}
          </div>
        </Section>
      ) : null}

      <Section width="narrow">
        <BusinessForm country={config} />
      </Section>

      {nearby.length > 0 ? (
        <Section width="narrow">
          <ChipList
            heading={`Also recruiting in nearby ${level2Label.plural.toLowerCase()}`}
            chips={nearby}
          />
        </Section>
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD(trail)) }}
      />
    </PageShell>
  );
}
