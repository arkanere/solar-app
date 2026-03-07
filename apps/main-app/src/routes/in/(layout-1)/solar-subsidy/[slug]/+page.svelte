<script lang="ts">
	import ClusterPage from '$lib/in/components/seo/ClusterPage.svelte';
	import StateSubsidyPage from '$lib/in/components/seo/StateSubsidyPage.svelte';
	import DiscomPage from '$lib/in/components/seo/DiscomPage.svelte';
	import { breadcrumbLD, faqLD } from '$lib/seo';

	let { data } = $props();
	const d = $derived(data as Record<string, any>);

	const isCluster = $derived(d.pageType === 'cluster');
	const isState = $derived(d.pageType === 'state-subsidy');
	const isDiscom = $derived(d.pageType === 'discom');

	const pageTitle = $derived(
		isCluster ? d.clusterData.meta_title
		: isState ? `Solar Subsidy in ${d.subsidy.state_name} — Rates & Application | Solar Vipani`
		: `${d.discom.name} — Net Metering & Solar Policy | Solar Vipani`
	);

	const pageDescription = $derived(
		isCluster ? d.clusterData.meta_description
		: isState ? `Solar subsidy rates, eligibility and application process in ${d.subsidy.state_name}. Central and state subsidies for rooftop solar.`
		: `${d.discom.name} net metering policy, tariff structure and application process for rooftop solar.`
	);

	const canonicalSlug = $derived(
		isCluster ? d.clusterData.slug
		: isState ? d.subsidy.state_slug
		: d.discom.slug
	);

	const breadcrumbItems = $derived.by(() => {
		const items = [
			{ name: 'Home', url: 'https://solarvipani.com/in/' },
			{ name: 'Solar Subsidy', url: 'https://solarvipani.com/in/solar-subsidy/' }
		];
		if (isDiscom && d.stateSubsidy) {
			items.push({
				name: d.stateSubsidy.state_name,
				url: `https://solarvipani.com/in/solar-subsidy/${d.discom.state_slug}/`
			});
		}
		items.push({
			name: isCluster ? d.clusterData.h1 : isState ? d.subsidy.state_name : d.discom.name,
			url: `https://solarvipani.com/in/solar-subsidy/${canonicalSlug}/`
		});
		return items;
	});

	const breadcrumb = $derived(breadcrumbLD(breadcrumbItems));

	const faqItems = $derived(
		isCluster ? (d.clusterData.faq ?? [])
		: isState ? (d.subsidy.faq ?? [])
		: (d.discom.faq ?? [])
	);

	const faqSchema = $derived(faqItems.length > 0 ? faqLD(faqItems) : null);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href="https://solarvipani.com/in/solar-subsidy/{canonicalSlug}/" />
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
{:else if isState}
	<StateSubsidyPage subsidy={d.subsidy} discoms={d.discoms} />
{:else if isDiscom}
	<DiscomPage discom={d.discom} stateSubsidy={d.stateSubsidy} />
{/if}
