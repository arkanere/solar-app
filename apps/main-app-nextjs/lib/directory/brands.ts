/**
 * Panel-brand id → label. The companion to services.ts, and here for the same
 * reason: `business_profiles.brands` is an integer array with no lookup table
 * in Postgres, so the names live in code and every surface that renders a
 * business needs the same ones.
 *
 * DECIDED (installer-profile.md §12 q3): a constants module, not a table. A
 * table would be the right answer if these were editable or if anything
 * joined on them; seven names that change when a manufacturer is added are
 * cheaper here, and the business form will import this same file rather than
 * keep its own copy — which is what the SvelteKit app did, inside a component.
 *
 * Ids not in this map render as nothing rather than 'Unknown Brand'. The
 * original printed the word Unknown into the page; a brand the site cannot
 * name is not information a reader can use.
 */
export const BRAND_NAMES: Record<number, string> = {
  1: 'Waaree Energies',
  2: 'Adani Solar',
  3: 'Tata Power Solar',
  4: 'Vikram Solar',
  5: 'Goldi Solar',
  6: 'RenewSys',
  7: 'Loom Solar'
};
