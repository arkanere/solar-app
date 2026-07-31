<script lang="ts">
	import { contentUrl } from '$lib/countries/urls';
	import PillarPage from '$lib/components/seo/PillarPage.svelte';
	import { breadcrumbLD, faqLD } from '$lib/seo';

	let { data } = $props();

	const breadcrumb = $derived(breadcrumbLD([
		{ name: 'Home', url: 'https://solarvipani.com/in' },
		{ name: 'Solar Financing', url: 'https://solarvipani.com/solar-financing' }
	]));

	const faqSchema = $derived(
		data.pillarData.faq?.length > 0 ? faqLD(data.pillarData.faq) : null
	);
</script>

<svelte:head>
	<title>{data.pillarData.meta_title}</title>
	<meta name="description" content={data.pillarData.meta_description} />
	<link rel="canonical" href="https://solarvipani.com/solar-financing" />
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
	siblingPillars={[
		{ name: 'Solar Subsidy', href: contentUrl('/solar-subsidy/') }
	]}
	toolLink={{ name: 'EMI Calculator', href: contentUrl('/tools/emi-calculator/') }}
	entitySection={{ title: 'Bank Solar Loan Schemes', items: data.bankSchemes }}
/>
