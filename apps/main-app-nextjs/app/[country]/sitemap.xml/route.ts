/**
 * A country's sitemap — its static pages, its visible installers, and the geo
 * levels that have at least one visible installer in them. ~1,240 URLs for IN,
 * ~46 for US.
 *
 * Four sections, in this order and at these priorities: they are what the live
 * sitemap advertises, and a cutover that reshuffles them is a change search
 * engines see. lib/sitemap.ts's header says the same about the static block.
 *
 * `isCountry` before `getCountry`: the param arrives as a string and
 * `getCountry` throws on an unknown code, which would be a 500 where a 404 is
 * the answer. middleware.ts already rejects unknown two-letter prefixes, but a
 * handler that relies on middleware for its own safety is one config edit away
 * from a crash — the same reasoning the district page's header records.
 */
import { notFound } from 'next/navigation';
import { getCountry, isCountry } from '@/lib/countries';
import { listSitemapGeo } from '@/lib/directory/data';
import { BASE_URL } from '@/lib/directory/structuredData';
import { geoUrl, installerUrl } from '@/lib/directory/urls';
import { countryStaticPages, today, urlsetXml, xmlResponse } from '@/lib/sitemap';
import type { SitemapEntry } from '@/lib/sitemap';

/**
 * A day, matching the `max-age=86400` the SvelteKit endpoint sends. A
 * LITERAL, as every Route Segment Config in this app has to be.
 *
 * This is the file that changes when an installer lands or a profile is
 * hidden — a day is how long a new installer waits to be advertised, against
 * four correlated-subquery scans per rebuild.
 */
export const revalidate = 86400;

/**
 * Empty on purpose, and this is what turns ISR on: `revalidate` alone does
 * nothing on a route with a dynamic segment. Returning the two real country
 * codes instead would prerender both at build time, which runs four geo
 * queries during `next build` — the database-free build is the thing the
 * empty return buys. See "ISR needs `generateStaticParams` too" in the README.
 */
export async function generateStaticParams() {
  return [];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ country: string }> }
) {
  const { country } = await params;
  if (!isCountry(country)) notFound();

  const now = today();
  const config = getCountry(country);
  const entries: SitemapEntry[] = countryStaticPages(config, now);
  const geo = await listSitemapGeo(country);

  // Installers — 0.8
  for (const slug of geo.installers) {
    entries.push({
      loc: `${BASE_URL}${installerUrl(country, slug)}`,
      lastmod: now,
      changefreq: 'monthly',
      priority: '0.8'
    });
  }

  // State hubs — 0.9
  for (const row of geo.level1) {
    entries.push({
      loc: `${BASE_URL}${geoUrl(country, row.level1Slug)}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.9'
    });
  }

  // District/county pillars — 1.0
  for (const row of geo.level2) {
    entries.push({
      loc: `${BASE_URL}${geoUrl(country, row.level1Slug, row.level2Slug)}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '1.0'
    });
  }

  // City leaves — 0.7
  for (const row of geo.cities) {
    entries.push({
      loc: `${BASE_URL}${geoUrl(country, row.level1Slug, row.level2Slug, row.citySlug)}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.7'
    });
  }

  return xmlResponse(urlsetXml(entries));
}
