/**
 * Archetype 1 — the installer profile. 649 pages, 46% of the site, the
 * largest archetype. Spec: archetype/installer-profile.md, approved at
 * /specimen/archetypes/installer.
 *
 * One business, one question: should I call these people? Per
 * archetype/data.md most of what the old page displayed is the same on every
 * profile — the badge, the About text, the service chips — so the weight goes
 * on the name, the place, the phone and, on the 6% that have them, the
 * photographs of real work.
 *
 * THE PAGE IS TWO COLUMNS from `lg`: the work and what they do in the main
 * column, contact stuck beside it. Below that it is one column and the contact
 * panel falls to the bottom, so the call buttons are also rendered inline
 * under the name — the one duplicated element on the page, and the reason is
 * that nearly all this traffic is on a phone.
 *
 * Changes from the SvelteKit page, each recorded in the spec:
 *
 *  - the "Verified Business" badge is gone (§5, decided 2026-09-06). It was
 *    constant on 100% of profiles and it held the top-right of the identity
 *    block;
 *  - CALL NOW and WHATSAPP are one `action` hue, filled and outlined, instead
 *    of `bg-destructive` and `bg-success` — status colours doing the work of
 *    actions (§6);
 *  - the gallery moves from eighth to second, above the constant chip rows,
 *    because on the 38 pages that have one it is the only proof on the page
 *    (§4);
 *  - services and brands stop being chips. They are static labels, and chips
 *    that are not links must not look like links (§6);
 *  - `google_maps_link` is normalised before it is used as an href. A bare
 *    place name resolved against the installer path and 404ed. Fixed in
 *    `mapsUrl`, and it is a real bug fix, not a tidy-up;
 *  - LocalBusiness gets the business's own `postal_code`, which the old page
 *    passed as `''` while the column sat in the table, and emits no
 *    aggregateRating — `rscore` is 0 on every row (§10).
 *
 * DECIDED 2026-09-18, the two §12 questions that were still open:
 *
 *  - the About paragraph renders whatever the description says, including the
 *    boilerplate 608 profiles carry. The specimen hid it; showing it is the
 *    call, and it is README rule 2 — keep most content as it is;
 *  - `instagram_id` renders, in the contact panel. Note the coverage: it is on
 *    9 visible profiles, not the 15.2% archetype/data.md records, which looks
 *    like that table repeating the google_maps_link row. That row is wrong
 *    too — live says 31 of 646, not 15.2%.
 *
 * `generateMetadata` is below. It is the one page that does not port the
 * SvelteKit description: §7's finding is that the old one interpolates
 * `description` and so ships near-identical on 608 pages.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MapPin } from 'lucide-react';

import { PageShell, Section, Stack } from '@/components/layout';
import {
  BackLink,
  Breadcrumb,
  CallButton,
  ContactPanel,
  InstallerProjects,
  QuoteCTA,
  WhatsAppButton
} from '@/components/directory';
import { getCountry, isCountry } from '@/lib/countries';
import { BRAND_NAMES } from '@/lib/directory/brands';
import { getInstaller } from '@/lib/directory/data';
import { SERVICE_NAMES } from '@/lib/directory/services';
import { geoUrl, installerUrl } from '@/lib/directory/urls';
import { breadcrumbLD, localBusinessLD } from '@/lib/directory/structuredData';
import { clampDescription, pageMetadata } from '@/lib/metadata';

/** 15 days, matching the SvelteKit page's `config.isr.expiration`. */
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
 * The one page whose description is NOT the SvelteKit one.
 *
 * The original was `${name} is a solar panel installer in ${city},
 * ${district}. ${description.slice(0, 120)}` — and `description` is the
 * string 'Solar panel installer' on 608 of 643 rows (archetype/data.md), so
 * 608 profiles shipped a meta description that differed only in the place
 * name. installer-profile.md §7 asks for one built from facts that vary, and
 * this is it.
 *
 * What varies per row, in the order it is worth saying: where the business
 * is, the brands it fits (44 of 643 — rare, so it is the strongest signal
 * when present) and how many installations it has listed. Sentences are added
 * while they fit inside 160 characters, so a profile with only a location
 * still reads as a whole sentence rather than a truncated one.
 *
 * `serviceAreas` is deliberately NOT in it. It reads like per-installer
 * coverage and is not: `getServiceAreas` returns the cities of the
 * installer's DISTRICT, capped at 20, so every profile in Pune would claim
 * "covers 20 cities" — the same boilerplate this description exists to get
 * away from, with a LIMIT quoted as a fact on top.
 *
 * The canonical drops the SvelteKit trailing slash: this app serves
 * `/{cc}/installer/{slug}`, and `next.config.ts` redirects the slashed form.
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ country: string; installer_slug: string }>;
}): Promise<Metadata> {
  const { country, installer_slug } = await params;
  if (!isCountry(country)) return {};

  const { locale, installerNoun } = getCountry(country);
  const business = await getInstaller(country, installer_slug.toLowerCase());
  if (!business) return {};

  const { name, city, level2, level1, brands, projects } = business;
  const displayName = name.trim();

  // city and level2 are the same word on a district headquarters — "in Pune,
  // Pune, Maharashtra" is what the unfiltered join produces.
  const where = [city, level2, level1]
    .filter(Boolean)
    .filter((part, i, all) => all.findIndex((p) => p.toLowerCase() === part.toLowerCase()) === i)
    .join(', ');

  const brandNames = brands.map((id) => BRAND_NAMES[id]).filter(Boolean);

  const description = clampDescription([
    `${displayName} is a ${installerNoun} in ${where}.`,
    ...(brandNames.length > 0 ? [`Fits ${brandNames.slice(0, 2).join(' and ')}.`] : []),
    ...(projects.length > 0
      ? [`${projects.length} recent installation${projects.length === 1 ? '' : 's'} listed.`]
      : []),
    'Compare quotes on Solar Vipani.'
  ]);

  return pageMetadata({
    title: `${displayName} - Solar Installer in ${city}, ${level1}`,
    description,
    path: installerUrl(country, business.slug),
    locale,
    imageAlt: `${displayName}, ${installerNoun} in ${city}`,
    geo: { region: country.toUpperCase(), placename: `${city}, ${level1}` }
  });
}

export default async function Page({
  params
}: {
  params: Promise<{ country: string; installer_slug: string }>;
}) {
  const { country, installer_slug } = await params;

  if (!isCountry(country)) notFound();
  const { features, locale } = getCountry(country);

  const business = await getInstaller(country, installer_slug.toLowerCase());
  if (!business) notFound();

  const { name, slug, level1, level2, level1Slug, level2Slug, city, serviceAreas } = business;

  const displayName = name.trim();
  // The address where there is one, the geography where there is not. 19 of
  // 643 have no address, and it is never an identifier — 482 distinct values
  // across 643 rows — so this line is context, not a heading.
  const place = business.address?.trim() || [city, level2, level1].filter(Boolean).join(', ');
  const description = business.description?.trim();

  const serviceNames = business.services.map((id) => SERVICE_NAMES[id]).filter(Boolean);
  const brandNames = business.brands.map((id) => BRAND_NAMES[id]).filter(Boolean);

  // The district page, when the geo tables know this district. Used for the
  // breadcrumb and the back link, both of which are simply absent otherwise
  // rather than pointing at a URL that 404s.
  const districtUrl =
    level1Slug && level2Slug ? geoUrl(country, level1Slug, level2Slug) : undefined;

  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Solar', href: geoUrl(country) },
    ...(level1Slug ? [{ name: level1, href: geoUrl(country, level1Slug) }] : []),
    ...(districtUrl ? [{ name: level2, href: districtUrl }] : []),
    { name: displayName }
  ];

  return (
    <PageShell>
      <Section>
        <Stack gap="lg">
          <Breadcrumb trail={trail} />

          <div className="grid gap-xl lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="min-w-0">
              <Stack gap="2xl">
                <header>
                  {/* Rule 1: the name dominates by size, not by colour. It was
                      `text-primary-strong` at the same weight as five
                      subordinate h2s. Names run to 70 characters, so it wraps
                      to two lines and is never truncated. */}
                  <h1 className="max-w-prose text-2xl leading-tight">{displayName}</h1>

                  <p className="mt-sm flex items-start gap-xs text-ink-muted">
                    <MapPin aria-hidden className="mt-2xs size-4 shrink-0 text-ink-subtle" />
                    <span>{place}</span>
                  </p>

                  {description ? (
                    <p className="mt-md max-w-prose text-ink-muted">{description}</p>
                  ) : null}

                  {/* The phone-width copy of the action row. The contact panel
                      holds the desktop one; see its header for why both. */}
                  {business.phone ? (
                    <div className="mt-lg flex gap-xs lg:hidden">
                      <CallButton
                        phone={business.phone}
                        slug={business.slug}
                        city={business.city}
                        wide
                      />
                      <WhatsAppButton
                        phone={business.phone}
                        slug={business.slug}
                        city={business.city}
                        wide
                      />
                    </div>
                  ) : null}
                </header>

                {features.projects ? (
                  <InstallerProjects
                    projects={business.projects}
                    country={country}
                    name={displayName}
                    locale={locale}
                  />
                ) : null}

                {serviceNames.length > 0 || brandNames.length > 0 ? (
                  <section className="border-t border-line pt-lg">
                    <h2 className="text-xl">What they do</h2>
                    <dl className="mt-md grid gap-lg sm:grid-cols-2">
                      {serviceNames.length > 0 ? (
                        <div>
                          <dt className="text-2xs uppercase tracking-widest text-ink-subtle">
                            Services
                          </dt>
                          <dd className="mt-xs text-sm text-ink-muted">
                            {serviceNames.join(' · ')}
                          </dd>
                        </div>
                      ) : null}
                      {brandNames.length > 0 ? (
                        <div>
                          <dt className="text-2xs uppercase tracking-widest text-ink-subtle">
                            Panel brands installed
                          </dt>
                          <dd className="mt-xs text-sm text-ink-muted">{brandNames.join(' · ')}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </section>
                ) : null}

                {/* Section 8. The one chip row on this page that is genuinely
                    navigational — and deliberately NOT inside a <nav>: the
                    `nav a` rule in globals.css strips the underline, which is
                    exactly the signal that tells these apart from the static
                    labels above them (§6). */}
                {serviceAreas.length > 0 ? (
                  <section className="border-t border-line pt-lg">
                    <h2 className="text-xl">Where they work</h2>
                    <ul className="mt-md flex flex-wrap gap-x-md gap-y-xs">
                      {serviceAreas.map((area) => (
                        <li key={area.citySlug}>
                          <a
                            href={`${geoUrl(country, area.level1Slug, area.level2Slug, area.citySlug)}/`}
                            className="text-sm"
                          >
                            {area.city}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </Stack>
            </div>

            <aside>
              <ContactPanel business={business} />
            </aside>
          </div>
        </Stack>
      </Section>

      {/* Section 11. `cc === 'in'` in the original rather than a feature flag,
          and it stays so: /get-quotes is a single IN page, not a family. */}
      {country === 'in' ? (
        <Section>
          <QuoteCTA country={country} place={level2} />
        </Section>
      ) : null}

      {districtUrl ? (
        <Section>
          <BackLink href={`${districtUrl}/`} label={`All installers in ${level2}`} />
        </Section>
      ) : null}

      {/* §10. This is the archetype where LocalBusiness matters most — 649
          pages of it — and the two fixes available from data already loaded
          are both here: a real postal code, and no aggregateRating built from
          an rscore that is 0 on every row. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbLD(trail),
            localBusinessLD(
              {
                name: displayName,
                slug,
                address: business.address,
                city,
                state: level1,
                postalCode: business.postalCode,
                phone: business.phone
              },
              country
            )
          ])
        }}
      />
    </PageShell>
  );
}
