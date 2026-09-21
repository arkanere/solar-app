/**
 * The two editorial routes, once.
 *
 * There are fourteen route files on this surface — a landing and a
 * `[slug]` under each of the seven pillars — and in the SvelteKit app they
 * are fourteen copies of the same loader with `const PILLAR` changed. The
 * pillar is the only thing that varies, so it is a parameter here and each
 * route file is six lines that name its own pillar.
 *
 * Next needs a real `page.tsx` per route, so the files cannot be collapsed
 * further than that; what they can do is hold no logic.
 *
 * Why not one `/[pillar]/[slug]` dynamic route instead: the seven pillars
 * are not the only children of the root — `/about-us`, `/tools`, `/seo-index`
 * and the rest of `(layout-1)` are siblings — and a `[pillar]` segment at the
 * root would sit in front of all of them.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/layout';
import { EditorialArticle } from '@/components/editorial';
import { getCountry } from '@/lib/countries';
import { contentUrl } from '@/lib/directory/urls';
import { pageMetadata, SITE_NAME } from '@/lib/metadata';
import { getCluster, getClusterLinks, getPillar, type Article } from './data';
import type { PillarSlug } from './pillars';

/** 15 days, matching `config.isr.expiration` on the SvelteKit loads. */
export const revalidate = 1296000;

/**
 * The editorial surface is `features.seoContentFamilies`, which is IN-only,
 * so the locale is India's and is not a parameter. The country-less URL is
 * the canonical (§9) and `contentUrl` is what produces it.
 */
const LOCALE = getCountry('in').locale;

/**
 * `meta_title` and `meta_description` go through unaltered — §10 item 6.
 * Both are past where Google truncates on every one of the 117 rows, and
 * that is content to fix in the CMS, not something for the render path to
 * paper over.
 *
 * The one thing done to the title is removing the site suffix, because all
 * 117 rows already carry " | Solar Vipani" and `pageMetadata` adds it. That
 * is not editing the copy: it is handing `pageMetadata` the title without
 * the part it owns, which is exactly the split lib/metadata.ts describes.
 */
function meta(article: Article, path: string): Metadata {
  return pageMetadata({
    title: article.metaTitle.replace(new RegExp(`\\s*\\|\\s*${SITE_NAME}\\s*$`), ''),
    description: article.metaDescription,
    path,
    locale: LOCALE,
    imageAlt: article.h1
  });
}

/** A pillar landing: `/rooftop-solar`. Seven of these. */
export function pillarRoute(pillar: PillarSlug) {
  const path = contentUrl(`/${pillar}`);

  async function generateMetadata(): Promise<Metadata> {
    const article = await getPillar(pillar);
    // No row, no page — the body below 404s on the same check, and metadata
    // for a page that will not render is the root layout's default.
    return article ? meta(article, path) : {};
  }

  async function Page() {
    const [article, clusters] = await Promise.all([getPillar(pillar), getClusterLinks(pillar)]);
    if (!article) notFound();

    return (
      <PageShell>
        <EditorialArticle article={article} pillar={pillar} clusters={clusters} variant="pillar" />
      </PageShell>
    );
  }

  return { generateMetadata, Page };
}

/**
 * A cluster article: `/rooftop-solar/1kw-system`. Seven of these, 110 pages.
 *
 * §3: there is no whitelist and no brand fallback. The query is the
 * whitelist — a slug with no published row under this pillar gets no row
 * back and the page 404s, which is the same answer `isClusterSlug` gave and
 * one file fewer to keep in step with the table.
 */
export function clusterRoute(pillar: PillarSlug) {
  type Params = { params: Promise<{ slug: string }> };

  /** Slugs are stored lowercase; a mixed-case URL should find the page. */
  const read = async (params: Params['params']) => {
    const { slug } = await params;
    return getCluster(pillar, slug.toLowerCase());
  };

  async function generateMetadata({ params }: Params): Promise<Metadata> {
    const article = await read(params);
    return article ? meta(article, contentUrl(`/${pillar}/${article.slug}`)) : {};
  }

  async function Page({ params }: Params) {
    const [article, clusters] = await Promise.all([read(params), getClusterLinks(pillar)]);
    if (!article) notFound();

    return (
      <PageShell>
        <EditorialArticle article={article} pillar={pillar} clusters={clusters} variant="cluster" />
      </PageShell>
    );
  }

  return { generateMetadata, Page };
}
