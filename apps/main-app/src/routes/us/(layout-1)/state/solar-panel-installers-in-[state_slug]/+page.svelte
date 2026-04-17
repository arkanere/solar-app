<script>
	import GeoDirectory from '$lib/in/components/seo/GeoDirectory.svelte';
	import { page } from '$app/stores';
	import { formatCountyStateUrl } from '$lib/us/stateAbbreviations';

	let data = $derived($page.data);

	const directoryItems = $derived(
		(data.counties || []).map((c) => ({
			...c,
			href: `/us/county/${formatCountyStateUrl(c.name, data.state)}`
		}))
	);
</script>

<svelte:head>
	<title>Solar Panel Installers in {data.state} — Browse by County | Solar Vipani</title>
	<meta name="description" content="Find {data.installerCount} verified solar panel installers across {data.countyCount} counties in {data.state}. Browse by county to compare quotes." />
	<link rel="canonical" href="https://solarvipani.com/us/state/solar-panel-installers-in-{data.state?.toLowerCase().replace(/\s+/g, '-')}" />
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
		<ol class="flex flex-wrap gap-1">
			<li><a href="/us" class="hover:text-primary">Home</a> /</li>
			<li><a href="/us/solar-panel-installer-directory" class="hover:text-primary">Directory</a> /</li>
			<li class="text-foreground font-medium">{data.state}</li>
		</ol>
	</nav>

	<!-- Hero -->
	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">
		Solar Panel Installers in {data.state}
	</h1>
	<p class="text-muted-foreground mb-6 max-w-2xl">
		Browse verified solar panel installers in {data.state} by county. Compare quotes, view recent projects, and find the best solar companies near you.
	</p>

	<!-- Stats bar -->
	<div class="flex flex-wrap gap-4 mb-8 text-sm">
		<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">{data.installerCount} Installers</span>
		<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">{data.countyCount} Counties</span>
	</div>

	<!-- County directory -->
	<GeoDirectory items={directoryItems} title="Browse by County" />

	<!-- CTA -->
	<div class="text-center mt-8 mb-8">
		<a
			href="/us/business-listing"
			class="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
		>
			View All Installers
		</a>
	</div>
</div>
