// US-localized FAQ copy for the /us geo pages. Mirrors the generator
// interface of $lib/in/faqData so pages can dispatch per country via
// $lib/countries/faq. Incentive wording is deliberately non-specific:
// federal/state/utility programs change frequently and vary by state.

import type { FAQItem } from '$lib/in/faqData';

export function generateFAQ(city: string): FAQItem[] {
	const cityName = city.replace('-', ' ');

	return [
		{
			question: `How much does it cost to install solar panels in ${cityName}?`,
			answer: `Solar installation in ${cityName} typically costs $2.50 to $3.50 per watt before incentives. A common 6 kW residential system runs about $15,000 to $21,000 installed, depending on equipment, roof complexity, and local labor rates.`
		},
		{
			question: 'How many solar panels does an average home need?',
			answer: 'Most US homes need a 6-8 kW system, which is roughly 15-20 panels of 400 watts each, depending on your electricity usage, roof space, and local sun hours.'
		},
		{
			question: `Are there solar incentives available in ${cityName}?`,
			answer: `Federal, state, and utility incentives — tax credits, rebates, net metering, and performance programs — vary by location and change over time. Local installers in ${cityName} can tell you which programs currently apply to your home.`
		},
		{
			question: 'How much money will I save if I install solar panels?',
			answer: 'Savings depend on your utility rates and net metering policy, but most homeowners offset 70-100% of their electricity bill. Over the 25+ year life of a system, that typically adds up to tens of thousands of dollars.'
		}
	];
}

export function generateDistrictFAQ(
	county: string,
	state: string,
	installerCount: number
): FAQItem[] {
	return [
		{
			question: `How many solar installers are available in ${county}, ${state}?`,
			answer: `There are ${installerCount} verified solar panel installers in ${county}, ${state} listed on Solar Vipani. You can compare quotes, view recent projects, and contact installers directly.`
		},
		{
			question: `What is the cost of solar panels in ${county}?`,
			answer: `Solar panel costs in ${county} typically range from $2.50 to $3.50 per watt before incentives. A 6 kW residential system usually costs $15,000 to $21,000 installed, depending on equipment and roof complexity.`
		},
		{
			question: `Are solar incentives available in ${county}, ${state}?`,
			answer: `Incentives vary by state and utility — ${state} homeowners may qualify for tax credits, rebates, net metering, or performance-based programs. Ask your installer which programs currently apply in ${county}.`
		},
		{
			question: `How do I choose a solar installer in ${county}?`,
			answer: `Compare installers based on recent project photos, customer reviews, licensing, and warranties. Prefer NABCEP-certified installers, and request 2-3 quotes to get the best price.`
		}
	];
}

export function generateStateFAQ(state: string, countyCount: number): FAQItem[] {
	return [
		{
			question: `How many counties in ${state} have solar installers?`,
			answer: `Solar Vipani has verified solar installers listed across ${countyCount} counties in ${state}. Browse by county to find installers near you.`
		},
		{
			question: `What solar incentives are available in ${state}?`,
			answer: `Solar incentives in ${state} can include federal and state tax credits, utility rebates, net metering, and performance-based programs. Programs change over time, so confirm current offerings with your installer or utility.`
		},
		{
			question: `What is the average cost of solar installation in ${state}?`,
			answer: `Solar installation in ${state} typically costs $2.50 to $3.50 per watt before incentives. A 6 kW home system usually runs $15,000 to $21,000 installed, with payback periods commonly in the 7-12 year range.`
		}
	];
}
