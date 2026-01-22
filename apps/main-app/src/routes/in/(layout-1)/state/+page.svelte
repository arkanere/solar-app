<script>
	import { Card } from '$lib/components/ui/card';
	import {
		Accordion,
		AccordionItem,
		AccordionTrigger,
		AccordionContent
	} from '$lib/components/ui/accordion';

	// States array defined directly in the component
	const states = [
		'Andaman and Nicobar Islands',
		'Andhra Pradesh',
		'Arunachal Pradesh',
		'Assam',
		'Bihar',
		'Chandigarh',
		'Chhattisgarh',
		'Dadra and Nagar Haveli and Daman and Diu',
		'Delhi',
		'Goa',
		'Gujarat',
		'Haryana',
		'Himachal Pradesh',
		'Jammu and Kashmir',
		'Jharkhand',
		'Karnataka',
		'Kerala',
		'Ladakh',
		'Lakshadweep',
		'Madhya Pradesh',
		'Maharashtra',
		'Manipur',
		'Meghalaya',
		'Mizoram',
		'Nagaland',
		'Odisha',
		'Puducherry',
		'Punjab',
		'Rajasthan',
		'Sikkim',
		'Tamil Nadu',
		'Telangana',
		'Tripura',
		'Uttar Pradesh',
		'Uttarakhand',
		'West Bengal'
	];

	const faqItems = [
		{
			id: 'faq-1',
			question: 'How much does it cost to install solar panels in India?',
			answer:
				'The cost of installing solar panels in India varies based on system size and components. For instance, a 3kW system typically ranges from ₹1.5 lakhs to ₹2.5 lakhs, including installation and related expenses.'
		},
		{
			id: 'faq-2',
			question: 'How much should I budget for solar panel installation?',
			answer:
				'Budgeting for solar panel installation depends on your energy needs and system size. On average, residential installations can cost between ₹65,000 to ₹95,000 per kW, covering installation, transportation, and related expenses.'
		},
		{
			id: 'faq-3',
			question: 'How much solar panel is required for a 1.5-ton AC?',
			answer:
				'To run a 1.5-ton air conditioner, you would need a solar system capable of generating approximately 3kW of power. This typically involves installing around 10-12 solar panels of 250 watts each.'
		},
		{
			id: 'faq-4',
			question: 'What are the benefits of solar panels in India?',
			answer:
				'Installing solar panels in India offers multiple benefits, including reduced electricity bills, government subsidies through schemes like PM Surya Ghar Yojana, energy independence, and contributing to a greener environment with reduced carbon footprint.'
		},
		{
			id: 'faq-5',
			question: 'How much money will I save if I install solar panels?',
			answer:
				'If you install solar panels with net metering, you\'ll save approximately ₹5.5 to ₹6.5 per unit compared to the ₹8-₹9 per unit cost from the DISCOM. Over 25 years, this translates to substantial savings, making solar energy a cost-effective and sustainable choice.'
		}
	];

	// Function to format state name for URL
	function formatStateSlug(state) {
		return `solar-panel-installers-in-${state.toLowerCase().replace(/\s+/g, '-')}`;
	}
</script>

<svelte:head>
	<title>Solar Panel Installers by State - Find solar installers across India - Solar Vipani</title>
	<meta
		name="description"
		content="Find the best solar panel installers across India. Browse by state to find top solar companies in your area."
	/>
</svelte:head>

<main class="w-full bg-background text-foreground overflow-x-hidden transition-colors duration-300 flex flex-col items-center px-[theme(--container-padding)] py-[theme(--spacing-2xl)] min-h-screen">
	<!-- State List Section -->
	<div class="max-w-4xl w-full mb-[theme(--spacing-3xl)]">
		<h1 class="text-[theme(--font-size-3xl)] md:text-[theme(--font-size-4xl)] font-semibold text-center mb-[theme(--spacing-lg)] text-primary">
			Solar Panel Installers by State
		</h1>

		<p class="text-center text-muted-foreground mb-[theme(--spacing-2xl)] text-[theme(--font-size-lg)]">
			Browse solar panel installers by state. We have listings in <span class="font-semibold text-foreground">{states.length} states</span> across India.
		</p>

		<ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[theme(--card-gap)] w-full list-none p-0">
			{#each states as state}
				<li>
					<a
						href={`/in/state/${formatStateSlug(state)}`}
						class="block h-full bg-card rounded-[theme(--radius-xl)] p-[theme(--card-padding-y)] border border-border hover:shadow-lg hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
					>
						<h2 class="text-[theme(--font-size-xl)] font-semibold mb-[theme(--spacing-sm)] text-primary">
							{state}
						</h2>
						<p class="text-muted-foreground mb-[theme(--spacing-lg)] flex-grow">
							Find solar installers in {state}
						</p>
						<div class="flex items-center text-primary font-medium">
							<span>View districts</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
							>
								<path
									fill-rule="evenodd"
									d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<!-- Services Section -->
	<div class="max-w-4xl w-full mb-[theme(--spacing-3xl)]">
		<h2 class="text-[theme(--font-size-2xl)] font-semibold text-center mb-[theme(--spacing-2xl)] text-secondary">
			Services Provided by Solar Panel Installers
		</h2>
		<ul class="grid grid-cols-1 md:grid-cols-2 gap-[theme(--card-gap)] list-none p-0">
			<li>
				<Card class="hover:shadow-md transition-all duration-300">
					<strong class="block text-[theme(--font-size-lg)] text-primary mb-[theme(--spacing-md)]">Solar panel installations at Homes, Apartments, and Businesses</strong>
					<p class="text-muted-foreground leading-relaxed">
						Professional installation of solar panels tailored to residential, commercial, and
						industrial needs. Commonly used systems for independant homes and bunglows are <strong
							>1kW ongrid solar system, 3kW ongrid solar system,</strong
						>
						and <strong> 5kW ongrid solar system.</strong>
					</p>
				</Card>
			</li>
			<li>
				<Card class="hover:shadow-md transition-all duration-300">
					<strong class="block text-[theme(--font-size-lg)] text-primary mb-[theme(--spacing-md)]">Solar Modules and Inverters</strong>
					<p class="text-muted-foreground leading-relaxed">
						Supply and installation of high-quality solar modules and inverters to ensure efficient
						energy generation.
					</p>
				</Card>
			</li>
			<li>
				<Card class="hover:shadow-md transition-all duration-300">
					<strong class="block text-[theme(--font-size-lg)] text-primary mb-[theme(--spacing-md)]">
						Documentation and Permissions for Subsidy under <a
							href="/in/blogs/pm-surya-ghar-yojana"
							target="_blank"
							class="text-primary hover:underline"
						>
							PM Surya Ghar Yojana
						</a>
					</strong>
					<p class="text-muted-foreground leading-relaxed">
						Assistance with the necessary paperwork and approvals to avail government solar subsidies
						and benefits.
					</p>
				</Card>
			</li>
			<li>
				<Card class="hover:shadow-md transition-all duration-300">
					<strong class="block text-[theme(--font-size-lg)] text-primary mb-[theme(--spacing-md)]">Net Metering</strong>
					<p class="text-muted-foreground leading-relaxed">
						Setup of net metering systems to help you save on electricity bills by feeding surplus
						power back into the grid.
					</p>
				</Card>
			</li>
			<li>
				<Card class="hover:shadow-md transition-all duration-300">
					<strong class="block text-[theme(--font-size-lg)] text-primary mb-[theme(--spacing-md)]">Solar Financing through Banks and NBFCs</strong>
					<p class="text-muted-foreground leading-relaxed">
						Guidance on financing options, loans, and schemes offered by banks and non-banking
						financial companies. Nowadays <strong> Zero cost EMI schemes </strong>have become popular.
					</p>
				</Card>
			</li>
			<li>
				<Card class="hover:shadow-md transition-all duration-300">
					<strong class="block text-[theme(--font-size-lg)] text-primary mb-[theme(--spacing-md)]">Routine Maintenance and Cleaning</strong>
					<p class="text-muted-foreground leading-relaxed">
						Regular maintenance and cleaning services to keep your solar system running efficiently.
					</p>
				</Card>
			</li>
		</ul>
	</div>

	<!-- FAQ Section -->
	<div class="max-w-4xl w-full mb-[theme(--spacing-3xl)]">
		<h2 class="text-[theme(--font-size-2xl)] font-semibold text-center mb-[theme(--spacing-2xl)] text-secondary">
			Frequently Asked Questions
		</h2>
		<Accordion class="w-full">
			{#each faqItems as item}
				<AccordionItem value={item.id}>
					<AccordionTrigger class="text-primary font-semibold">
						{item.question}
					</AccordionTrigger>
					<AccordionContent class="text-muted-foreground text-[theme(--font-size-sm)] leading-relaxed">
						{item.answer}
					</AccordionContent>
				</AccordionItem>
			{/each}
		</Accordion>
	</div>

	<!-- About Section -->
	<div class="max-w-4xl w-full">
		<h2 class="text-[theme(--font-size-2xl)] font-semibold text-center mb-[theme(--spacing-2xl)] text-secondary">
			About Solarvipani
		</h2>

		<Card class="flex flex-col md:flex-row gap-[theme(--spacing-2xl)] items-center mb-[theme(--spacing-2xl)]">
			<!-- Logo -->
			<img
				src="/logo.webp"
				alt="Solarvipani Logo"
				class="w-48 h-auto flex-shrink-0"
				width="200"
				height="100"
				loading="lazy"
			/>

			<!-- Text -->
			<div class="flex-grow">
				<p class="text-muted-foreground text-[theme(--font-size-lg)] leading-relaxed">
					We are your premier marketplace aggregator dedicated to connecting residential and
					business customers with <a
						href="/in/blogs/hiring-verified-solar-installer-in-india-is-essential"
						target="_blank"
						class="text-primary hover:underline font-semibold"
					>
						Best Local Solar Panel Installation
					</a>
					companies, ensuring that you make smart decisions backed by credible information
					and have a hassle-free experience.
				</p>
			</div>
		</Card>

		<!-- Social Media Links -->
		<div class="text-center">
			<h4 class="text-[theme(--font-size-lg)] font-semibold text-foreground mb-[theme(--spacing-lg)]">Follow us on:</h4>
			<div class="flex flex-wrap justify-center gap-[theme(--spacing-lg)]">
				<a
					href="https://www.facebook.com/p/Solar-Vipani-61556033262509/"
					target="_blank"
					aria-label="Facebook"
					class="text-primary hover:text-primary/80 font-medium transition-colors"
				>
					Facebook
				</a>
				<a href="https://x.com/Solarvipani" target="_blank" aria-label="Twitter" class="text-primary hover:text-primary/80 font-medium transition-colors"
					>Twitter</a
				>
				<a href="https://www.linkedin.com/company/solar-vipani/" target="_blank" aria-label="LinkedIn" class="text-primary hover:text-primary/80 font-medium transition-colors"
					>LinkedIn</a
				>
				<a href="https://www.instagram.com/solar.vipani/" target="_blank" aria-label="Instagram" class="text-primary hover:text-primary/80 font-medium transition-colors"
					>Instagram</a
				>
				<a href="https://wa.me/918983066701" target="_blank" aria-label="Whatsapp" class="text-primary hover:text-primary/80 font-medium transition-colors"
					>Whatsapp</a
				>
			</div>
		</div>
	</div>
</main>
