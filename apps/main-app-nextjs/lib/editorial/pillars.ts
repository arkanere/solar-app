/**
 * The seven editorial pillars: slug -> display name.
 *
 * This is all that comes across from `apps/main-app/src/lib/in/pillar-config.ts`.
 * That file is 181 lines because it also holds a hand-maintained whitelist of
 * every cluster slug under every pillar, and archetype/editorial.md §3
 * measured it against the table: 7 pillars, all 7 cluster lists, zero drift in
 * either direction. It only ever predicted the answer of a query that was
 * about to run anyway, and it had to be edited by hand whenever a row was
 * published. The query is now both the lookup and the whitelist — no row, no
 * page.
 *
 * The names are still here because they are the breadcrumb label, and nothing
 * in the row carries them: `seo_pages.h1` on a pillar is a headline ("Rooftop
 * Solar in India: Complete Guide…"), not a two-word crumb.
 *
 * `description` and `hasBrands` did not come across either: the first was
 * never rendered, and the second gated `resolveBrandSlug`, which cannot fire
 * while `solar_brands` is empty (§3).
 */
export const PILLARS = {
  'rooftop-solar': 'Rooftop Solar',
  'solar-panels': 'Solar Panels',
  'solar-inverters': 'Solar Inverters',
  'solar-pumps': 'Solar Pumps',
  'solar-installation': 'Solar Installation',
  'solar-subsidy': 'Solar Subsidy',
  'solar-financing': 'Solar Financing'
} as const;

export type PillarSlug = keyof typeof PILLARS;

export function pillarName(slug: PillarSlug): string {
  return PILLARS[slug];
}
