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
	<title>Solar Panel Installer Directory | Find Trusted Local Installers - Solar Vipani</title>
	<meta
		name="description"
		content="Find {data.totalInstallers} trusted solar panel installers across {data.stateCount} states. Browse by state and county to connect with verified experts."
	/>
	<link rel="canonical" href="https://solarvipani.com/us/solar-panel-installer-directory" />
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
		<ol class="flex flex-wrap gap-1">
			<li><a href="/us" class="hover:text-primary">Home</a> /</li>
			<li class="text-foreground font-medium">Installer Directory</li>
		</ol>
	</nav>

	<!-- Hero -->
	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">
		Solar Panel Installer Directory
	</h1>
	<p class="text-muted-foreground mb-6 max-w-2xl">
		Find trusted local solar installers across the United States. Browse by state and county to compare services, view recent projects, and connect with verified experts.
	</p>

	<!-- Stats bar -->
	<div class="flex flex-wrap gap-4 mb-8 text-sm">
		<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">{data.totalInstallers} Installers</span>
		<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">{data.stateCount} States</span>
	</div>

	<!-- State directory -->
	<GeoDirectory items={directoryItems} title="Browse by State" />
</div>
