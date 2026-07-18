<script lang="ts">
	import GeoDirectory from '$lib/in/components/seo/GeoDirectory.svelte';
	import { breadcrumbLD, faqLD } from '$lib/seo';
	import { generateStateFAQ } from '$lib/in/faqData';

	let { data } = $props();

	const country = $derived(data.country);
	const cc = $derived(country.code);
	const level2Label = $derived(country.levels.level2);

	// FAQ copy is India-specific (subsidy, ₹) — gated to IN until localized.
	const faqItems = $derived(
		country.features.seoContentFamilies ? generateStateFAQ(data.level1, data.level2Count) : []
	);

	const breadcrumb = $derived(breadcrumbLD([
		{ name: 'Home', url: `https://solarvipani.com/${cc}` },
		{ name: 'Solar', url: `https://solarvipani.com/${cc}/solar` },
		{ name: data.level1, url: `https://solarvipani.com/${cc}/solar/${data.level1Slug}` }
	]));

	const faqSchema = $derived(faqLD(faqItems));

	const directoryItems = $derived(
		data.level2s.map((d: { name: string; slug: string; installerCount: number }) => ({
			...d,
			href: `/${cc}/solar/${data.level1Slug}/${d.slug}/`
		}))
	);
</script>

<svelte:head>
	<title>Solar Panel Installers in {data.level1} — {level2Label.plural} & Cities | Solar Vipani</title>
	<meta name="description" content="Find {data.installerCount} verified solar installers across {data.level2Count} {level2Label.plural.toLowerCase()} in {data.level1}. Browse by {level2Label.singular.toLowerCase()} to compare quotes and get the best solar deals." />
	<link rel="canonical" href="https://solarvipani.com/{cc}/solar/{data.level1Slug}" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}<\u002Fscript>`}
	{#if faqItems.length > 0}
		{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}<\u002Fscript>`}
	{/if}
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
		<ol class="flex flex-wrap gap-1">
			<li><a href="/{cc}/" class="hover:text-primary">Home</a> /</li>
			<li><a href="/{cc}/solar/" class="hover:text-primary">Solar</a> /</li>
			<li class="text-foreground font-medium">{data.level1}</li>
		</ol>
	</nav>

	<!-- Hero -->
	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">
		Solar Panel Installers in {data.level1}
	</h1>

	<!-- Stats bar -->
	<div class="flex flex-wrap gap-4 mb-8 text-sm">
		<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">{data.installerCount} Installers</span>
		<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">{data.level2Count} {level2Label.plural}</span>
	</div>

	<!-- Subsidy summary -->
	{#if country.features.subsidy && data.subsidy}
		<div class="bg-accent/10 rounded-lg p-4 mb-8">
			<p class="text-sm">
				<strong class="text-primary">{data.level1} Solar Subsidy:</strong> Residents can avail the PM Surya Ghar Yojana subsidy of up to ₹78,000.
				<a href="/{cc}/solar-subsidy/{data.subsidy.state_slug}/" class="text-primary hover:underline ml-1">View details →</a>
			</p>
		</div>
	{/if}

	<!-- Get Quotes CTA -->
	{#if cc === 'in'}
		<div class="text-center mb-8">
			<a
				href="/{cc}/get-quotes/"
				class="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
			>
				Get Free Solar Quotes in {data.level1}
			</a>
		</div>
	{/if}

	<!-- Level2 directory -->
	<GeoDirectory items={directoryItems} title="Browse by {level2Label.singular}" />

	<!-- FAQ -->
	{#if faqItems.length > 0}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-4">
				Frequently Asked Questions — Solar in {data.level1}
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
</div>
