/**
 * The data seam for the editorial surface — archetype 4, 117 pages, one table.
 *
 * The same shape as lib/directory/data.ts and for the same reason: the pages
 * above this file do not know where the rows come from. Ported from the seven
 * pairs of `+page.server.ts` under `apps/main-app/src/routes/(layout-1)/`,
 * which are seven copies of the two loads below with a `const PILLAR` changed.
 *
 * Three things the port drops, all of them measured in archetype/editorial.md:
 *
 *  - **The cluster whitelist** (`isClusterSlug`). §3: it is a copy of the
 *    table with zero drift, and the query below is already the whitelist —
 *    a slug with no published row gets no row back and the page 404s.
 *  - **`resolveBrandSlug`**. §3: `solar_brands` has no rows, so the branch
 *    can never fire. It comes back as a second query behind the first
 *    `notFound()` when there is data to verify it against.
 *  - **The installer count** the pillar load ran for its stat chips. §4
 *    dropped the chips, so the query goes with them rather than being
 *    fetched and ignored.
 *
 * Every read filters `status = 'published'`, which is the single switch the
 * whole surface keys off: setting `solar-pumps/kusum-scheme` to `draft` took
 * it out of the pages, the sibling lists and the sitemap at once (§2).
 */
import { cache } from 'react';
import { and, asc, eq, isNull, sql } from 'drizzle-orm';
import { seoPages } from '@solar/db/schema';
import { db } from '@/lib/server/db';
import type { PillarSlug } from './pillars';

/** One `<h2>` and the HTML under it. Nine of these is a typical page. */
export type ContentSection = { heading: string; body: string };

/** One FAQ entry. Six of these is a typical page; one answer in 117 has HTML. */
export type FaqEntry = { question: string; answer: string };

/** A pillar or a cluster — §1: they are the same row and the same render. */
export type Article = {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  content: ContentSection[];
  faq: FaqEntry[];
};

/** A cluster as it appears in the link block on a pillar or a sibling. */
export type ClusterLink = { slug: string; name: string };

/**
 * `content` and `faq` are `jsonb`, which the introspected schema types as
 * `unknown`. The `sql` escape hatch re-states the shape without changing the
 * generated SQL — it renders as the bare column reference. Same trick, and
 * the same reason, as `$lib/server/seo.ts` in the SvelteKit app: annotating
 * schema.ts instead would not survive the next `drizzle-kit pull`.
 *
 * `faq` really is nullable, hence the `?? []` at every read below.
 */
const content = sql<ContentSection[]>`${seoPages.content}`;
const faq = sql<FaqEntry[] | null>`${seoPages.faq}`;

const ARTICLE = {
  slug: seoPages.slug,
  h1: seoPages.h1,
  metaTitle: seoPages.metaTitle,
  metaDescription: seoPages.metaDescription,
  content,
  faq
};

/**
 * A pillar row. `page_type = 'pillar'` rows carry a null `pillar_slug` — the
 * pillar is not its own parent — so the predicate is on the slug and the
 * type, not on the parent key.
 */
async function loadPillar(pillar: PillarSlug): Promise<Article | null> {
  const rows = await db
    .select(ARTICLE)
    .from(seoPages)
    .where(
      and(
        eq(seoPages.slug, pillar),
        eq(seoPages.pageType, 'pillar'),
        isNull(seoPages.pillarSlug),
        eq(seoPages.status, 'published')
      )
    )
    .limit(1);

  const row = rows[0];
  return row ? { ...row, faq: row.faq ?? [] } : null;
}

/**
 * A cluster row. The slug is lowercased by the caller, matching the SvelteKit
 * load: the table stores lowercase slugs and a mixed-case URL should find the
 * page rather than 404.
 *
 * `(slug, pillar_slug)` is the table's unique key, so this cannot match twice.
 */
async function loadCluster(pillar: PillarSlug, slug: string): Promise<Article | null> {
  const rows = await db
    .select(ARTICLE)
    .from(seoPages)
    .where(
      and(
        eq(seoPages.slug, slug),
        eq(seoPages.pillarSlug, pillar),
        eq(seoPages.pageType, 'cluster'),
        eq(seoPages.status, 'published')
      )
    )
    .limit(1);

  const row = rows[0];
  return row ? { ...row, faq: row.faq ?? [] } : null;
}

/**
 * Every published cluster under a pillar, for the link block — the pillar's
 * "Explore topics" and the cluster's "Related topics" are the same list (§8),
 * so they are the same query.
 *
 * Ordered by slug, as the SvelteKit loads are. Ordering by `h1` would read
 * better alphabetically but the h1s are headlines, not labels, so the sort
 * key would be "1kW Solar System for Home: Price…" — the same arbitrary order
 * with more work.
 */
async function loadClusterLinks(pillar: PillarSlug): Promise<ClusterLink[]> {
  return db
    .select({ slug: seoPages.slug, name: seoPages.h1 })
    .from(seoPages)
    .where(
      and(
        eq(seoPages.pillarSlug, pillar),
        eq(seoPages.pageType, 'cluster'),
        eq(seoPages.status, 'published')
      )
    )
    .orderBy(asc(seoPages.slug));
}

/**
 * Memoised per request, as the directory seam is: `generateMetadata` and the
 * page body both read the same row, and without this every editorial page
 * would run each query twice.
 */
export const getPillar = cache(loadPillar);
export const getCluster = cache(loadCluster);
export const getClusterLinks = cache(loadClusterLinks);

/* -------------------------------------------------------------------------
 * `/content-sitemap.xml`.
 *
 * Slugs and a date, for all 117 published rows at once. Not `ARTICLE`: that
 * selects two jsonb columns holding nine content sections and six FAQs per
 * row, none of which a sitemap prints.
 *
 * `updated_at` is the row's real lastmod, and it is formatted in SQL rather
 * than in JS. The schema types the timestamptz as `mode: 'string'`, so
 * Drizzle hands back a string that would otherwise be rendered in whatever
 * timezone the session happens to have — `AT TIME ZONE 'UTC'` pins it.
 *
 * A pillar row carries its own slug and leaves `pillarSlug` NULL; only
 * clusters populate it. Reading `pillarSlug` for a pillar is how the
 * SvelteKit version once emitted seven literal `.../null` URLs, which is why
 * `pageType` decides the path shape here rather than the presence of a value.
 *
 * Not wrapped in `cache()` — a route handler has no render pass to dedupe.
 * ------------------------------------------------------------------------- */

export type SitemapArticle = {
  slug: string;
  pillarSlug: string | null;
  isPillar: boolean;
  lastmod: string | null;
};

export async function listSitemapArticles(): Promise<SitemapArticle[]> {
  const rows = await db
    .select({
      slug: seoPages.slug,
      pillarSlug: seoPages.pillarSlug,
      pageType: seoPages.pageType,
      lastmod: sql<
        string | null
      >`to_char(${seoPages.updatedAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`
    })
    .from(seoPages)
    .where(eq(seoPages.status, 'published'))
    .orderBy(asc(seoPages.slug));

  return rows.map((r) => ({
    slug: r.slug,
    pillarSlug: r.pillarSlug,
    isPillar: r.pageType === 'pillar',
    lastmod: r.lastmod
  }));
}
