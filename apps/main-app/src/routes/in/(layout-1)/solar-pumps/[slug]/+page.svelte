<script lang="ts">
	import ClusterPage from '$lib/in/components/seo/ClusterPage.svelte';
	import BrandPage from '$lib/in/components/seo/BrandPage.svelte';
	import { breadcrumbLD, faqLD } from '$lib/seo';

	let { data } = $props();
	const d = $derived(data as Record<string, any>);

	const isCluster = $derived(d.pageType === 'cluster');
	const isBrand = $derived(d.pageType === 'brand');

	const breadcrumb = $derived(breadcrumbLD([
		{ name: 'Home', url: 'https://solarvipani.com/in' },
		{ name: 'Solar Pumps', url: 'https://solarvipani.com/in/solar-pumps' },
		{
			name: isCluster ? d.clusterData.h1 : d.brand.name,
			url: `https://solarvipani.com/in/solar-pumps/${isCluster ? d.clusterData.slug : d.brand.slug}`
		}
	]));

	const metaTitle = $derived(
		isCluster ? d.clusterData.meta_title : (d.brand.meta_title ?? `${d.brand.name} Solar Pumps — Prices & Specs | Solar Vipani`)
	);

	const metaDescription = $derived(
		isCluster ? d.clusterData.meta_description : (d.brand.meta_description ?? `Compare ${d.brand.name} solar pump models, prices and specifications.`)
	);

	const faqItems = $derived(
		isCluster ? (d.clusterData.faq ?? []) : (d.brand.faq ?? [])
	);

	const faqSchema = $derived(faqItems.length > 0 ? faqLD(faqItems) : null);

	const canonicalSlug = $derived(isCluster ? d.clusterData.slug : d.brand.slug);
</script>

<svelte:head>
	<title>{metaTitle}</title>
	<meta name="description" content={metaDescription} />
	<link rel="canonical" href="https://solarvipani.com/in/solar-pumps/{canonicalSlug}" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`}
	{#if faqSchema}
		{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
	{/if}
</svelte:head>

{#if isCluster}
	<ClusterPage
		clusterData={d.clusterData}
		siblingClusters={d.siblingClusters}
		pillarSlug={d.pillarSlug}
		pillarName={d.pillarName}
	/>
{:else if isBrand}
	<BrandPage
		brand={d.brand}
		products={d.products}
		pillarSlug={d.pillarSlug}
		pillarName={d.pillarName}
	/>
{/if}
