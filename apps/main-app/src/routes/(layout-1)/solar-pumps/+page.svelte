<script lang="ts">
	import PillarPage from '$lib/components/seo/PillarPage.svelte';
	import { breadcrumbLD, faqLD } from '$lib/seo';

	let { data } = $props();

	const breadcrumb = $derived(breadcrumbLD([
		{ name: 'Home', url: 'https://solarvipani.com' },
		{ name: 'Solar Pumps', url: 'https://solarvipani.com/solar-pumps' }
	]));

	const faqItems = $derived(data.pillarData.faq ?? []);
	const faqSchema = $derived(faqItems.length > 0 ? faqLD(faqItems) : null);
</script>

<svelte:head>
	<title>{data.pillarData.meta_title}</title>
	<meta name="description" content={data.pillarData.meta_description} />
	<link rel="canonical" href="https://solarvipani.com/solar-pumps" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}<\u002Fscript>`}
	{#if faqSchema}
		{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}<\u002Fscript>`}
	{/if}
</svelte:head>

<PillarPage
	country="in"
	pillarData={data.pillarData}
	clusters={data.clusters}
	stats={data.stats}
/>
