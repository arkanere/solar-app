<script lang="ts">
	const phases = [
		{
			name: 'Phase 1 — Geographic',
			routes: [
				{ label: 'Solar Index (all states)', href: '/in/solar/' },
				{ label: 'State — Maharashtra', href: '/in/solar/maharashtra/' },
				{ label: 'State — Karnataka', href: '/in/solar/karnataka/' },
				{ label: 'District — Pune', href: '/in/solar/maharashtra/pune/' },
				{ label: 'District — Bangalore', href: '/in/solar/karnataka/bangalore/' },
				{ label: 'City/Sub-slug — Pune', href: '/in/solar/maharashtra/pune/pune/' }
			]
		},
		{
			name: 'Phase 2 — Entity',
			routes: [
				{ label: 'Get Quotes', href: '/in/get-quotes/' },
				{ label: 'Installer (dynamic slug)', href: '/in/installer/' },
				{ label: 'Project (dynamic id)', href: '/in/project/' }
			]
		},
		{
			name: 'Phase 3 — Topical Pillars',
			routes: [
				{ label: 'Rooftop Solar', href: '/in/rooftop-solar/' },
				{ label: 'Solar Installation', href: '/in/solar-installation/' },
				{ label: 'Solar Panels', href: '/in/solar-panels/' },
				{ label: 'Solar Inverters', href: '/in/solar-inverters/' },
				{ label: 'Solar Pumps', href: '/in/solar-pumps/' },
				{ label: 'Solar Subsidy', href: '/in/solar-subsidy/' },
				{ label: 'Solar Financing', href: '/in/solar-financing/' }
			]
		},
		{
			name: 'Phase 4 — Blog & Authors',
			routes: [
				{ label: 'Blog Index', href: '/in/blog/' },
				{ label: 'Blog Post (dynamic slug)', href: '/in/blog/' },
				{ label: 'Author Profile (dynamic slug)', href: '/in/authors/' }
			]
		},
		{
			name: 'Phase 5 — Tools',
			routes: [
				{ label: 'Tools Hub', href: '/in/tools/' },
				{ label: 'Solar Calculator', href: '/in/tools/solar-calculator/' },
				{ label: 'EMI Calculator', href: '/in/tools/emi-calculator/' },
				{ label: 'Subsidy Checker', href: '/in/tools/subsidy-checker/' }
			]
		},
		{
			name: 'Phase 6 — Partners',
			routes: [
				{ label: 'Partner Landing', href: '/in/partners/' },
				{ label: 'Partner Join', href: '/in/partners/join/' },
				{ label: 'Partner Join — Pune', href: '/in/partners/join/pune/' },
				{ label: 'Partner Join — Bangalore', href: '/in/partners/join/bangalore/' },
				{ label: 'Partner Thank You', href: '/in/partners/join/thank-you/' }
			]
		}
	];
</script>

<svelte:head>
	<title>SEO Routes Index | Dev</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8">
	<h1 class="mb-2 text-3xl font-bold text-foreground">SEO Routes Index</h1>
	<p class="mb-8 text-sm text-muted-foreground">Quick-access page for testing all SEO phase routes. Not indexed.</p>

	{#each phases as phase}
		<section class="mb-6">
			<h2 class="mb-3 text-lg font-semibold text-primary">{phase.name}</h2>
			<ul class="space-y-1">
				{#each phase.routes as route}
					<li>
						<a href={route.href} class="inline-flex items-center gap-2 text-sm hover:text-primary hover:underline">
							<span class="font-mono text-xs text-muted-foreground">{route.href}</span>
							<span class="text-foreground">{route.label}</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>
