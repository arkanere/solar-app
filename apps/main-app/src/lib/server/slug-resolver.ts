import type { Pool } from '@vercel/postgres';

interface ResolveResult {
	type: string;
	data: Record<string, unknown>;
}

export async function resolveSubsidySlug(
	pool: Pool,
	slug: string
): Promise<ResolveResult | null> {
	const stateResult = await pool.query(
		'SELECT state_slug, state_name FROM state_subsidies WHERE state_slug = $1 AND status = $2',
		[slug, 'published']
	);
	if (stateResult.rows.length > 0) {
		return { type: 'state', data: stateResult.rows[0] };
	}

	const discomResult = await pool.query(
		'SELECT d.slug, d.name, d.state_slug FROM discoms d WHERE d.slug = $1 AND d.status = $2',
		[slug, 'published']
	);
	if (discomResult.rows.length > 0) {
		return { type: 'discom', data: discomResult.rows[0] };
	}

	return null;
}

export async function resolveBrandSlug(
	pool: Pool,
	slug: string,
	category: string
): Promise<ResolveResult | null> {
	const result = await pool.query(
		'SELECT slug, name, product_category FROM solar_brands WHERE slug = $1 AND product_category = $2 AND status != $3',
		[slug, category, 'draft']
	);
	if (result.rows.length > 0) {
		return { type: 'brand', data: result.rows[0] };
	}
	return null;
}

export async function resolveGeoSlug(
	pool: Pool,
	slug: string,
	state: string,
	district: string
): Promise<ResolveResult | null> {
	const cityResult = await pool.query(
		`SELECT l.city, l.district, l.state FROM locations l
		 WHERE LOWER(REPLACE(l.city, ' ', '-')) = LOWER($1)
		   AND LOWER(REPLACE(l.district, ' ', '-')) = LOWER($2)
		   AND LOWER(REPLACE(l.state, ' ', '-')) = LOWER($3)
		 LIMIT 1`,
		[slug, district, state]
	);
	if (cityResult.rows.length > 0) {
		return { type: 'city', data: cityResult.rows[0] };
	}

	const brandResult = await pool.query(
		'SELECT slug, name, product_category FROM solar_brands WHERE slug = $1 AND status != $2 LIMIT 1',
		[slug, 'draft']
	);
	if (brandResult.rows.length > 0) {
		return { type: 'brand', data: brandResult.rows[0] };
	}

	const sizeMatch = slug.match(/^(\d+)kw-solar-system$/);
	if (sizeMatch) {
		return { type: 'size', data: { sizeKw: parseInt(sizeMatch[1], 10), slug } };
	}

	return null;
}
