import type { PageServerLoad } from './$types';

export const config = {
	isr: { expiration: 1296000 }
};

export const load: PageServerLoad = async () => {
	return {
		tools: [
			{
				title: 'Solar Calculator',
				description:
					'Estimate system size, cost, savings, and payback period based on your electricity bill and location.',
				href: '/in/tools/solar-calculator/',
				icon: 'calculator'
			},
			{
				title: 'EMI Calculator',
				description:
					'Calculate monthly EMI for solar panel loans. Compare rates across banks and find the best financing option.',
				href: '/in/tools/emi-calculator/',
				icon: 'banknote'
			},
			{
				title: 'Subsidy Checker',
				description:
					'Check central and state solar subsidies applicable to your system. See eligibility and total savings.',
				href: '/in/tools/subsidy-checker/',
				icon: 'badge-indian-rupee'
			}
		]
	};
};
