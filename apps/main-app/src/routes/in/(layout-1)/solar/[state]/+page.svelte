<script lang="ts">
	import GeoDirectory from '$lib/in/components/seo/GeoDirectory.svelte';
	import { breadcrumbLD, faqLD } from '$lib/seo';
	import { generateStateFAQ } from '$lib/in/faqData';

	let { data } = $props();

	const faqItems = $derived(generateStateFAQ(data.state, data.districtCount));

	const breadcrumb = $derived(breadcrumbLD([
		{ name: 'Home', url: 'https://solarvipani.com/in' },
		{ name: 'Solar', url: 'https://solarvipani.com/in/solar' },
		{ name: data.state, url: `https://solarvipani.com/in/solar/${data.stateSlug}` }
	]));

	const faqSchema = $derived(faqLD(faqItems));

	const directoryItems = $derived(
		data.districts.map((d: { name: string; slug: string; installerCount: number }) => ({
			...d,
			href: `/in/solar/${data.stateSlug}/${d.slug}/`
		}))
	);
</script>

<svelte:head>
	<title>Solar Panel Installers in {data.state} — Districts & Cities | Solar Vipani</title>
	<meta name="description" content="Find {data.installerCount} verified solar installers across {data.districtCount} districts in {data.state}. Browse by district to compare quotes and get the best solar deals." />
	<link rel="canonical" href="https://solarvipani.com/in/solar/{data.stateSlug}" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
	<!-- Breadcrumb -->
	<nav class="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
		<ol class="flex flex-wrap gap-1">
			<li><a href="/in/" class="hover:text-primary">Home</a> /</li>
			<li><a href="/in/solar/" class="hover:text-primary">Solar</a> /</li>
			<li class="text-foreground font-medium">{data.state}</li>
		</ol>
	</nav>

	<!-- Hero -->
	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">
		Solar Panel Installers in {data.state}
	</h1>

	<!-- Stats bar -->
	<div class="flex flex-wrap gap-4 mb-8 text-sm">
		<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">{data.installerCount} Installers</span>
		<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">{data.districtCount} Districts</span>
	</div>

	<!-- Subsidy summary -->
	{#if data.subsidy}
		<div class="bg-accent/10 rounded-lg p-4 mb-8">
			<p class="text-sm">
				<strong class="text-primary">{data.state} Solar Subsidy:</strong> Residents can avail the PM Surya Ghar Yojana subsidy of up to ₹78,000.
				<a href="/in/solar-subsidy/{data.subsidy.state_slug}/" class="text-primary hover:underline ml-1">View details →</a>
			</p>
		</div>
	{/if}

	<!-- Get Quotes CTA -->
	<div class="text-center mb-8">
		<a
			href="/in/get-quotes/"
			class="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
		>
			Get Free Solar Quotes in {data.state}
		</a>
	</div>

	<!-- District directory -->
	<GeoDirectory items={directoryItems} title="Browse by District" />

	<!-- FAQ -->
	{#if faqItems.length > 0}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-4">
				Frequently Asked Questions — Solar in {data.state}
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
