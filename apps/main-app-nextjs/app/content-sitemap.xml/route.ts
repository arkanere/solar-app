/**
 * The country-less content sitemap — the 7 editorial pillars and their 110
 * clusters, the tools and the legal pages. These families left the country
 * prefix when the content moved to the root, so they belong to no country
 * sitemap; the per-country files keep geo, installers and the genuinely
 * per-country static pages. Both are listed by /sitemap.xml.
 *
 * There is deliberately no CountryConfig and no feature flag here. The flags
 * (`seoContentFamilies`, `subsidy`, `financing`, `authors`) still gate nav
 * links and the slug resolver, but the content itself now exists exactly once
 * at the root, so gating it per country would list it twice or not at all.
 *
 * What this file does NOT list, and why, is in lib/sitemap.ts's header.
 */
import { listSitemapArticles } from '@/lib/editorial/data';
import { BASE_URL } from '@/lib/directory/structuredData';
import { contentStaticPages, today, urlsetXml, xmlResponse } from '@/lib/sitemap';
import type { SitemapEntry } from '@/lib/sitemap';

/**
 * A day, matching the `max-age=86400` the SvelteKit endpoint sends. A
 * LITERAL, as every Route Segment Config in this app has to be.
 *
 * The CMS publishes into `seo_pages` rarely, so a shorter window would be
 * re-running 117 rows to emit the same bytes. A day is the longest a newly
 * published article waits to be advertised.
 */
export const revalidate = 86400;

export async function GET() {
  const now = today();
  const entries: SitemapEntry[] = contentStaticPages(now);

  for (const row of await listSitemapArticles()) {
    const path = row.isPillar ? `/${row.slug}` : `/${row.pillarSlug}/${row.slug}`;
    // A cluster with a NULL pillarSlug would render ".../null" — a 404
    // advertised as a page. Skip rather than emit it.
    if (path.includes('/null')) continue;
    entries.push({
      loc: `${BASE_URL}${path}`,
      lastmod: row.lastmod ?? now,
      changefreq: 'weekly',
      priority: row.isPillar ? '0.9' : '0.8'
    });
  }

  return xmlResponse(urlsetXml(entries));
}
