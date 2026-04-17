<script>
	import GeoDirectory from '$lib/in/components/seo/GeoDirectory.svelte';
	import { page } from '$app/stores';

	let data = $derived($page.data);

	const directoryItems = $derived(
		(data.states || []).map((s) => ({
			...s,
			href: `/us/state/solar-panel-installers-in-${s.slug}`
		}))
	);
</script>

<svelte:head>
	<title>Solar Panel Installers in the USA — Browse by State | Solar Vipani</title>
	<meta name="description" content="Find {data.totalInstallers} verified solar panel installers across {data.stateCount} states in the United States. Browse by state and county to compare quotes." />
	<link rel="canonical" href="https://solarvipani.com/us/state" />
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
		<ol class="flex flex-wrap gap-1">
			<li><a href="/us" class="hover:text-primary">Home</a> /</li>
			<li class="text-foreground font-medium">States</li>
		</ol>
	</nav>

	<!-- Hero -->
	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">
		Solar Panel Installers in the USA
	</h1>
	<p class="text-muted-foreground mb-6 max-w-2xl">
		Find verified solar panel installers near you. Browse by state and county to compare quotes, view recent projects, and go solar with confidence.
	</p>

	<!-- Stats bar -->
	<div class="flex flex-wrap gap-4 mb-8 text-sm">
		<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">{data.totalInstallers} Installers</span>
		<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">{data.stateCount} States</span>
	</div>

	<!-- State directory -->
	<GeoDirectory items={directoryItems} title="Browse by State" />

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
