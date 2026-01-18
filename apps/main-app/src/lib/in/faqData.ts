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
