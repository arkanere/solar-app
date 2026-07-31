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
					pillar: { label: 'Rooftop Solar', href: '/rooftop-solar' },
					clusters: [
						{ label: 'Cost', href: '/rooftop-solar/cost' },
						{ label: 'How It Works', href: '/rooftop-solar/how-it-works' },
						{ label: 'On-Grid', href: '/rooftop-solar/on-grid' },
						{ label: 'Off-Grid', href: '/rooftop-solar/off-grid' },
						{ label: 'Hybrid', href: '/rooftop-solar/hybrid' },
						{ label: 'For Apartments', href: '/rooftop-solar/for-apartments' },
						{ label: '1kW System', href: '/rooftop-solar/1kw-system' },
						{ label: '2kW System', href: '/rooftop-solar/2kw-system' },
						{ label: '3kW System', href: '/rooftop-solar/3kw-system' },
						{ label: '5kW System', href: '/rooftop-solar/5kw-system' },
						{ label: '10kW System', href: '/rooftop-solar/10kw-system' },
						{ label: 'ROI', href: '/rooftop-solar/roi', type: 'redirect' },
						{ label: 'Inverter', href: '/rooftop-solar/inverter' },
						{ label: 'On-Grid Inverter', href: '/rooftop-solar/on-grid-inverter' },
						{ label: 'Off-Grid Inverter', href: '/rooftop-solar/off-grid-inverter' },
						{ label: 'Hybrid Inverter', href: '/rooftop-solar/hybrid-inverter' },
						{ label: 'On-Grid vs Off-Grid', href: '/rooftop-solar/on-grid-vs-off-grid' },
						{ label: 'Commercial', href: '/rooftop-solar/commercial' },
						{ label: 'Complete System', href: '/rooftop-solar/complete-system' },
						{ label: 'Cost Per Watt', href: '/rooftop-solar/cost-per-watt' },
						{ label: 'Benefits', href: '/rooftop-solar/benefits' },
						{ label: 'Maintenance', href: '/rooftop-solar/maintenance' },
						{ label: 'Net Metering', href: '/rooftop-solar/net-metering' },
						{ label: 'Residential', href: '/rooftop-solar/residential' }
					]
				},
				{
					name: '1.2 Solar Panels',
					pillar: { label: 'Solar Panels', href: '/solar-panels' },
					clusters: [
						{ label: 'Price', href: '/solar-panels/price' },
						{ label: 'Types', href: '/solar-panels/types' },
						{ label: 'Monocrystalline', href: '/solar-panels/monocrystalline' },
						{ label: 'Polycrystalline', href: '/solar-panels/polycrystalline' },
						{ label: 'Bifacial', href: '/solar-panels/bifacial' },
						{ label: 'Efficiency', href: '/solar-panels/efficiency' },
						{ label: 'Brands', href: '/solar-panels/brands' },
						{ label: 'Mono vs Poly', href: '/solar-panels/monocrystalline-vs-polycrystalline' },
						{ label: 'Buying Guide', href: '/solar-panels/buying-guide' },
						{ label: 'Half-Cut', href: '/solar-panels/half-cut' },
						{ label: 'Warranty', href: '/solar-panels/warranty' },
						{ label: 'For Home', href: '/solar-panels/for-home' },
						{ label: 'For Commercial', href: '/solar-panels/for-commercial' }
					],
					dynamic: [
						{ label: 'Brand — Tata Solar', href: '/solar-panels/tata-solar', type: 'brand' },
						{ label: 'Product — Tata WS-545', href: '/solar-panels/tata-solar/ws-545', type: 'product' }
					]
				},
				{
					name: '1.3 Solar Installation',
					pillar: { label: 'Solar Installation', href: '/solar-installation' },
					clusters: [
						{ label: 'Cost', href: '/solar-installation/cost' },
						{ label: 'Process', href: '/solar-installation/process' },
						{ label: 'Timeline', href: '/solar-installation/timeline' },
						{ label: 'Checklist', href: '/solar-installation/checklist' },
						{ label: 'Choosing Installer', href: '/solar-installation/choosing-installer' },
						{ label: 'Roof Assessment', href: '/solar-installation/roof-assessment' },
						{ label: 'Permits', href: '/solar-installation/permits' },
						{ label: 'Grid Connection', href: '/solar-installation/grid-connection' },
						{ label: 'Safety', href: '/solar-installation/safety' },
						{ label: 'DIY vs Professional', href: '/solar-installation/diy-vs-professional' },
						{ label: 'Site Survey', href: '/solar-installation/site-survey' },
						{ label: 'Wiring', href: '/solar-installation/wiring' },
						{ label: 'Commissioning', href: '/solar-installation/commissioning' }
					]
				},
				{
					name: '1.4 Solar Subsidy',
					pillar: { label: 'Solar Subsidy', href: '/solar-subsidy' },
					clusters: [
						{ label: 'PM Surya Ghar', href: '/solar-subsidy/pm-surya-ghar' },
						{ label: 'Central Government', href: '/solar-subsidy/central-government' },
						{ label: 'State-Wise', href: '/solar-subsidy/state-wise' },
						{ label: 'Eligibility', href: '/solar-subsidy/eligibility' },
						{ label: 'How to Apply', href: '/solar-subsidy/how-to-apply' },
						{ label: 'Net Metering', href: '/solar-subsidy/net-metering' },
						{ label: 'Application Process', href: '/solar-subsidy/application-process' },
						{ label: 'Documents Required', href: '/solar-subsidy/documents-required' },
						{ label: 'Central Subsidy', href: '/solar-subsidy/central-subsidy' },
						{ label: 'State Subsidy', href: '/solar-subsidy/state-subsidy' },
						{ label: 'Commercial Subsidy', href: '/solar-subsidy/commercial-subsidy' },
						{ label: 'MNRE Guidelines', href: '/solar-subsidy/mnre-guidelines' },
						{ label: 'Subsidy Calculator', href: '/solar-subsidy/subsidy-calculator' },
						{ label: 'Latest Updates', href: '/solar-subsidy/latest-updates' }
					],
					dynamic: [
						{ label: 'State — Maharashtra', href: '/solar-subsidy/maharashtra', type: 'state' },
						{ label: 'DISCOM — MSEDCL', href: '/solar-subsidy/msedcl', type: 'discom' }
					]
				},
				{
					name: '1.5 Solar Pumps',
					pillar: { label: 'Solar Pumps', href: '/solar-pumps' },
					clusters: [
						{ label: 'Price', href: '/solar-pumps/price' },
						{ label: 'How It Works', href: '/solar-pumps/how-it-works' },
						{ label: 'Submersible', href: '/solar-pumps/submersible' },
						{ label: 'Surface', href: '/solar-pumps/surface' },
						{ label: 'Irrigation', href: '/solar-pumps/irrigation' },
						{ label: '1 HP', href: '/solar-pumps/1hp' },
						{ label: '2 HP', href: '/solar-pumps/2hp' },
						{ label: '3 HP', href: '/solar-pumps/3hp' },
						{ label: '5 HP', href: '/solar-pumps/5hp' },
						{ label: '7.5 HP', href: '/solar-pumps/7-5hp' },
						{ label: '10 HP', href: '/solar-pumps/10hp' },
						{ label: 'Borewell', href: '/solar-pumps/borewell' },
						{ label: 'BLDC', href: '/solar-pumps/bldc' },
						{ label: 'Controller', href: '/solar-pumps/controller' },
						{ label: 'For Home', href: '/solar-pumps/for-home' },
						{ label: 'KUSUM Yojana', href: '/solar-pumps/kusum-yojana' },
						{ label: 'Types', href: '/solar-pumps/types' },
						{ label: 'AC Pump', href: '/solar-pumps/ac-pump' },
						{ label: 'DC Pump', href: '/solar-pumps/dc-pump' },
						{ label: 'For Agriculture', href: '/solar-pumps/for-agriculture' },
						{ label: 'Sizing', href: '/solar-pumps/sizing' },
						{ label: 'Maintenance', href: '/solar-pumps/maintenance' }
					],
					dynamic: [
						{ label: 'Brand — Shakti', href: '/solar-pumps/shakti', type: 'brand' },
						{ label: 'Product — Shakti SSP-5HP', href: '/solar-pumps/shakti/ssp-5hp-ac', type: 'product' }
					]
				},
				{
					name: '1.6 Solar Inverters',
					pillar: { label: 'Solar Inverters', href: '/solar-inverters' },
					clusters: [
						{ label: 'Price', href: '/solar-inverters/price' },
						{ label: 'Types', href: '/solar-inverters/types' },
						{ label: 'On-Grid', href: '/solar-inverters/on-grid' },
						{ label: 'Off-Grid', href: '/solar-inverters/off-grid' },
						{ label: 'Hybrid', href: '/solar-inverters/hybrid' },
						{ label: 'Micro Inverter', href: '/solar-inverters/micro-inverter' },
						{ label: 'String Inverter', href: '/solar-inverters/string-inverter' },
						{ label: 'Hybrid Inverter', href: '/solar-inverters/hybrid-inverter' },
						{ label: 'On-Grid Inverter', href: '/solar-inverters/on-grid-inverter' },
						{ label: 'Off-Grid Inverter', href: '/solar-inverters/off-grid-inverter' },
						{ label: 'Sizing', href: '/solar-inverters/sizing' },
						{ label: 'For Home', href: '/solar-inverters/for-home' },
						{ label: 'For Commercial', href: '/solar-inverters/for-commercial' }
					],
					dynamic: [
						{ label: 'Brand — Microtek', href: '/solar-inverters/microtek', type: 'brand' },
						{ label: 'Product — Growatt MIC-3000TL', href: '/solar-inverters/growatt/mic-3000tl', type: 'product' }
					]
				},
				{
					name: '1.7 Solar Financing',
					pillar: { label: 'Solar Financing', href: '/solar-financing' },
					clusters: [
						{ label: 'Solar Loan', href: '/solar-financing/solar-loan' },
						{ label: 'EMI', href: '/solar-financing/emi' },
						{ label: 'Free Solar Scheme', href: '/solar-financing/free-solar-scheme' },
						{ label: 'ROI', href: '/solar-financing/roi' },
						{ label: 'EMI Options', href: '/solar-financing/emi-options' },
						{ label: 'Interest Rates', href: '/solar-financing/interest-rates' },
						{ label: 'Eligibility', href: '/solar-financing/eligibility' },
						{ label: 'Documents Required', href: '/solar-financing/documents-required' },
						{ label: 'Payback Period', href: '/solar-financing/payback-period' },
						{ label: 'Lease vs Loan', href: '/solar-financing/lease-vs-loan' },
						{ label: 'Commercial Financing', href: '/solar-financing/commercial-financing' },
						{ label: 'Green Bonds', href: '/solar-financing/green-bonds' }
					],
					dynamic: [
						{ label: 'Bank — SBI', href: '/solar-financing/sbi', type: 'bank' },
						{ label: 'Bank — HDFC', href: '/solar-financing/hdfc', type: 'bank' }
					]
				}
			]
		},
		{
			name: '2. Geographic Pages',
			routes: [
				{ label: 'All-India Hub', href: '/in/solar' },
				{ label: 'State — Maharashtra', href: '/in/solar/maharashtra' },
				{ label: 'State — Karnataka', href: '/in/solar/karnataka' },
				{ label: 'District — Pune', href: '/in/solar/maharashtra/pune' },
				{ label: 'District — Bengaluru', href: '/in/solar/karnataka/bengaluru' },
				{ label: 'City — Kothrud', href: '/in/solar/maharashtra/pune/kothrud' },
				{ label: 'Brand × District — Tata Solar in Pune', href: '/in/solar/maharashtra/pune/tata-solar' },
				{ label: 'Size × District — 3kW in Pune', href: '/in/solar/maharashtra/pune/3kw-solar-system' }
			]
		},
		{
			name: '3. Entity Pages',
			routes: [
				{ label: 'Get Quotes', href: '/in/get-quotes' },
				{ label: 'Installer — Sunspark Energy Pune', href: '/in/installer/sunspark-energy-pune' },
				{ label: 'Project — 5kW Kothrud', href: '/in/project/5kw-kothrud-pune-march-2025' },
				{ label: 'Author — Rahul Sharma', href: '/in/authors/rahul-sharma' }
			]
		},
		{
			name: '4. Tools',
			routes: [
				{ label: 'Solar Calculator', href: '/in/tools/solar-calculator' },
				{ label: 'EMI Calculator', href: '/in/tools/emi-calculator' },
				{ label: 'Subsidy Checker', href: '/in/tools/subsidy-checker' }
			]
		},
		{
			name: '5. B2B / Partners',
			routes: [
				{ label: 'Partner Landing', href: '/in/partners' },
				{ label: 'Partner Join', href: '/in/partners/join' },
				{ label: 'Partner Join — Pune', href: '/in/partners/join/pune' },
				{ label: 'Partner Join — Bengaluru', href: '/in/partners/join/bengaluru' }
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
