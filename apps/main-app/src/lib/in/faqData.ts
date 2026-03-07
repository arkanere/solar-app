export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQ(city: string): FAQItem[] {
  const cityName = city.replace('-', ' ');

  return [
    {
      question: `How much does it cost to install solar panels in ${cityName}?`,
      answer: `The cost of installing solar panels in ${cityName} varies based on system size and components. For instance, a 3kW system typically ranges from ₹1.5 lakhs to ₹2.5 lakhs, including installation and related expenses.`,
    },
    {
      question: 'How much should I budget for solar panel installation?',
      answer:
        'Budgeting for solar panel installation depends on your energy needs and system size. On average, residential installations can cost between ₹65,000 to ₹95,000 per kW, covering installation, transportation, and related expenses.',
    },
    {
      question: 'How much solar panel is required for a 1.5-ton AC?',
      answer:
        'To run a 1.5-ton air conditioner, you would need a solar system capable of generating approximately 3kW of power. This typically involves installing around 10-12 solar panels of 250 watts each.',
    },
    {
      question: `What is the cost of a 3kW solar panel in ${cityName}?`,
      answer: `A 3kW solar panel system in ${cityName} generally costs between ₹1.5 lakhs to ₹2.5 lakhs, depending on the brand and installation factors.`,
    },
    {
      question: 'How much money will I save if I install solar panels?',
      answer:
        'If you install solar panels with net metering, you\'ll save approximately ₹5.5 to ₹6.5 per unit compared to the ₹8-₹9 per unit cost from the DISCOM. Over 25 years, this translates to substantial savings, making solar energy a cost-effective and sustainable choice.',
    },
  ];
}

export function generateDistrictFAQ(district: string, state: string, installerCount: number): FAQItem[] {
  return [
    {
      question: `How many solar installers are available in ${district}, ${state}?`,
      answer: `There are ${installerCount} verified solar panel installers in ${district}, ${state} listed on Solar Vipani. You can compare quotes, view recent projects, and contact installers directly.`,
    },
    {
      question: `What is the cost of solar panels in ${district}?`,
      answer: `Solar panel costs in ${district} range from ₹65,000 to ₹95,000 per kW depending on brand, inverter type, and installation complexity. A typical 3kW residential system costs ₹1.5–2.5 lakhs before subsidy.`,
    },
    {
      question: `Is solar subsidy available in ${district}, ${state}?`,
      answer: `Yes, residents of ${district} can avail the PM Surya Ghar Yojana subsidy of up to ₹78,000 for rooftop solar installations up to 3kW. The subsidy is credited directly to your bank account after installation.`,
    },
    {
      question: `How do I choose a solar installer in ${district}?`,
      answer: `Compare installers based on recent project photos, customer reviews, and service offerings. Prefer DISCOM-empanelled installers to avail government subsidies. Request 2-3 quotes to get the best price.`,
    },
  ];
}

export function generateStateFAQ(state: string, districtCount: number): FAQItem[] {
  return [
    {
      question: `How many districts in ${state} have solar installers?`,
      answer: `Solar Vipani has verified solar installers listed across ${districtCount} districts in ${state}. Browse by district to find installers near you.`,
    },
    {
      question: `What solar subsidies are available in ${state}?`,
      answer: `Residents of ${state} can avail the central PM Surya Ghar Yojana subsidy of up to ₹78,000. Some states offer additional state-level subsidies. Check our subsidy page for ${state}-specific details.`,
    },
    {
      question: `What is the average cost of solar installation in ${state}?`,
      answer: `Solar installation costs in ${state} range from ₹65,000 to ₹95,000 per kW. A 3kW system typically costs ₹1.5–2.5 lakhs before subsidy, with payback periods of 4-6 years.`,
    },
  ];
}
