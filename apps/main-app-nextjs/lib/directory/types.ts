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
