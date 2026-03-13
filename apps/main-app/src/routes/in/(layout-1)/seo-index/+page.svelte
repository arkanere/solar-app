<script lang="ts">
	interface Route { label: string; href: string; type?: string; status?: string }
	interface Pillar { name: string; pillar: Route; clusters: Route[]; dynamic?: Route[] }
	interface Section { name: string; routes?: Route[]; pillars?: Pillar[] }

	const sections: Section[] = [
		{
			name: '1. Topical Pillars',
			pillars: [
				{
					name: '1.1 Rooftop Solar',
					pillar: { label: 'Rooftop Solar', href: '/in/rooftop-solar/' },
					clusters: [
						{ label: 'Cost', href: '/in/rooftop-solar/cost/' },
						{ label: 'How It Works', href: '/in/rooftop-solar/how-it-works/' },
						{ label: 'On-Grid', href: '/in/rooftop-solar/on-grid/' },
						{ label: 'Off-Grid', href: '/in/rooftop-solar/off-grid/' },
						{ label: 'Hybrid', href: '/in/rooftop-solar/hybrid/' },
						{ label: 'For Apartments', href: '/in/rooftop-solar/for-apartments/' },
						{ label: '1kW System', href: '/in/rooftop-solar/1kw-system/' },
						{ label: '2kW System', href: '/in/rooftop-solar/2kw-system/' },
						{ label: '3kW System', href: '/in/rooftop-solar/3kw-system/' },
						{ label: '5kW System', href: '/in/rooftop-solar/5kw-system/' },
						{ label: '10kW System', href: '/in/rooftop-solar/10kw-system/' },
						{ label: 'ROI', href: '/in/rooftop-solar/roi/', type: 'redirect' },
						{ label: 'Inverter', href: '/in/rooftop-solar/inverter/' },
						{ label: 'On-Grid Inverter', href: '/in/rooftop-solar/on-grid-inverter/' },
						{ label: 'Off-Grid Inverter', href: '/in/rooftop-solar/off-grid-inverter/' },
						{ label: 'Hybrid Inverter', href: '/in/rooftop-solar/hybrid-inverter/' },
						{ label: 'On-Grid vs Off-Grid', href: '/in/rooftop-solar/on-grid-vs-off-grid/' },
						{ label: 'Commercial', href: '/in/rooftop-solar/commercial/' },
						{ label: 'Complete System', href: '/in/rooftop-solar/complete-system/' },
						{ label: 'Cost Per Watt', href: '/in/rooftop-solar/cost-per-watt/' },
						{ label: 'Benefits', href: '/in/rooftop-solar/benefits/', status: 'content - to be added' },
						{ label: 'Maintenance', href: '/in/rooftop-solar/maintenance/', status: 'content - to be added' },
						{ label: 'Net Metering', href: '/in/rooftop-solar/net-metering/', status: 'content - to be added' },
						{ label: 'Residential', href: '/in/rooftop-solar/residential/', status: 'content - to be added' }
					]
				},
				{
					name: '1.2 Solar Panels',
					pillar: { label: 'Solar Panels', href: '/in/solar-panels/' },
					clusters: [
						{ label: 'Price', href: '/in/solar-panels/price/' },
						{ label: 'Types', href: '/in/solar-panels/types/' },
						{ label: 'Monocrystalline', href: '/in/solar-panels/monocrystalline/' },
						{ label: 'Polycrystalline', href: '/in/solar-panels/polycrystalline/' },
						{ label: 'Bifacial', href: '/in/solar-panels/bifacial/' },
						{ label: 'Efficiency', href: '/in/solar-panels/efficiency/' },
						{ label: 'Brands', href: '/in/solar-panels/brands/' },
						{ label: 'Mono vs Poly', href: '/in/solar-panels/monocrystalline-vs-polycrystalline/' },
						{ label: 'Buying Guide', href: '/in/solar-panels/buying-guide/' },
						{ label: 'Half-Cut', href: '/in/solar-panels/half-cut/', status: 'content - to be added' },
						{ label: 'Warranty', href: '/in/solar-panels/warranty/', status: 'content - to be added' },
						{ label: 'For Home', href: '/in/solar-panels/for-home/', status: 'content - to be added' },
						{ label: 'For Commercial', href: '/in/solar-panels/for-commercial/', status: 'content - to be added' }
					],
					dynamic: [
						{ label: 'Brand — Tata Solar', href: '/in/solar-panels/tata-solar/', type: 'brand' },
						{ label: 'Product — Tata WS-545', href: '/in/solar-panels/tata-solar/ws-545/', type: 'product' }
					]
				},
				{
					name: '1.3 Solar Installation',
					pillar: { label: 'Solar Installation', href: '/in/solar-installation/' },
					clusters: [
						{ label: 'Cost', href: '/in/solar-installation/cost/' },
						{ label: 'Process', href: '/in/solar-installation/process/' },
						{ label: 'Timeline', href: '/in/solar-installation/timeline/' },
						{ label: 'Checklist', href: '/in/solar-installation/checklist/' },
						{ label: 'Choosing Installer', href: '/in/solar-installation/choosing-installer/' },
						{ label: 'Roof Assessment', href: '/in/solar-installation/roof-assessment/', status: 'content - to be added' },
						{ label: 'Permits', href: '/in/solar-installation/permits/', status: 'content - to be added' },
						{ label: 'Grid Connection', href: '/in/solar-installation/grid-connection/', status: 'content - to be added' },
						{ label: 'Safety', href: '/in/solar-installation/safety/', status: 'content - to be added' },
						{ label: 'DIY vs Professional', href: '/in/solar-installation/diy-vs-professional/', status: 'content - to be added' },
						{ label: 'Site Survey', href: '/in/solar-installation/site-survey/', status: 'content - to be added' },
						{ label: 'Wiring', href: '/in/solar-installation/wiring/', status: 'content - to be added' },
						{ label: 'Commissioning', href: '/in/solar-installation/commissioning/', status: 'content - to be added' }
					]
				},
				{
					name: '1.4 Solar Subsidy',
					pillar: { label: 'Solar Subsidy', href: '/in/solar-subsidy/' },
					clusters: [
						{ label: 'PM Surya Ghar', href: '/in/solar-subsidy/pm-surya-ghar/' },
						{ label: 'Central Government', href: '/in/solar-subsidy/central-government/' },
						{ label: 'State-Wise', href: '/in/solar-subsidy/state-wise/' },
						{ label: 'Eligibility', href: '/in/solar-subsidy/eligibility/' },
						{ label: 'How to Apply', href: '/in/solar-subsidy/how-to-apply/' },
						{ label: 'Net Metering', href: '/in/solar-subsidy/net-metering/' },
						{ label: 'Application Process', href: '/in/solar-subsidy/application-process/' },
						{ label: 'Documents Required', href: '/in/solar-subsidy/documents-required/' },
						{ label: 'Central Subsidy', href: '/in/solar-subsidy/central-subsidy/' },
						{ label: 'State Subsidy', href: '/in/solar-subsidy/state-subsidy/' },
						{ label: 'Commercial Subsidy', href: '/in/solar-subsidy/commercial-subsidy/' },
						{ label: 'MNRE Guidelines', href: '/in/solar-subsidy/mnre-guidelines/' },
						{ label: 'Subsidy Calculator', href: '/in/solar-subsidy/subsidy-calculator/' },
						{ label: 'Latest Updates', href: '/in/solar-subsidy/latest-updates/' }
					],
					dynamic: [
						{ label: 'State — Maharashtra', href: '/in/solar-subsidy/maharashtra/', type: 'state' },
						{ label: 'DISCOM — MSEDCL', href: '/in/solar-subsidy/msedcl/', type: 'discom' }
					]
				},
				{
					name: '1.5 Solar Pumps',
					pillar: { label: 'Solar Pumps', href: '/in/solar-pumps/' },
					clusters: [
						{ label: 'Price', href: '/in/solar-pumps/price/', status: 'content - to be added' },
						{ label: 'How It Works', href: '/in/solar-pumps/how-it-works/', status: 'content - to be added' },
						{ label: 'Submersible', href: '/in/solar-pumps/submersible/', status: 'content - to be added' },
						{ label: 'Surface', href: '/in/solar-pumps/surface/', status: 'content - to be added' },
						{ label: 'Irrigation', href: '/in/solar-pumps/irrigation/', status: 'content - to be added' },
						{ label: '1 HP', href: '/in/solar-pumps/1hp/', status: 'content - to be added' },
						{ label: '2 HP', href: '/in/solar-pumps/2hp/', status: 'content - to be added' },
						{ label: '3 HP', href: '/in/solar-pumps/3hp/', status: 'content - to be added' },
						{ label: '5 HP', href: '/in/solar-pumps/5hp/', status: 'content - to be added' },
						{ label: '7.5 HP', href: '/in/solar-pumps/7-5hp/', status: 'content - to be added' },
						{ label: '10 HP', href: '/in/solar-pumps/10hp/', status: 'content - to be added' },
						{ label: 'Borewell', href: '/in/solar-pumps/borewell/', status: 'content - to be added' },
						{ label: 'BLDC', href: '/in/solar-pumps/bldc/', status: 'content - to be added' },
						{ label: 'Controller', href: '/in/solar-pumps/controller/', status: 'content - to be added' },
						{ label: 'For Home', href: '/in/solar-pumps/for-home/', status: 'content - to be added' },
						{ label: 'KUSUM Yojana', href: '/in/solar-pumps/kusum-yojana/', status: 'content - to be added' }
					],
					dynamic: [
						{ label: 'Brand — Shakti', href: '/in/solar-pumps/shakti/', type: 'brand' },
						{ label: 'Product — Shakti SSP-5HP', href: '/in/solar-pumps/shakti/ssp-5hp-ac/', type: 'product' }
					]
				},
				{
					name: '1.6 Solar Inverters',
					pillar: { label: 'Solar Inverters', href: '/in/solar-inverters/' },
					clusters: [
						{ label: 'Price', href: '/in/solar-inverters/price/' },
						{ label: 'Types', href: '/in/solar-inverters/types/' },
						{ label: 'On-Grid', href: '/in/solar-inverters/on-grid/' },
						{ label: 'Off-Grid', href: '/in/solar-inverters/off-grid/' },
						{ label: 'Hybrid', href: '/in/solar-inverters/hybrid/' },
						{ label: 'Micro Inverter', href: '/in/solar-inverters/micro-inverter/' },
						{ label: 'String Inverter', href: '/in/solar-inverters/string-inverter/', status: 'content - to be added' },
						{ label: 'Hybrid Inverter', href: '/in/solar-inverters/hybrid-inverter/', status: 'content - to be added' },
						{ label: 'On-Grid Inverter', href: '/in/solar-inverters/on-grid-inverter/', status: 'content - to be added' },
						{ label: 'Off-Grid Inverter', href: '/in/solar-inverters/off-grid-inverter/', status: 'content - to be added' },
						{ label: 'Sizing', href: '/in/solar-inverters/sizing/', status: 'content - to be added' },
						{ label: 'For Home', href: '/in/solar-inverters/for-home/', status: 'content - to be added' },
						{ label: 'For Commercial', href: '/in/solar-inverters/for-commercial/', status: 'content - to be added' }
					],
					dynamic: [
						{ label: 'Brand — Microtek', href: '/in/solar-inverters/microtek/', type: 'brand' },
						{ label: 'Product — Growatt MIC-3000TL', href: '/in/solar-inverters/growatt/mic-3000tl/', type: 'product' }
					]
				},
				{
					name: '1.7 Solar Financing',
					pillar: { label: 'Solar Financing', href: '/in/solar-financing/' },
					clusters: [
						{ label: 'Solar Loan', href: '/in/solar-financing/solar-loan/' },
						{ label: 'EMI', href: '/in/solar-financing/emi/' },
						{ label: 'Free Solar Scheme', href: '/in/solar-financing/free-solar-scheme/' },
						{ label: 'ROI', href: '/in/solar-financing/roi/' },
						{ label: 'EMI Options', href: '/in/solar-financing/emi-options/' },
						{ label: 'Interest Rates', href: '/in/solar-financing/interest-rates/' },
						{ label: 'Eligibility', href: '/in/solar-financing/eligibility/' },
						{ label: 'Documents Required', href: '/in/solar-financing/documents-required/' },
						{ label: 'Payback Period', href: '/in/solar-financing/payback-period/' },
						{ label: 'Lease vs Loan', href: '/in/solar-financing/lease-vs-loan/' },
						{ label: 'Commercial Financing', href: '/in/solar-financing/commercial-financing/' },
						{ label: 'Green Bonds', href: '/in/solar-financing/green-bonds/' }
					],
					dynamic: [
						{ label: 'Bank — SBI', href: '/in/solar-financing/sbi/', type: 'bank' },
						{ label: 'Bank — HDFC', href: '/in/solar-financing/hdfc/', type: 'bank' }
					]
				}
			]
		},
		{
			name: '2. Geographic Pages',
			routes: [
				{ label: 'All-India Hub', href: '/in/solar/' },
				{ label: 'State — Maharashtra', href: '/in/solar/maharashtra/' },
				{ label: 'State — Karnataka', href: '/in/solar/karnataka/' },
				{ label: 'District — Pune', href: '/in/solar/maharashtra/pune/' },
				{ label: 'District — Bengaluru', href: '/in/solar/karnataka/bengaluru/' },
				{ label: 'City — Kothrud', href: '/in/solar/maharashtra/pune/kothrud/' },
				{ label: 'Brand × District — Tata Solar in Pune', href: '/in/solar/maharashtra/pune/tata-solar/' },
				{ label: 'Size × District — 3kW in Pune', href: '/in/solar/maharashtra/pune/3kw-solar-system/' }
			]
		},
		{
			name: '3. Entity Pages',
			routes: [
				{ label: 'Get Quotes', href: '/in/get-quotes/' },
				{ label: 'Installer — Sunspark Energy Pune', href: '/in/installer/sunspark-energy-pune/' },
				{ label: 'Project — 5kW Kothrud', href: '/in/project/5kw-kothrud-pune-march-2025/' },
				{ label: 'Author — Rahul Sharma', href: '/in/authors/rahul-sharma/' }
			]
		},
		{
			name: '4. Blog',
			routes: [
				{ label: 'Blog Index', href: '/in/blogs/' },
				{ label: 'Blog Post — PM Surya Ghar Yojana', href: '/in/blogs/pm-surya-ghar-yojana/' }
			]
		},
		{
			name: '5. Tools',
			routes: [
				{ label: 'Solar Calculator', href: '/in/tools/solar-calculator/' },
				{ label: 'EMI Calculator', href: '/in/tools/emi-calculator/' },
				{ label: 'Subsidy Checker', href: '/in/tools/subsidy-checker/' }
			]
		},
		{
			name: '6. B2B / Partners',
			routes: [
				{ label: 'Partner Landing', href: '/in/partners/' },
				{ label: 'Partner Join', href: '/in/partners/join/' },
				{ label: 'Partner Join — Pune', href: '/in/partners/join/pune/' },
				{ label: 'Partner Join — Bengaluru', href: '/in/partners/join/bengaluru/' }
			]
		}
	];
</script>

<svelte:head>
	<title>SEO Routes Index | Dev</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8">
	<h1 class="mb-2 text-3xl font-bold text-foreground">URL Schema Index</h1>
	<p class="mb-8 text-sm text-muted-foreground">All SEO routes mapped to the URL schema. Not indexed.</p>

	{#each sections as section}
		<section class="mb-8">
			<h2 class="mb-4 border-b border-border pb-2 text-lg font-semibold text-foreground">{section.name}</h2>

			{#if section.pillars}
				{#each section.pillars as pillar}
					<div class="mb-5 ml-2">
						<h3 class="mb-2 text-sm font-semibold text-muted-foreground">{pillar.name}</h3>
						<ul class="space-y-0.5">
							<li>
								<a href={pillar.pillar.href} class="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
									<span class="font-mono text-xs text-muted-foreground">{pillar.pillar.href}</span>
									<span>{pillar.pillar.label}</span>
									<span class="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">pillar</span>
								</a>
							</li>
							{#each pillar.clusters as route}
								<li class="ml-4">
									<a href={route.href} class="inline-flex items-center gap-2 text-sm hover:text-primary hover:underline">
										<span class="font-mono text-xs text-muted-foreground">{route.href}</span>
										<span class="text-foreground">{route.label}</span>
										{#if route.type === 'redirect'}
											<span class="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600">redirect</span>
										{:else}
											<span class="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">cluster</span>
										{/if}
										{#if route.status}
											<span class="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-600">{route.status}</span>
										{/if}
									</a>
								</li>
							{/each}
							{#if pillar.dynamic}
								{#each pillar.dynamic as route}
									<li class="ml-4">
										<a href={route.href} class="inline-flex items-center gap-2 text-sm hover:text-primary hover:underline">
											<span class="font-mono text-xs text-muted-foreground">{route.href}</span>
											<span class="text-foreground">{route.label}</span>
											<span class="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">{route.type}</span>
										</a>
									</li>
								{/each}
							{/if}
						</ul>
					</div>
				{/each}
			{/if}

			{#if section.routes}
				<ul class="ml-2 space-y-0.5">
					{#each section.routes as route}
						<li>
							<a href={route.href} class="inline-flex items-center gap-2 text-sm hover:text-primary hover:underline">
								<span class="font-mono text-xs text-muted-foreground">{route.href}</span>
								<span class="text-foreground">{route.label}</span>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	{/each}
</div>
