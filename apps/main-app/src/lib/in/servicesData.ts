export interface ServiceItem {
  title: string;
  description: string;
  links?: Array<{ text: string; href: string }>;
}

export const services: ServiceItem[] = [
  {
    title: 'Solar panel installations at Homes, Apartments, and Businesses',
    description:
      'Professional installation of solar panels tailored to residential, commercial, and industrial needs. Commonly used systems for independent homes and bungalows are:',
    links: [
      { text: '1kW ongrid solar system', href: '/in/blogs/1kw-ongrid-solar-system' },
      { text: '3kW ongrid solar system', href: '/in/blogs/3kw-ongrid-solar-system' },
      { text: '5kW ongrid solar system', href: '/in/blogs/5kw-ongrid-solar-system' },
    ],
  },
  {
    title: 'Solar Modules and Inverters',
    description:
      'Supply and installation of high-quality solar modules and inverters to ensure efficient energy generation.',
  },
  {
    title: 'Documentation and Permissions for Subsidy under PM Surya Ghar Yojana',
    description: 'Assistance with the necessary paperwork and approvals to avail government solar subsidies and benefits.',
    links: [{ text: 'PM Surya Ghar Yojana', href: '/in/blogs/pm-surya-ghar-yojana' }],
  },
  {
    title: 'Net Metering',
    description:
      'Setup of net metering systems to help you save on electricity bills by feeding surplus power back into the grid.',
  },
  {
    title: 'Solar Financing through Banks and NBFCs',
    description:
      'Guidance on financing options, loans, and schemes offered by banks and non-banking financial companies. Zero cost EMI schemes have become popular.',
    links: [{ text: 'Zero cost EMI schemes', href: '/in/blogs/zero-cost-emi-schemes-solar' }],
  },
  {
    title: 'Routine Maintenance and Cleaning',
    description: 'Regular maintenance and cleaning services to keep your solar system running efficiently.',
  },
];
