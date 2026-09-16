/**
 * Per-country configuration. The abstraction that resolves terminology
 * differences (district vs county, PIN vs ZIP) so routes, components and
 * queries stay country-agnostic.
 *
 * Ported verbatim from apps/main-app/src/lib/countries/types.ts. The whole
 * shape comes across rather than the fields the district page happens to need:
 * this is data, and a trimmed copy would have to be widened again by every
 * later port.
 *
 * One line of the SvelteKit comment no longer applies. There it said configs
 * must stay serializable because they are returned from `+layout.server.ts`
 * load functions. Here they are read in server components and never cross the
 * RSC boundary as a whole object — but the patterns stay strings anyway, since
 * a RegExp cannot be handed to a client component either, and the lead form is
 * a client leaf that needs the postal pattern.
 */

export type CountryCode = 'in' | 'us';

export interface LevelLabels {
  singular: string;
  plural: string;
}

export interface CountryConfig {
  code: CountryCode;
  name: string;
  /** Name used in outbound copy, e.g. 'Solar Vipani USA'. */
  brandName: string;
  /** e.g. 'en-IN'. */
  locale: string;
  /** ISO 4217, e.g. 'INR'. */
  currency: string;
  taxId: {
    /** 'GSTN' | 'EIN'. */
    label: string;
    /** Whether the business-signup form asks for it. */
    collectOnSignup: boolean;
  };
  levels: {
    /** State/States everywhere so far. */
    level1: LevelLabels;
    /** District/Districts (IN), County/Counties (US). */
    level2: LevelLabels;
  };
  postalCode: {
    /** 'PIN Code' | 'ZIP Code'. */
    label: string;
    /** Regex source, e.g. '^\\d{6}$'. Compiled with `new RegExp(...)`. */
    pattern: string;
    maxLength: number;
  };
  phone: {
    /** '+91' | '+1'. */
    callingCode: string;
    /** Regex source for a valid national number. */
    pattern: string;
  };
  features: {
    /** rooftop-solar, solar-panels, brand/size pages... */
    seoContentFamilies: boolean;
    subsidy: boolean;
    financing: boolean;
    tools: boolean;
    authors: boolean;
    projects: boolean;
    chatbot: boolean;
    /** postal-code -> level2 API (pincode_mapping is IN-only). */
    pincodeLookup: boolean;
    /** customer dashboard + magic link (sv_user is IN-only). */
    userAccounts: boolean;
  };
  /** Noun used in SEO copy, e.g. 'solar installer'. */
  installerNoun: string;
}
