<script lang="ts">
	import LeadFormSection from '$lib/in/components/LeadFormSection.svelte';
	import { breadcrumbLD } from '$lib/seo';
	import { Users, FolderCheck } from '@lucide/svelte';

	let { data } = $props();

	const breadcrumb = breadcrumbLD([
		{ name: 'Home', url: 'https://solarvipani.com/in/' },
		{ name: 'Get Quotes', url: 'https://solarvipani.com/in/get-quotes/' }
	]);
</script>

<svelte:head>
	<title>Get Free Solar Quotes | Solar Vipani</title>
	<meta name="description" content="Get 2-3 free quotes from verified solar panel installers in India. Compare prices, services, and reviews. {data.installerCount}+ installers, {data.projectCount}+ completed projects." />
	<link rel="canonical" href="https://solarvipani.com/in/get-quotes/" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`}
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
		<ol class="flex flex-wrap gap-1">
			<li><a href="/in/" class="hover:text-primary">Home</a> /</li>
			<li class="text-foreground font-medium">Get Quotes</li>
		</ol>
	</nav>

	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4 text-center">
		Get Free Solar Panel Quotes
	</h1>

	<p class="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
		Connect with verified solar installers in your area. Share your details and receive 2-3 competitive quotes within 24 hours.
	</p>

	<!-- Trust Bar -->
	<div class="flex flex-wrap justify-center gap-6 mb-10">
		<div class="flex items-center gap-2 bg-muted rounded-lg px-4 py-2">
			<Users class="w-5 h-5 text-primary" />
			<span class="font-semibold">{data.installerCount}+</span>
			<span class="text-muted-foreground">Verified Installers</span>
		</div>
		<div class="flex items-center gap-2 bg-muted rounded-lg px-4 py-2">
			<FolderCheck class="w-5 h-5 text-primary" />
			<span class="font-semibold">{data.projectCount}+</span>
			<span class="text-muted-foreground">Verified Projects</span>
		</div>
	</div>

	<!-- Lead Form -->
	<LeadFormSection title="Get Free Solar Quotes" hasBusinesses={true} />
</div>
