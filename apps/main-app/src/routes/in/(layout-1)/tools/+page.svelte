<script lang="ts">
	import { breadcrumbLD } from '$lib/seo';
	import { Calculator, Banknote, BadgeIndianRupee } from '@lucide/svelte';

	let { data } = $props();

	const breadcrumb = breadcrumbLD([
		{ name: 'Home', url: 'https://solarvipani.com/in/' },
		{ name: 'Tools', url: 'https://solarvipani.com/in/tools/' }
	]);

	const iconMap: Record<string, typeof Calculator> = {
		calculator: Calculator,
		banknote: Banknote,
		'badge-indian-rupee': BadgeIndianRupee
	};
</script>

<svelte:head>
	<title>Free Solar Tools & Calculators | Solar Vipani</title>
	<meta
		name="description"
		content="Free solar tools: calculate system size & cost, estimate EMI for solar loans, and check government subsidies. Make informed solar decisions."
	/>
	<link rel="canonical" href="https://solarvipani.com/in/tools/" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`}
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<nav class="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
		<ol class="flex flex-wrap gap-1">
			<li><a href="/in/" class="hover:text-primary">Home</a> /</li>
			<li class="text-foreground font-medium">Tools</li>
		</ol>
	</nav>

	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">Solar Tools & Calculators</h1>
	<p class="text-muted-foreground mb-8 max-w-2xl">
		Free tools to help you plan your solar installation. Calculate costs, compare financing, and
		check subsidies — all based on real marketplace data.
	</p>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		{#each data.tools as tool}
			{@const Icon = iconMap[tool.icon]}
			<a
				href={tool.href}
				class="group block rounded-lg border bg-card p-6 shadow-[theme(--shadow-xs)] hover:shadow-[theme(--shadow-card-hover)] transition-shadow"
			>
				<div class="mb-4">
					{#if Icon}
						<Icon class="w-8 h-8 text-primary" />
					{/if}
				</div>
				<h2 class="text-lg font-semibold text-primary group-hover:underline mb-2">
					{tool.title}
				</h2>
				<p class="text-sm text-muted-foreground">{tool.description}</p>
			</a>
		{/each}
	</div>

	<div class="text-center mt-10">
		<a
			href="/in/get-quotes/"
			class="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
		>
			Get Free Solar Quotes
		</a>
	</div>
</div>
