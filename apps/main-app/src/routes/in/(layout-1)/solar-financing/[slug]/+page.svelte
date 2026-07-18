<script lang="ts">
	import ClusterPage from '$lib/in/components/seo/ClusterPage.svelte';
	import BankSchemePage from '$lib/in/components/seo/BankSchemePage.svelte';
	import { breadcrumbLD, faqLD } from '$lib/seo';

	let { data } = $props();
	const d = $derived(data as Record<string, any>);

	const isCluster = $derived(d.pageType === 'cluster');
	const isBank = $derived(d.pageType === 'bank');

	const pageTitle = $derived(
		isCluster ? d.clusterData.meta_title
		: `${d.bank.name} Solar Loan — Rates & Eligibility | Solar Vipani`
	);

	const pageDescription = $derived(
		isCluster ? d.clusterData.meta_description
		: `${d.bank.name} solar loan details. Interest rates, eligibility, documents required and application process.`
	);

	const canonicalSlug = $derived(isCluster ? d.clusterData.slug : d.bank.slug);

	const breadcrumb = $derived(breadcrumbLD([
		{ name: 'Home', url: 'https://solarvipani.com/in' },
		{ name: 'Solar Financing', url: 'https://solarvipani.com/in/solar-financing' },
		{
			name: isCluster ? d.clusterData.h1 : d.bank.name,
			url: `https://solarvipani.com/in/solar-financing/${canonicalSlug}`
		}
	]));

	const faqItems = $derived(
		isCluster ? (d.clusterData.faq ?? []) : (d.bank.faq ?? [])
	);

	const faqSchema = $derived(faqItems.length > 0 ? faqLD(faqItems) : null);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href="https://solarvipani.com/in/solar-financing/{canonicalSlug}" />
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumb)}<\u002Fscript>`}
	{#if faqSchema}
		{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}<\u002Fscript>`}
	{/if}
</svelte:head>

{#if isCluster}
	<ClusterPage
		clusterData={d.clusterData}
		siblingClusters={d.siblingClusters}
		pillarSlug={d.pillarSlug}
		pillarName={d.pillarName}
		topDistricts={d.topDistricts}
	/>
{:else if isBank}
	<BankSchemePage bank={d.bank} siblingBanks={d.siblingBanks} />
{/if}
