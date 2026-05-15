<script lang="ts">
	import InstallerCard from '$lib/in/components/seo/InstallerCard.svelte';
	import ProjectGallery from '$lib/in/components/seo/ProjectGallery.svelte';
	import SubsidySection from '$lib/in/components/SubsidySection.svelte';
	import LeadFormSection from '$lib/in/components/LeadFormSection.svelte';
	import QuoteModal from '$lib/in/components/QuoteModal.svelte';
	import { breadcrumbLD, localBusinessLD, faqLD } from '$lib/seo';
	import { generateFAQ } from '$lib/in/faqData';

	// Union return type from load — access page-type-specific fields via d
	let { data } = $props();
	const d = $derived(data as Record<string, any>);

	let isModalOpen = $state(false);

	const isCity = $derived(d.pageType === 'city');
	const isBrand = $derived(d.pageType === 'brand');
	const isSize = $derived(d.pageType === 'size');

	const pageTitle = $derived(
		isCity ? `Solar Panel Installers in ${d.city}, ${d.district}`
		: isBrand ? `${d.brandName} Solar Installers in ${d.district}`
		: `${d.sizeKw}kW Solar System in ${d.district}, ${d.state}`
	);

	const metaDescription = $derived(
		isCity ? `Find ${d.installerCount} solar installers in ${d.city}, ${d.district}. Compare quotes and view recent projects.`
		: isBrand ? `Find ${d.brandName} solar panel installers in ${d.district}, ${d.state}. Compare verified installers.`
		: `Get ${d.sizeKw}kW solar system installed in ${d.district}, ${d.state}. Compare ${d.installerCount} verified installers.`
	);

	const faqItems = $derived(isCity ? generateFAQ(d.city) : []);

	const breadcrumb = $derived(breadcrumbLD([
		{ name: 'Home', url: 'https://solarvipani.com/in' },
		{ name: 'Solar', url: 'https://solarvipani.com/in/solar' },
		{ name: d.state, url: `https://solarvipani.com/in/solar/${d.stateSlug}` },
		{ name: d.district, url: `https://solarvipani.com/in/solar/${d.stateSlug}/${d.districtSlug}` },
		{ name: isCity ? d.city : isBrand ? d.brandName : `${d.sizeKw}kW Solar`,
		  url: `https://solarvipani.com/in/solar/${d.stateSlug}/${d.districtSlug}/${isCity ? d.citySlug : isBrand ? d.brandSlug : `${d.sizeKw}kw-solar-system`}` }
	]));

	const faqSchema = $derived(faqItems.length > 0 ? faqLD(faqItems) : null);

	const businessLDs = $derived(
		(d.businesses || []).slice(0, 5).map((b: Record<string, any>) =>
			localBusinessLD({
				name: b.businessname as string,
				slug: b.slug as string,
				address: (b.address as string) || '',
				city: (b.city as string) || d.district,
				state: d.state,
				postalCode: d.postalCode || '',
				phone: b.phonenumber as string | undefined
			})
		)
	);

	const canonicalSlug = $derived(isCity ? d.citySlug : isBrand ? d.brandSlug : `${d.sizeKw}kw-solar-system`);
	const canonicalUrl = $derived(`https://solarvipani.com/in/solar/${d.stateSlug}/${d.districtSlug}/${canonicalSlug}`);
	const locationName = $derived(isCity ? d.city : d.district);

	const COMMON_SIZES = [1, 2, 3, 5, 10];

	const SUBSIDY_TABLE = [
		{ size: 1, grossCost: '₹65,000–₹80,000', subsidy: '₹30,000', netCost: '₹35,000–₹50,000' },
		{ size: 2, grossCost: '₹1,30,000–₹1,60,000', subsidy: '₹60,000', netCost: '₹70,000–₹1,00,000' },
		{ size: 3, grossCost: '₹1,80,000–₹2,20,000', subsidy: '₹78,000', netCost: '₹1,02,000–₹1,42,000' },
		{ size: 5, grossCost: '₹2,80,000–₹3,50,000', subsidy: '₹78,000', netCost: '₹2,02,000–₹2,72,000' },
		{ size: 10, grossCost: '₹5,50,000–₹7,00,000', subsidy: '₹78,000', netCost: '₹4,72,000–₹6,22,000' },
	];

	const sizeRow = $derived(isSize ? SUBSIDY_TABLE.find(r => r.size === d.sizeKw) : null);
</script>

<svelte:head>
	<title>{pageTitle} | Solar Vipani</title>
	<meta name="description" content={metaDescription} />
	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:title" content="{pageTitle} | Solar Vipani" />
	<meta property="og:description" content={metaDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content="https://solarvipani.com/logo.webp" />
	<meta property="og:image:alt" content="Solar panel installers in {locationName}" />
	<meta property="og:site_name" content="Solar Vipani" />
	<meta property="og:locale" content="en_IN" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@solarvipani" />
	<meta name="twitter:title" content="{pageTitle} | Solar Vipani" />
	<meta name="twitter:description" content={metaDescription} />
	<meta name="twitter:image" content="https://solarvipani.com/logo.webp" />
	<meta name="twitter:image:alt" content="Solar panel installers in {locationName}" />

	<meta name="geo.region" content="IN" />
	<meta name="geo.placename" content="{locationName}, {d.state}" />

	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`}
	{#each businessLDs as ld}
		{@html `<script type="application/ld+json">${JSON.stringify(ld)}</script>`}
	{/each}
	{#if faqSchema}
		{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
	{/if}
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
		<ol class="flex flex-wrap gap-1">
			<li><a href="/in" class="hover:text-primary">Home</a> /</li>
			<li><a href="/in/solar" class="hover:text-primary">Solar</a> /</li>
			<li><a href="/in/solar/{d.stateSlug}" class="hover:text-primary">{d.state}</a> /</li>
			<li><a href="/in/solar/{d.stateSlug}/{d.districtSlug}" class="hover:text-primary">{d.district}</a> /</li>
			<li class="text-foreground font-medium">
				{isCity ? d.city : isBrand ? d.brandName : `${d.sizeKw}kW Solar System`}
			</li>
		</ol>
	</nav>

	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">{pageTitle}</h1>

	<!-- Stats bar -->
	<div class="flex flex-wrap gap-4 mb-8 text-sm">
		<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">{d.installerCount} Installers</span>
		{#if isCity && d.postalCode}
			<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">PIN: {d.postalCode}</span>
		{/if}
		{#if isSize}
			<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">{d.sizeKw}kW System</span>
		{/if}
	</div>

	<!-- Size-specific pricing -->
	{#if isSize}
		<section class="mb-8 bg-accent/10 rounded-lg p-6">
			<h2 class="text-xl font-semibold text-primary mb-4">
				{d.sizeKw}kW Solar System — Estimated Pricing
			</h2>
			{#if sizeRow}
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
					<div class="bg-card rounded-lg p-4">
						<p class="text-sm text-muted-foreground">Gross Cost</p>
						<p class="text-lg font-semibold">{sizeRow.grossCost}</p>
					</div>
					<div class="bg-card rounded-lg p-4">
						<p class="text-sm text-muted-foreground">Central Subsidy</p>
						<p class="text-lg font-semibold text-success">{sizeRow.subsidy}</p>
					</div>
					<div class="bg-card rounded-lg p-4">
						<p class="text-sm text-muted-foreground">Net Cost After Subsidy</p>
						<p class="text-lg font-semibold text-primary">{sizeRow.netCost}</p>
					</div>
				</div>
			{:else}
				<p class="text-muted-foreground">Contact an installer for {d.sizeKw}kW system pricing in {d.district}.</p>
			{/if}
		</section>
	{/if}

	<!-- Size cluster link -->
	{#if isSize}
		<p class="text-sm text-muted-foreground mb-8">
			Understand what a {d.sizeKw}kW system powers →
			<a href="/in/rooftop-solar/{d.sizeKw}kw-system/" class="text-primary hover:underline font-medium">
				Complete {d.sizeKw}kW Solar System Guide
			</a>
		</p>
	{/if}

	<!-- Lead Form -->
	<LeadFormSection city={isCity ? d.city : d.district} hasBusinesses={true} />

	<!-- Installer Cards -->
	<h2 class="text-2xl font-semibold text-primary mb-4">
		{isBrand ? `${d.brandName} ` : ''}Solar Installers in {isCity ? d.city : d.district}
	</h2>
	<InstallerCard businesses={d.businesses} />

	<!-- Recent Projects (city only) -->
	{#if isCity && d.recentProjects?.length > 0}
		<ProjectGallery projects={d.recentProjects} locationName={d.city} />
	{/if}

	<!-- Subsidy (city only) -->
	{#if isCity}
		<SubsidySection city={d.city} />
	{/if}

	<!-- FAQ (city only) -->
	{#if faqItems.length > 0}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-4">
				Frequently Asked Questions — Solar in {d.city}
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

	<!-- Sibling city links -->
	{#if isCity && d.siblingCities?.length > 0}
		<section class="mb-8">
			<h2 class="text-lg font-semibold text-primary mb-3">Nearby Areas</h2>
			<div class="flex flex-wrap gap-2">
				{#each d.siblingCities as sc}
					<a
						href="/in/solar/{d.stateSlug}/{d.districtSlug}/{sc.slug}/"
						class="bg-muted hover:bg-accent/20 text-sm rounded-lg px-3 py-1.5 transition-colors"
					>
						{sc.name}
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Sibling size links -->
	{#if isSize}
		<section class="mb-8">
			<h2 class="text-lg font-semibold text-primary mb-3">Other System Sizes</h2>
			<div class="flex flex-wrap gap-2">
				{#each COMMON_SIZES.filter(s => s !== d.sizeKw) as size}
					<a
						href="/in/solar/{d.stateSlug}/{d.districtSlug}/{size}kw-solar-system/"
						class="bg-muted hover:bg-accent/20 text-sm rounded-lg px-3 py-1.5 transition-colors"
					>
						{size}kW Solar System
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Get Quotes CTA -->
	<div class="text-center mb-8">
		<a
			href="/in/get-quotes/"
			class="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
		>
			Get Free Solar Quotes in {isCity ? d.city : d.district}
		</a>
	</div>

	<!-- Back link -->
	<div class="mt-8">
		<a href="/in/solar/{d.stateSlug}/{d.districtSlug}/" class="text-primary hover:underline text-sm">
			← All installers in {d.district}
		</a>
	</div>
</div>

<QuoteModal {isModalOpen} />
