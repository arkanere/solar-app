/**
 * The one page-metadata builder.
 *
 * Nothing in this app emitted a title, description, canonical or OG tag until
 * now — not even the district page at sitemap priority 1.0. The gap was left
 * open deliberately rather than closed one page at a time, because the
 * SvelteKit heads it is ported from had drifted: the district and leaf pages
 * emit fourteen tags, the country and state hubs emit three, and the
 * installer profile three different ones. Every page here emits the same set.
 *
 * The split is shape vs copy. This file owns the shape — which tags exist,
 * how the title is suffixed, where the canonical points — and each page owns
 * its own title and description, because those are page copy and there is no
 * way to generate them from a route.
 *
 * Two things the port changes on purpose:
 *
 *  - **The canonical has no trailing slash.** The SvelteKit installer page
 *    emits `/{cc}/installer/{slug}/`, which is not the URL this app serves:
 *    `next.config.ts` sets `trailingSlash: false`. A canonical pointing at a
 *    URL that 308s is worse than none.
 *  - **The installer description is not the SvelteKit one.** See
 *    installer-profile.md §7 — it interpolated `description`, which is the
 *    string 'Solar panel installer' on 608 of 643 rows, so 608 profiles
 *    shipped near-identical meta descriptions. That page builds its own from
 *    facts that vary per row.
 *
 * `metadataBase` is set in app/layout.tsx, which is what lets `path` be a
 * relative string here and still render absolute in `og:url` and the
 * canonical link. The OG image is already absolute, from BASE_URL.
 */
import type { Metadata } from 'next';
import { BASE_URL } from '@/lib/directory/structuredData';

export const SITE_NAME = 'Solar Vipani';

/**
 * The same logo the live site puts on every share card. It is 1107x955 — a
 * logo, not a 1200x630 card — and stays so: replacing it is a design decision
 * about the whole site, not part of wiring the tags up.
 *
 * Exported because the root layout needs the same card for the pages that
 * have no metadata of their own.
 */
export const OG_IMAGE = {
  url: `${BASE_URL}/logo.webp`,
  width: 1107,
  height: 955
};

export type PageMetaInput = {
  /** Without the site suffix — this adds it, to `<title>`, `og` and `twitter` alike. */
  title: string;
  description: string;
  /** Canonical path, origin-relative and with no trailing slash: `/in/solar/maharashtra`. */
  path: string;
  /** `CountryConfig.locale`, e.g. 'en-IN'. Rendered as `en_IN`. */
  locale: string;
  /** `og:image:alt`. Required: an image with no alt text is the one case worth failing on. */
  imageAlt: string;
  /**
   * `geo.region` / `geo.placename`, for the pages that are about one place.
   * The two hubs pass nothing — a country or a state is a region, not a
   * placename, and the SvelteKit hubs emit neither.
   */
  geo?: { region: string; placename: string };
};

export function pageMetadata({
  title,
  description,
  path,
  locale,
  imageAlt,
  geo
}: PageMetaInput): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const images = [{ ...OG_IMAGE, alt: imageAlt }];

  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      type: 'website',
      url: path,
      siteName: SITE_NAME,
      locale: locale.replace('-', '_'),
      images
    },
    twitter: {
      card: 'summary_large_image',
      site: '@solarvipani',
      title: fullTitle,
      description,
      images
    },
    ...(geo
      ? { other: { 'geo.region': geo.region, 'geo.placename': geo.placename } }
      : {})
  };
}

/**
 * "1 district", "33 districts" — and the count grouped through the locale,
 * as the pages group theirs.
 *
 * The SvelteKit heads interpolate every count into a fixed plural, so
 * /us/solar/california ships "Find 1 verified solar installers across 1
 * counties in California". Five counties and 25 districts are at a count of
 * one today, and a meta description is the copy that reaches the search
 * result, so it is fixed here rather than carried across.
 */
export function pluralise(n: number, singular: string, plural: string, locale?: string): string {
  return `${n.toLocaleString(locale)} ${n === 1 ? singular : plural}`;
}

/**
 * Meta descriptions are truncated by the engine at around 160 characters, so
 * a page that builds one from parts clips to the last whole sentence that
 * fits rather than letting the clip land mid-word.
 */
export function clampDescription(sentences: string[], limit = 160): string {
  let out = '';
  for (const sentence of sentences) {
    const next = out ? `${out} ${sentence}` : sentence;
    if (next.length > limit) break;
    out = next;
  }
  // The first sentence alone can exceed the limit — a 70-character business
  // name in a 90-character sentence. Better long than empty.
  return out || (sentences[0] ?? '');
}
