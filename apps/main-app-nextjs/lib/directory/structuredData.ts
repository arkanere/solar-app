/**
 * JSON-LD for the directory surface. geo-listing.md §10.
 *
 * Ported from apps/main-app/src/lib/seo.ts, trimmed to the three the district
 * page emits, plus the ItemList that page already built inline.
 *
 * One real fix in the port: `localBusinessLD` hardcoded
 * `addressCountry: 'IN'`, so every US installer was published to search
 * engines as an Indian business. It takes the country code now.
 *
 * Absolute URLs throughout, because structured data is consumed off-site and a
 * relative `item` is not resolvable once the document is detached from its
 * page. Everything else on the page links relatively.
 */
import { installerUrl } from './urls';
import type { FAQItem } from '@/lib/countries/faq';

export const BASE_URL = 'https://solarvipani.com';

/**
 * Takes the same trail the visible Breadcrumb renders — structurally the
 * `Crumb` it exports — so the two cannot disagree, which is the reason that
 * component takes hrefs rather than labels in the first place. The hrefs are
 * relative on the page and absolute here.
 */
export function breadcrumbLD(items: { name: string; href?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.href ? { item: `${BASE_URL}${item.href}` } : {})
    }))
  };
}

export function faqLD(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer }
    }))
  };
}

export function localBusinessLD(
  business: {
    name: string;
    slug: string;
    address: string | null;
    city: string;
    state: string;
    postalCode: string | null;
    phone: string | null;
  },
  country: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name.trim(),
    url: `${BASE_URL}${installerUrl(country, business.slug)}`,
    address: {
      '@type': 'PostalAddress',
      // Omitted rather than emitted empty. 19 of 643 businesses have no
      // address and pincode_mapping is IN-only, so a US page has no postal
      // code at all — `streetAddress: ''` is a claim that the street address
      // is the empty string, which is worse than not making the claim.
      ...(business.address?.trim() ? { streetAddress: business.address.trim() } : {}),
      addressLocality: business.city,
      addressRegion: business.state,
      ...(business.postalCode ? { postalCode: business.postalCode } : {}),
      addressCountry: country.toUpperCase()
    },
    ...(business.phone ? { telephone: business.phone } : {}),
    areaServed: { '@type': 'City', name: business.city }
  };
}

export function itemListLD(
  name: string,
  items: { slug: string; name: string }[],
  country: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}${installerUrl(country, b.slug)}`,
      name: b.name.trim()
    }))
  };
}
