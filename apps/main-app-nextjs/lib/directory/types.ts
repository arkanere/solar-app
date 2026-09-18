/**
 * The shapes the directory surface renders. Deliberately separate from where
 * the data comes from: today `lib/directory/data.ts` fills these from the
 * specimen fixtures, next it fills them from Drizzle, and no component has to
 * change when that happens.
 *
 * Nullability here is the real nullability from archetype/data.md, not the
 * tidied-up version. 19 of 643 businesses have no address and 11 have no phone,
 * and both CTAs depend on the phone — so `null` is a case the row has to render,
 * not an edge case to assume away. The SvelteKit app hid this behind the old
 * driver's `any`; CLAUDE.md warns that restating a contract the schema does not
 * guarantee is how that bites.
 */

export type InstallerRowData = {
  name: string;
  slug: string;
  /** Missing on 19 of 643. Location context, not an identifier. */
  address: string | null;
  city: string;
  /** Missing on 11 of 643. Both CTAs depend on it. */
  phone: string | null;
  services: number[];
  /** Recent project count. The metric slot rscore will occupy — see geo-listing.md §3. */
  projects: number;
  /** Newest project photograph. ~6% of rows have one. */
  thumb: string | null;
};

export type CityLink = {
  name: string;
  slug: string;
  /** Whether the city has its own page. p50 across district pages is 1 of 9. */
  linked: boolean;
};

/**
 * One tile in the district's project gallery (geo-listing.md §5 section 9).
 *
 * `businessSlug` is the only name the gallery has for the installer — the old
 * card title-cases the slug rather than joining to business_profiles, and that
 * is carried across rather than widened, because the join would cost a query
 * to render a name the row beneath it already shows.
 *
 * Both image fields are nullable and a project can have neither: `imageUrl` is
 * the pre-Cloudinary path and `cloudinaryPublicId` the current one, so a tile
 * prefers the second, falls back to the first, and has a no-image state.
 */
export type ProjectCard = {
  id: number;
  slug: string;
  businessSlug: string;
  title: string;
  /** NOT NULL in the schema — every project has one. */
  pincode: string;
  /** NOT NULL in the schema. A date column, so a 'YYYY-MM-DD' string. */
  projectDate: string;
  cloudinaryPublicId: string | null;
  imageUrl: string | null;
};

export type DistrictPageData = {
  country: string;
  level1: string;
  level1Slug: string;
  level2: string;
  level2Slug: string;
  installers: InstallerRowData[];
  cities: CityLink[];
  /** Up to 6, newest first. Empty where `features.projects` is off. */
  projects: ProjectCard[];
  /**
   * Leads from this district, for the social-proof line. Shown only at 3 or
   * more — geo-listing.md §8 keeps that floor, and it silences the line on
   * 113 of 221 pages.
   */
  leadCount: number;
  /**
   * One postal code in the district, for LocalBusiness structured data. Null
   * where `features.pincodeLookup` is off, which is every US page —
   * pincode_mapping is IN-only.
   */
  postalCode: string | null;
};

/**
 * The leaf page under a district: `/{cc}/solar/{state}/{district}/{slug}`.
 * 356 pages. geo-listing.md §4.
 *
 * The route is **polymorphic** — one slug resolves against three things, in
 * order: a city in `geo_locations`, a brand in `solar_brands`, then the
 * `{n}kw-solar-system` pattern. Brand and size are gated on
 * `features.seoContentFamilies`, so a US slug can only ever be a city.
 *
 * This is a discriminated union rather than a city shape with two flags
 * bolted on, which is what §4 asks for: brand is a known future requirement,
 * and a page that dispatches on `kind` gains it as a case instead of a
 * rewrite.
 *
 * `missing` and `redirect` are results, not page shapes, because the two
 * failure modes here are different and both are load-time decisions:
 *
 *  - `missing` → 404. The slug resolved to nothing.
 *  - `redirect` → **301 to the district**. The city exists but has no
 *    installers of its own, and the district is the canonical listing. This is
 *    the opposite of the district page, which 404s when empty (§4). The
 *    asymmetry is deliberate and it is what keeps thin pages out of the index.
 */
export type LeafLoad =
  | { kind: 'missing' }
  | { kind: 'redirect' }
  | ({ kind: 'city' } & LeafCommon & CityLeaf)
  // `brand` goes here. It resolves against `solar_brands`, which is empty on
  // live — the table is a provision, so no brand page is reachable today and
  // none is designed. Adding it is a case in this union and a branch in the
  // page, not a change to either.
  | ({ kind: 'size' } & LeafCommon & SizeLeaf);

/** Shared by every leaf variant: where the page sits. */
export type LeafCommon = {
  country: string;
  level1: string;
  level1Slug: string;
  level2: string;
  level2Slug: string;
  installers: InstallerRowData[];
  /** For LocalBusiness structured data. Null where `features.pincodeLookup` is off. */
  postalCode: string | null;
};

export type CityLeaf = {
  city: string;
  citySlug: string;
  /** Up to 6, newest first. Empty where `features.projects` is off. */
  projects: ProjectCard[];
  /**
   * Up to 5 other cities in the district that have installers — so every chip
   * is a link. The district's own chip row solves the same problem by
   * filtering (§6); here the query only ever returns cities with businesses,
   * so there is nothing to filter.
   */
  siblingCities: { name: string; slug: string }[];
};

export type SizeLeaf = {
  /** 1, 2, 3, 5 or 10 in practice — the sizes the chip rows link to. */
  sizeKw: number;
};

/**
 * One city an installer covers — a chip on the profile linking to the city
 * leaf. Up to 20 per page (installer-profile.md §3 section 8).
 *
 * The slugs come from `geo_locations` rather than being derived from the city
 * name, so every link points at a leaf that exists. The same rows also carry
 * the district's own slugs, which is what the profile's back link uses.
 */
export type ServiceArea = {
  city: string;
  level1Slug: string;
  level2Slug: string;
  citySlug: string;
};

/**
 * Archetype 1 — one installer profile. 649 pages, 46% of the site.
 * installer-profile.md §8.
 *
 * What the SvelteKit loader selects and this does NOT:
 *
 *  - `tag`, `'Verified Business'` on 100% of visible profiles. The badge is
 *    dropped (§5) and nothing else reads the column, so it is not selected.
 *  - `rscore`, uniformly 0. It orders the query — a stable choice among
 *    duplicate slugs — but no component can render it and §10 is explicit
 *    that an aggregateRating must not be built from it while it is flat.
 *  - `businessfilled`, which the page selects and never reads.
 *
 * Nullability is the real nullability from archetype/data.md: 280 of 643 have
 * no website, 19 no address, 11 no phone — and the phone is what both CTAs
 * depend on, so `null` is a case the page renders rather than an edge case.
 */
export type InstallerProfile = {
  country: string;
  name: string;
  slug: string;
  /** Boilerplate on 94.6% of pages. Rendered anyway — decided 2026-09-18. */
  description: string | null;
  /** Missing on 11 of 643. Both CTAs depend on it. */
  phone: string | null;
  email: string | null;
  /** Missing on 280 of 643. Must not anchor a layout. */
  website: string | null;
  /** Missing on 19 of 643, and 482 distinct across 643 — not an identifier. */
  address: string | null;
  city: string;
  level2: string;
  level1: string;
  /** The district's slug, for the back link. Null when no geo row matches. */
  level2Slug: string | null;
  level1Slug: string | null;
  /** From business_profiles.postal_code, for LocalBusiness (§10). */
  postalCode: string | null;
  services: number[];
  /** Empty on 93% of profiles. A real differentiator on the other 44. */
  brands: number[];
  /** Raw column value; `instagram()` in urls.ts turns it into a link. */
  instagramId: string | null;
  /** Raw column value; `mapsUrl()` in urls.ts turns it into a link. */
  googleMapsLink: string | null;
  /** Up to 12, newest first. Only 5.9% of profiles have any. */
  projects: ProjectCard[];
  serviceAreas: ServiceArea[];
};
