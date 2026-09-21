/**
 * The sitemap seam — the XML, and the URLs that have no database row.
 *
 * Ported from apps/main-app/src/lib/server/sitemap.ts, which held both the
 * serializer and the queries. Here the queries stay where every other query
 * lives: `listSitemapGeo` in lib/directory/data.ts, `listSitemapArticles` in
 * lib/editorial/data.ts. This file has no database import at all, which is
 * what lets the three route handlers share it without sharing a seam.
 *
 * Section order and priorities are load-bearing. They are the values the live
 * sitemaps have advertised since stage 13, and a cutover that reshuffles them
 * is a change search engines see. Do not reorder or retune casually.
 *
 * Every loc is written WITHOUT a trailing slash: a trailing slash costs a
 * normalization redirect, and a sitemap must not list a URL that 301s.
 *
 * WHAT THIS PORT DROPS, and why (decided 2026-09-21):
 *
 *  - `/seo-index`. Retired, not ported — routes.md line 43.
 *  - **brand, state-subsidy, discom, financing-bank and author URLs.** The
 *    SvelteKit content sitemap runs five more queries for them. In this app
 *    `/solar-panels/{slug}`, `/solar-subsidy/{slug}` and `/solar-financing/{slug}`
 *    are editorial cluster routes only — the brand, subsidy, discom and bank
 *    variants were never ported — and `/authors/{slug}` is still a stub. All
 *    five tables hold 0 rows today, so the emitted XML is byte-identical
 *    either way; the difference is that this version cannot start advertising
 *    404s the day a row lands. Each family comes back with the route that
 *    serves it. README **Blocked on data, not code** tracks the five tables.
 *
 * The homepage is listed once here rather than once per country: `/{c}` has
 * 301'd to `/` since the homepages merged.
 */
import type { CountryConfig } from '@/lib/countries';
import { BASE_URL } from '@/lib/directory/structuredData';

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

/** Today, UTC, as YYYY-MM-DD — the lastmod for anything with no row date. */
export function today(): string {
  return new Date().toISOString().split('T')[0];
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** A `<urlset>` document. The shape both leaf sitemaps return. */
export function urlsetXml(entries: SitemapEntry[]): string {
  const parts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ];
  for (const e of entries) {
    parts.push(
      `  <url>\n    <loc>${escapeXml(e.loc)}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
    );
  }
  parts.push('</urlset>');
  return parts.join('\n');
}

/** A `<sitemapindex>` document. Only /sitemap.xml returns one. */
export function sitemapIndexXml(locs: string[], lastmod: string): string {
  const children = locs
    .map((loc) => `  <sitemap>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${children}\n</sitemapindex>`;
}

export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}

/**
 * The per-country pages with no row of their own.
 *
 * No `/{c}` entry — it 301s to `/`. The projects page is gated for the same
 * reason its route is: with `features.projects` false the page 404s, so
 * advertising it is a dead URL.
 *
 * `/{c}/business-listing` is a stub today; README next step 2 builds it. It
 * stays listed because the URL is right and the step lands next.
 */
export function countryStaticPages(country: CountryConfig, lastmod: string): SitemapEntry[] {
  const c = country.code;
  const pages: SitemapEntry[] = [
    { loc: `${BASE_URL}/${c}/solar`, lastmod, changefreq: 'weekly', priority: '1.0' },
    { loc: `${BASE_URL}/${c}/business-listing`, lastmod, changefreq: 'monthly', priority: '0.8' },
    { loc: `${BASE_URL}/${c}/business-form`, lastmod, changefreq: 'monthly', priority: '0.8' }
  ];
  if (country.features.projects) {
    pages.push({
      loc: `${BASE_URL}/${c}/recent-solar-installation-projects`,
      lastmod,
      changefreq: 'monthly',
      priority: '0.8'
    });
  }
  return pages;
}

/**
 * The country-less pages with no row of their own. Same order and priorities
 * they carried under `/{c}/` before the content families moved to the root.
 */
export function contentStaticPages(lastmod: string): SitemapEntry[] {
  const at = (path: string, priority: string, changefreq = 'monthly'): SitemapEntry => ({
    loc: `${BASE_URL}${path}`,
    lastmod,
    changefreq,
    priority
  });
  return [
    at('/', '1.0', 'weekly'),
    at('/about-us', '0.8'),
    at('/terms-of-use', '0.8'),
    at('/privacy-policy', '0.8'),
    at('/data-deletion', '0.8'),
    at('/data-access', '0.5'),
    at('/write-for-us', '0.5'),
    at('/tools', '0.8'),
    at('/tools/solar-calculator', '0.7'),
    at('/tools/emi-calculator', '0.7'),
    at('/tools/subsidy-checker', '0.7')
  ];
}
