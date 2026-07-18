<script lang="ts">
	import PillarPage from '$lib/in/components/seo/PillarPage.svelte';
	import { breadcrumbLD, faqLD } from '$lib/seo';

	let { data } = $props();

	const breadcrumb = $derived(breadcrumbLD([
		{ name: 'Home', url: 'https://solarvipani.com/in' },
		{ name: 'Rooftop Solar', url: 'https://solarvipani.com/in/rooftop-solar' }
	]));

	const faqSchema = $derived(
		data.pillarData.faq?.length > 0 ? faqLD(data.pillarData.faq) : null
	);
</script>

<svelte:head>
	<title>{data.pillarData.meta_title}</title>
	<meta name="description" content={data.pillarData.meta_description} />
	<link rel="canonical" href="https://solarvipani.com/in/rooftop-solar" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}<\u002Fscript>`}
	{#if faqSchema}
		{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}<\u002Fscript>`}
	{/if}
</svelte:head>

<PillarPage
	pillarData={data.pillarData}
	clusters={data.clusters}
	stats={data.stats}
	siblingPillars={[
		{ name: 'Solar Subsidy Guide', href: '/in/solar-subsidy/' },
		{ name: 'Installation Process', href: '/in/solar-installation/' }
	]}
	toolLink={{ name: 'Solar Calculator', href: '/in/tools/solar-calculator/' }}
/>
