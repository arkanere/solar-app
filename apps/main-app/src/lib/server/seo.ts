// Drizzle selection maps for the SEO content families (pillar / cluster pages,
// brands, products).
//
// The keys are snake_case on purpose: these page loads return the rows straight
// to the client, so the wire shape is the table's column names. A bare
// `.select()` would silently switch them to Drizzle's camelCase properties and
// break every consumer.

import { sql } from 'drizzle-orm';
import { seoPages, solarBrands, solarProducts } from '@solar/db/schema';

export type ContentSection = { heading: string; body: string };
export type FaqItem = { question: string; answer: string };

// The `content`/`faq` jsonb columns are typed `unknown` by the introspected
// schema. The raw driver used to hand these to the page components as `any`;
// the `sql` escape hatch below re-states the shape the components declare
// without changing the generated SQL (it renders as the bare column
// reference). Annotating in schema.ts instead would not survive the next
// `drizzle-kit pull`.
const seoContent = sql<ContentSection[]>`${seoPages.content}`;
// `faq` really is nullable, and every consumer already guards with `?? []`,
// so the honest type costs nothing at the call sites.
const seoFaq = sql<FaqItem[] | null>`${seoPages.faq}`;

/** Pillar page body — `seo_pages` row for the pillar slug itself. */
export const SEO_PILLAR_SELECTION = {
	h1: seoPages.h1,
	meta_title: seoPages.metaTitle,
	meta_description: seoPages.metaDescription,
	content: seoContent,
	faq: seoFaq
};

/** Cluster link list shown on a pillar page (`h1 as name`). */
export const SEO_CLUSTER_LINK_SELECTION = {
	slug: seoPages.slug,
	name: seoPages.h1
};

/** Full cluster page body. */
export const SEO_CLUSTER_SELECTION = {
	slug: seoPages.slug,
	h1: seoPages.h1,
	meta_title: seoPages.metaTitle,
	meta_description: seoPages.metaDescription,
	content: seoContent,
	faq: seoFaq
};

/** Brand landing page body. */
export const BRAND_SELECTION = {
	slug: solarBrands.slug,
	name: solarBrands.name,
	description: solarBrands.description,
	logo_url: solarBrands.logoUrl,
	meta_title: solarBrands.metaTitle,
	meta_description: solarBrands.metaDescription,
	faq: sql<FaqItem[] | null>`${solarBrands.faq}`
};

/** Product card in a brand's product list. */
export const PRODUCT_CARD_SELECTION = {
	model_slug: solarProducts.modelSlug,
	name: solarProducts.name,
	price_range_min: solarProducts.priceRangeMin,
	price_range_max: solarProducts.priceRangeMax
};

/** Full product detail page body. */
export const PRODUCT_SELECTION = {
	name: solarProducts.name,
	model_slug: solarProducts.modelSlug,
	specs: sql<Record<string, string>>`${solarProducts.specs}`,
	price_range_min: solarProducts.priceRangeMin,
	price_range_max: solarProducts.priceRangeMax,
	datasheet_url: solarProducts.datasheetUrl
};
