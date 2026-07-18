<script lang="ts">
	import HeroVideoBanner from '$lib/in/components/seo/HeroVideoBanner.svelte';
	import InstallerCard from '$lib/in/components/seo/InstallerCard.svelte';
	import ProjectGallery from '$lib/in/components/seo/ProjectGallery.svelte';
	import SubsidySection from '$lib/in/components/SubsidySection.svelte';
	import RecommendedSolarSystems from '$lib/in/components/RecommendedSolarSystems.svelte';
	import LeadFormSection from '$lib/in/components/LeadFormSection.svelte';
	import QuoteModal from '$lib/in/components/QuoteModal.svelte';
	import { breadcrumbLD, localBusinessLD, faqLD } from '$lib/seo';
	import { generateDistrictFAQ } from '$lib/in/faqData';

	let { data } = $props();

	const country = $derived(data.country);
	const cc = $derived(country.code);

	const COMMON_SIZES = [1, 2, 3, 5, 10];

	let isModalOpen = $state(false);

	// FAQ copy is India-specific (subsidy, ₹) — gated to IN until localized.
	const faqItems = $derived(
		country.features.seoContentFamilies
			? generateDistrictFAQ(data.level2, data.level1, data.installerCount)
			: []
	);

	const breadcrumb = $derived(breadcrumbLD([
		{ name: 'Home', url: `https://solarvipani.com/${cc}` },
		{ name: 'Solar', url: `https://solarvipani.com/${cc}/solar` },
		{ name: data.level1, url: `https://solarvipani.com/${cc}/solar/${data.level1Slug}` },
		{ name: data.level2, url: `https://solarvipani.com/${cc}/solar/${data.level1Slug}/${data.level2Slug}` }
	]));

	const businessLDs = $derived(
		(data.businesses || []).slice(0, 5).map((b: Record<string, unknown>) =>
			localBusinessLD({
				name: b.businessname as string,
				slug: b.slug as string,
				address: (b.address as string) || '',
				city: (b.city as string) || data.level2,
				state: data.level1,
				postalCode: data.postalCode || '',
				phone: b.phonenumber as string | undefined
			})
		)
	);

	const faqSchema = $derived(faqLD(faqItems));

	const title = $derived(
		`Top Solar Panel Installers in ${data.level2}, ${data.level1} | Solar Vipani`
	);

	const description = $derived(
		`Find ${data.installerCount} verified solar panel installers in ${data.level2}, ${data.level1}. Compare quotes, view recent projects, and get the best solar installation deals.`
	);

	const canonicalUrl = $derived(`https://solarvipani.com/${cc}/solar/${data.level1Slug}/${data.level2Slug}`);

	const citiesServed = $derived(
		data.cities.filter((c: { hasBusiness: boolean }) => c.hasBusiness).length
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content="https://solarvipani.com/logo.webp" />
	<meta property="og:image:alt" content="Solar panel installers in {data.level2}" />
	<meta property="og:site_name" content="Solar Vipani" />
	<meta property="og:locale" content={country.locale.replace('-', '_')} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@solarvipani" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="https://solarvipani.com/logo.webp" />
	<meta name="twitter:image:alt" content="Solar panel installers in {data.level2}" />

	<meta name="geo.region" content={cc.toUpperCase()} />
	<meta name="geo.placename" content="{data.level2}, {data.level1}" />

	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}<\u002Fscript>`}
	{#each businessLDs as ld}
		{@html `<script type="application/ld+json">${JSON.stringify(ld)}<\u002Fscript>`}
	{/each}
	{#if faqItems.length > 0}
		{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}<\u002Fscript>`}
	{/if}
</svelte:head>

<!-- Hero -->
<HeroVideoBanner title="Solar Panel Installers in {data.level2}, {data.level1}" />

<div class="max-w-6xl mx-auto px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
		<ol class="flex flex-wrap gap-1">
			<li><a href="/{cc}" class="hover:text-primary">Home</a> /</li>
			<li><a href="/{cc}/solar" class="hover:text-primary">Solar</a> /</li>
			<li><a href="/{cc}/solar/{data.level1Slug}" class="hover:text-primary">{data.level1}</a> /</li>
			<li class="text-foreground font-medium">{data.level2}</li>
		</ol>
	</nav>

	<!-- Snapshot bar -->
	<div class="flex flex-wrap gap-4 mb-8 text-sm">
		<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">{data.installerCount} Installers</span>
		<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">{citiesServed} Cities</span>
	</div>

	<!-- Local social proof -->
	{#if data.level2LeadCount >= 3}
		<p class="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 mb-8 text-center font-medium">
			<span class="text-primary font-bold">{data.level2LeadCount.toLocaleString(country.locale)}</span>
			customers from {data.level2} have started their solar journey with Solar Vipani.
		</p>
	{/if}

	<!-- Lead Form CTA -->
	<LeadFormSection city={data.level2} hasBusinesses={true} country={data.country} />

	<!-- Installer Cards -->
	<h2 class="text-2xl font-semibold text-primary mb-4">
		Top Solar Installers in {data.level2}
	</h2>
	<InstallerCard businesses={data.businesses} countryCode={cc} />

	<!-- Recent Projects -->
	{#if country.features.projects && data.recentProjects?.length > 0}
		<ProjectGallery projects={data.recentProjects} locationName={data.level2} />
	{/if}

	<!-- Subsidy -->
	{#if country.features.subsidy}
		<SubsidySection city={data.level2} pageUrl={canonicalUrl} />
	{/if}

	<!-- Get Quotes CTA -->
	{#if cc === 'in'}
		<div class="text-center mb-8">
			<a
				href="/{cc}/get-quotes/"
				class="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
			>
				Get Free Solar Quotes in {data.level2}
			</a>
		</div>
	{/if}

	<!-- Solar Guides -->
	{#if country.features.seoContentFamilies}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-4">Solar Guides</h2>
			<p class="text-sm text-muted-foreground mb-3">
				Not sure where to start? These guides can help you make an informed decision.
			</p>
			<div class="flex flex-wrap gap-2">
				<a
					href="/{cc}/rooftop-solar/cost/"
					class="bg-muted hover:bg-accent/20 text-sm rounded-lg px-3 py-1.5 transition-colors"
				>
					Solar System Cost Guide
				</a>
				<a
					href="/{cc}/solar-subsidy/pm-surya-ghar/"
					class="bg-muted hover:bg-accent/20 text-sm rounded-lg px-3 py-1.5 transition-colors"
				>
					PM Surya Ghar Subsidy
				</a>
				<a
					href="/{cc}/solar-installation/process/"
					class="bg-muted hover:bg-accent/20 text-sm rounded-lg px-3 py-1.5 transition-colors"
				>
					Installation Process
				</a>
			</div>
		</section>
	{/if}

	<!-- Recommended Systems -->
	{#if country.features.seoContentFamilies}
		<RecommendedSolarSystems city={data.level2} pageUrl={canonicalUrl} />
	{/if}

	<!-- FAQ -->
	{#if faqItems.length > 0}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-4">
				Frequently Asked Questions — Solar in {data.level2}
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
				Cities in {data.level2}
			</h2>
			<div class="flex flex-wrap gap-2">
				{#each data.cities as city (city.name)}
					{#if city.hasBusiness}
						<a
							href="/{cc}/solar/{data.level1Slug}/{data.level2Slug}/{city.slug}"
							class="bg-muted hover:bg-accent/20 text-sm rounded-lg px-3 py-1.5 transition-colors"
						>
							{city.name}
						</a>
					{:else}
						<span class="bg-muted text-sm text-muted-foreground rounded-lg px-3 py-1.5">
							{city.name}
						</span>
					{/if}
				{/each}
			</div>
		</section>
	{/if}

	<!-- Size links -->
	{#if country.features.seoContentFamilies}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-4">
				Solar Systems by Size in {data.level2}
			</h2>
			<div class="flex flex-wrap gap-2">
				{#each COMMON_SIZES as size}
					<a
						href="/{cc}/solar/{data.level1Slug}/{data.level2Slug}/{size}kw-solar-system"
						class="bg-muted hover:bg-accent/20 text-sm rounded-lg px-3 py-1.5 transition-colors"
					>
						{size}kW Solar System
					</a>
				{/each}
			</div>
		</section>
	{/if}
</div>

<QuoteModal {isModalOpen} />
