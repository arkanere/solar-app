/**
 * Service id → label. A lookup table, not fixture data: business_profiles
 * stores these as integers and every surface that renders a business needs the
 * same names, so it lives here rather than beside the sample rows.
 */
export const SERVICE_NAMES: Record<number, string> = {
  1: 'Panel installation',
  2: 'Net metering',
  3: 'Subsidy paperwork',
  4: 'Financing',
  5: 'Panel cleaning',
  6: 'Agricultural solar'
};
