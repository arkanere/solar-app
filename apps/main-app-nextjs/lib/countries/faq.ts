/**
 * Per-country FAQ copy for the /{cc}/solar geo pages. Ported from
 * apps/main-app/src/lib/countries/faq.ts.
 *
 * A country with no entry renders no FAQ section and no FAQ JSON-LD — the two
 * go together, and the page derives both from the same array so they cannot
 * disagree.
 *
 * Note this is NOT gated on a `features` flag. Both live countries have copy,
 * and the absence of an entry is itself the gate.
 */
import type { CountryCode } from './types';
import type { FAQItem } from './faq-in';
import * as inFaq from './faq-in';
import * as usFaq from './faq-us';

export type { FAQItem } from './faq-in';

export interface FaqGenerators {
  generateFAQ(city: string): FAQItem[];
  generateDistrictFAQ(level2: string, level1: string, installerCount: number): FAQItem[];
  generateStateFAQ(level1: string, level2Count: number): FAQItem[];
}

const FAQ_BY_COUNTRY: Partial<Record<CountryCode, FaqGenerators>> = {
  in: inFaq,
  us: usFaq
};

export function faqFor(code: CountryCode): FaqGenerators | null {
  return FAQ_BY_COUNTRY[code] ?? null;
}
