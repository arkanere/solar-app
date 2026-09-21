/**
 * robots.txt, from apps/main-app/static/robots.txt.
 *
 * A route rather than a file in public/ so the sitemap URL is built from
 * BASE_URL — the same constant the canonicals and the OG image use — instead
 * of a second hardcoded origin that can drift from them.
 *
 * The three disallowed prefixes are the original's. `/admin/` and
 * `/dashboard/` do not exist in this app at all; they stay because the rule
 * is about the domain, which the other apps also answer on.
 *
 * Only /sitemap.xml is declared. It is the index: content-sitemap.xml and the
 * per-country sitemaps are listed inside it, and declaring a child sitemap
 * twice is how a crawler ends up reporting one as orphaned.
 */
import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/directory/structuredData';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: ['/admin/', '/api/', '/dashboard/']
    },
    sitemap: `${BASE_URL}/sitemap.xml`
  };
}
