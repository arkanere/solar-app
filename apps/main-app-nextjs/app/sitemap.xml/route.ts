/**
 * The sitemap index — the one URL robots.txt declares.
 *
 * One child per country, plus the country-less content sitemap: the editorial
 * families, the tools and the legal pages carry no country prefix and would
 * otherwise be unlisted.
 *
 * A route rather than Next's `app/sitemap.ts` convention, because that
 * convention emits a `<urlset>` and this is a `<sitemapindex>`. The three
 * files also have to stay byte-comparable with the SvelteKit originals across
 * cutover, which a hand-written serializer makes checkable.
 *
 * This one touches no database. It is here rather than a static file only so
 * `lastmod` is today's date.
 */
import { COUNTRIES } from '@/lib/countries';
import { BASE_URL } from '@/lib/directory/structuredData';
import { sitemapIndexXml, today, xmlResponse } from '@/lib/sitemap';

/**
 * A day, matching the `max-age=86400` the SvelteKit endpoint sends. A
 * LITERAL, as every Route Segment Config in this app has to be — Next reads
 * it by static analysis without executing the file.
 */
export const revalidate = 86400;

export async function GET() {
  const locs = [
    ...Object.keys(COUNTRIES).map((code) => `${BASE_URL}/${code}/sitemap.xml`),
    `${BASE_URL}/content-sitemap.xml`
  ];
  return xmlResponse(sitemapIndexXml(locs, today()));
}
