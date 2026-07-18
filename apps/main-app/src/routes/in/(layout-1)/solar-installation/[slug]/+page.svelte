<script lang="ts">
	import ClusterPage from '$lib/in/components/seo/ClusterPage.svelte';
	import { breadcrumbLD, faqLD } from '$lib/seo';

	let { data } = $props();

	const breadcrumb = $derived(breadcrumbLD([
		{ name: 'Home', url: 'https://solarvipani.com/in' },
		{ name: 'Solar Installation', url: 'https://solarvipani.com/in/solar-installation' },
		{ name: data.clusterData.h1, url: `https://solarvipani.com/in/solar-installation/${data.clusterData.slug}` }
	]));

	const faqSchema = $derived(
		data.clusterData.faq?.length > 0 ? faqLD(data.clusterData.faq) : null
	);
</script>

<svelte:head>
	<title>{data.clusterData.meta_title}</title>
	<meta name="description" content={data.clusterData.meta_description} />
	<link rel="canonical" href="https://solarvipani.com/in/solar-installation/{data.clusterData.slug}" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}<\u002Fscript>`}
	{#if faqSchema}
		{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}<\u002Fscript>`}
	{/if}
</svelte:head>

<ClusterPage
	clusterData={data.clusterData}
	siblingClusters={data.siblingClusters}
	pillarSlug={data.pillarSlug}
	pillarName={data.pillarName}
	topDistricts={data.topDistricts}
/>
