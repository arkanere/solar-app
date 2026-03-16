<script lang="ts">
	import InstallerCard from '$lib/in/components/seo/InstallerCard.svelte';
	import ProjectGallery from '$lib/in/components/seo/ProjectGallery.svelte';
	import SubsidySection from '$lib/in/components/SubsidySection.svelte';
	import RecommendedSolarSystems from '$lib/in/components/RecommendedSolarSystems.svelte';
	import LeadFormSection from '$lib/in/components/LeadFormSection.svelte';
	import QuoteModal from '$lib/in/components/QuoteModal.svelte';
	import { breadcrumbLD, localBusinessLD, faqLD } from '$lib/seo';
	import { generateDistrictFAQ } from '$lib/in/faqData';

	let { data } = $props();

	const COMMON_SIZES = [1, 2, 3, 5, 10];

	let isModalOpen = $state(false);

	const faqItems = $derived(generateDistrictFAQ(data.district, data.state, data.installerCount));

	const breadcrumb = $derived(breadcrumbLD([
		{ name: 'Home', url: 'https://solarvipani.com/in' },
		{ name: 'Solar', url: 'https://solarvipani.com/in/solar' },
		{ name: data.state, url: `https://solarvipani.com/in/solar/${data.stateSlug}` },
		{ name: data.district, url: `https://solarvipani.com/in/solar/${data.stateSlug}/${data.districtSlug}` }
	]));

	const businessLDs = $derived(
		(data.businesses || []).slice(0, 5).map((b: Record<string, unknown>) =>
			localBusinessLD({
				name: b.businessname as string,
				slug: b.slug as string,
				address: (b.address as string) || '',
				city: (b.city as string) || data.district,
				state: data.state,
				postalCode: data.postalCode || '',
				phone: b.phonenumber as string | undefined
			})
		)
	);

	const faqSchema = $derived(faqLD(faqItems));

	function toSlug(str: string): string {
		return str.toLowerCase().replace(/\s+/g, '-');
	}
</script>

<svelte:head>
	<title>Solar Panel Installers in {data.district}, {data.state} | Solar Vipani</title>
	<meta name="description" content="Find {data.installerCount} verified solar panel installers in {data.district}, {data.state}. Compare quotes, view recent projects, and get the best solar installation deals." />
	<link rel="canonical" href="https://solarvipani.com/in/solar/{data.stateSlug}/{data.districtSlug}" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`}
	{#each businessLDs as ld}
		{@html `<script type="application/ld+json">${JSON.stringify(ld)}</script>`}
	{/each}
	{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
		<ol class="flex flex-wrap gap-1">
			<li><a href="/in" class="hover:text-primary">Home</a> /</li>
			<li><a href="/in/solar" class="hover:text-primary">Solar</a> /</li>
			<li><a href="/in/solar/{data.stateSlug}" class="hover:text-primary">{data.state}</a> /</li>
			<li class="text-foreground font-medium">{data.district}</li>
		</ol>
	</nav>

	<!-- Hero -->
	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">
		Solar Panel Installers in {data.district}, {data.state}
	</h1>

	<!-- Snapshot bar -->
	<div class="flex flex-wrap gap-4 mb-8 text-sm">
		<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">{data.installerCount} Installers</span>
		<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">{data.cities.length} Cities</span>
		{#if data.postalCode}
			<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">PIN: {data.postalCode}</span>
		{/if}
	</div>

	<!-- Lead Form CTA -->
	<LeadFormSection city={data.district} hasBusinesses={data.businesses?.length > 0} />

	<!-- Installer Cards -->
	{#if data.businesses?.length > 0}
		<h2 class="text-2xl font-semibold text-primary mb-4">
			Top Solar Installers in {data.district}
		</h2>
		<InstallerCard businesses={data.businesses} />
	{/if}

	<!-- Recent Projects -->
	{#if data.recentProjects?.length > 0}
		<ProjectGallery projects={data.recentProjects} locationName={data.district} />
	{/if}

	<!-- Subsidy -->
	<SubsidySection city={data.district} onGetQuote={() => (isModalOpen = true)} />

	<!-- Recommended Systems -->
	<RecommendedSolarSystems />

	<!-- FAQ -->
	{#if faqItems.length > 0}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-4">
				Frequently Asked Questions — Solar in {data.district}
			</h2>
			<div class="space-y-4">
				{#each faqItems as faq}
					<details class="border rounded-lg p-4 group">
						<summary class="font-medium cursor-pointer group-open:mb-2">{faq.question}</summary>
						<p class="text-muted-foreground text-sm">{faq.answer}</p>
					</details>
				{/each}
			</div>
		</section>
	{/if}

	<!-- City links -->
	{#if data.cities.length > 0}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-4">
				Cities in {data.district}
			</h2>
			<div class="flex flex-wrap gap-2">
				{#each data.cities as city}
					<a
						href="/in/solar/{data.stateSlug}/{data.districtSlug}/{toSlug(city)}"
						class="bg-muted hover:bg-accent/20 text-sm rounded-lg px-3 py-1.5 transition-colors"
					>
						{city}
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Nearby districts -->
	{#if data.nearbyDistricts.length > 0}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-4">
				Nearby Districts
			</h2>
			<div class="flex flex-wrap gap-2">
				{#each data.nearbyDistricts as nd}
					<a
						href="/in/solar/{data.stateSlug}/{nd.slug}"
						class="bg-muted hover:bg-accent/20 text-sm rounded-lg px-3 py-1.5 transition-colors"
					>
						{nd.name} ({nd.installerCount})
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Size links -->
	<section class="mb-8">
		<h2 class="text-2xl font-semibold text-primary mb-4">
			Solar Systems by Size in {data.district}
		</h2>
		<div class="flex flex-wrap gap-2">
			{#each COMMON_SIZES as size}
				<a
					href="/in/solar/{data.stateSlug}/{data.districtSlug}/{size}kw-solar-system"
					class="bg-muted hover:bg-accent/20 text-sm rounded-lg px-3 py-1.5 transition-colors"
				>
					{size}kW Solar System
				</a>
			{/each}
		</div>
	</section>
</div>

<QuoteModal {isModalOpen} />
