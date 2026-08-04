import { db } from './db';
import { discoms, solarBrands, stateSubsidies } from '@solar/db/schema';
import { and, eq, ne } from 'drizzle-orm';
import type { CountryConfig } from '$lib/countries';
import { resolveCity } from './geo';

interface ResolveResult {
	type: string;
	data: Record<string, unknown>;
}

export async function resolveSubsidySlug(slug: string): Promise<ResolveResult | null> {
	const stateRows = await db
		.select({
			state_slug: stateSubsidies.stateSlug,
			state_name: stateSubsidies.stateName
		})
		.from(stateSubsidies)
		.where(and(eq(stateSubsidies.stateSlug, slug), eq(stateSubsidies.status, 'published')));
	if (stateRows.length > 0) {
		return { type: 'state', data: stateRows[0] };
	}

	const discomRows = await db
		.select({
			slug: discoms.slug,
			name: discoms.name,
			state_slug: discoms.stateSlug
		})
		.from(discoms)
		.where(and(eq(discoms.slug, slug), eq(discoms.status, 'published')));
	if (discomRows.length > 0) {
		return { type: 'discom', data: discomRows[0] };
	}

	return null;
}

export async function resolveBrandSlug(
	slug: string,
	category: string
): Promise<ResolveResult | null> {
	const rows = await db
		.select({
			slug: solarBrands.slug,
			name: solarBrands.name,
			product_category: solarBrands.productCategory
		})
		.from(solarBrands)
		.where(
			and(
				eq(solarBrands.slug, slug),
				eq(solarBrands.productCategory, category),
				ne(solarBrands.status, 'draft')
			)
		);
	if (rows.length > 0) {
		return { type: 'brand', data: rows[0] };
	}
	return null;
}

// Country-aware leaf resolver for /{country}/solar/{state}/{level2}/{slug}.
// The slug is normally a city; the brand and system-size fallbacks are
// IN-only SEO content families and are gated on the country's feature flag
// so e.g. a US city slug can never resolve to a brand page.
export async function resolveLeafSlug(
	country: CountryConfig,
	slug: string,
	level1Slug: string,
	level2Slug: string
): Promise<ResolveResult | null> {
	const city = await resolveCity(country.code, level1Slug, level2Slug, slug);
	if (city) {
		return {
			type: 'city',
			data: { city: city.city, district: city.level2, state: city.level1, geo: city }
		};
	}

	if (!country.features.seoContentFamilies) {
		return null;
	}

	const brandRows = await db
		.select({
			slug: solarBrands.slug,
			name: solarBrands.name,
			product_category: solarBrands.productCategory
		})
		.from(solarBrands)
		.where(and(eq(solarBrands.slug, slug), ne(solarBrands.status, 'draft')))
		.limit(1);
	if (brandRows.length > 0) {
		return { type: 'brand', data: brandRows[0] };
	}

	const sizeMatch = slug.match(/^(\d+)kw-solar-system$/);
	if (sizeMatch) {
		return { type: 'size', data: { sizeKw: parseInt(sizeMatch[1], 10), slug } };
	}

	return null;
}
