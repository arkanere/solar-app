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

export type DistrictPageData = {
  country: string;
  level1: string;
  level1Slug: string;
  level2: string;
  level2Slug: string;
  installers: InstallerRowData[];
  cities: CityLink[];
};
