<script lang="ts">
	import GeoDirectory from '$lib/components/seo/GeoDirectory.svelte';
	import { contentUrl } from '$lib/countries/urls';
	import { breadcrumbLD } from '$lib/seo';

	let { data } = $props();

	const country = $derived(data.country);
	const cc = $derived(country.code);
	const level1Label = $derived(country.levels.level1);

	const breadcrumb = $derived(
		breadcrumbLD([
			{ name: 'Home', url: `https://solarvipani.com` },
			{ name: 'Solar', url: `https://solarvipani.com/${cc}/solar` }
		])
	);

	const directoryItems = $derived(
		data.level1s.map((s: { name: string; slug: string; installerCount: number }) => ({
			...s,
			href: `/${cc}/solar/${s.slug}`
		}))
	);

	const level2Label = $derived(country.levels.level2);
	const level1Coverage = $derived(
		data.totalLevel1Count ? Math.round((data.level1Count / data.totalLevel1Count) * 100) : 0
	);
</script>

<svelte:head>
	<title>Solar Panel Installers in {country.name} — Browse by {level1Label.singular} | Solar Vipani</title>
	<meta name="description" content="Find {data.totalInstallers} verified solar panel installers across {data.level1Count} {level1Label.plural.toLowerCase()} in {country.name}. Browse by {level1Label.singular.toLowerCase()} and {country.levels.level2.singular.toLowerCase()} to compare quotes and get the best solar deals." />
	<link rel="canonical" href="https://solarvipani.com/{cc}/solar" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}<\u002Fscript>`}
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
		<ol class="flex flex-wrap gap-1">
			<li><a href="/" class="hover:text-primary-strong">Home</a> /</li>
			<li class="text-foreground font-medium">Solar</li>
		</ol>
	</nav>

	<!-- Hero -->
	<h1 class="text-3xl md:text-4xl font-bold text-primary-strong mb-4">
		Solar Panel Installers in {country.name}
	</h1>
	<p class="text-muted-foreground mb-6 max-w-2xl">
		Find verified solar panel installers near you. Browse by {level1Label.singular.toLowerCase()} and {country.levels.level2.singular.toLowerCase()} to compare quotes, view recent projects, and go solar with confidence.
	</p>

	<!-- Stats bar -->
	<div class="flex flex-wrap gap-4 mb-4 text-sm">
		<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">{data.totalInstallers} Installers</span>
		<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">
			{data.level1Count} of {data.totalLevel1Count} {level1Label.plural}
		</span>
		<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">
			{data.coveredLevel2Count} {level2Label.plural}
		</span>
	</div>

	<!-- National coverage -->
	<div class="bg-accent/10 rounded-lg p-4 mb-8">
		<p class="text-sm">
			<strong class="text-primary-strong">Nationwide coverage:</strong>
			verified installers in {data.level1Count} of {data.totalLevel1Count}
			{level1Label.plural.toLowerCase()} ({level1Coverage}%), across {data.coveredLevel2Count}
			{level2Label.plural.toLowerCase()}.
		</p>
	</div>

	<!-- Level1 directory -->
	<GeoDirectory items={directoryItems} title="Browse by {level1Label.singular}" coverageLabel={level2Label.plural.toLowerCase()} />

	<!-- Solar Guides -->
	{#if country.features.seoContentFamilies}
		<section class="mb-8">
			<h2 class="text-lg font-semibold text-primary-strong mb-3">Solar Guides</h2>
			<div class="flex flex-wrap gap-2">
				<a href={contentUrl("/rooftop-solar/")} class="bg-muted hover:bg-accent/20 text-sm rounded-lg px-3 py-1.5 transition-colors">
					Rooftop Solar Guide
				</a>
				<a href={contentUrl("/solar-subsidy/")} class="bg-muted hover:bg-accent/20 text-sm rounded-lg px-3 py-1.5 transition-colors">
					Solar Subsidy Guide
				</a>
				<a href={contentUrl("/solar-financing/")} class="bg-muted hover:bg-accent/20 text-sm rounded-lg px-3 py-1.5 transition-colors">
					Solar Financing
				</a>
				<a href={contentUrl("/solar-panels/")} class="bg-muted hover:bg-accent/20 text-sm rounded-lg px-3 py-1.5 transition-colors">
					Solar Panels
				</a>
			</div>
		</section>
	{/if}

	<!-- CTA -->
	{#if cc === 'in'}
		<div class="text-center mt-8 mb-8">
			<a
				href="/{cc}/get-quotes/"
				class="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
			>
				Get Free Solar Quotes
			</a>
		</div>
	{/if}
</div>
