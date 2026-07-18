// Per-country FAQ copy for the /[country]/solar geo pages. Countries without
// an entry simply render no FAQ section (and no FAQ JSON-LD).

import type { CountryCode } from './types';
import type { FAQItem } from '$lib/in/faqData';
import * as inFaq from '$lib/in/faqData';
import * as usFaq from '$lib/us/faqData';

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
