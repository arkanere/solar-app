<script lang="ts">
	import Breadcrumb from './Breadcrumb.svelte';
	import ClusterNav from './ClusterNav.svelte';
	import ContentSections from './ContentSections.svelte';
	import DistrictCTA from './DistrictCTA.svelte';
	import FAQ from './FAQ.svelte';

	type TopDistrict = {
		name: string;
		state: string;
		stateSlug: string;
		districtSlug: string;
		installerCount: number;
	};

	let { clusterData, siblingClusters, pillarSlug, pillarName, topDistricts = [] }: {
		clusterData: {
			h1: string;
			slug: string;
			content: { heading: string; body: string }[];
			faq: { question: string; answer: string }[];
		};
		siblingClusters: { slug: string; name: string }[];
		pillarSlug: string;
		pillarName: string;
		topDistricts?: TopDistrict[];
	} = $props();

	const sizeMatch = $derived(clusterData.slug.match(/^(\d+)kw-system$/));
	const sizeKw = $derived(sizeMatch ? parseInt(sizeMatch[1]) : null);

	const toolLink = $derived.by(() => {
		const slug = clusterData.slug;
		if (/cost|price|\d+kw-system/.test(slug) || pillarSlug === 'rooftop-solar') {
			return { href: '/in/tools/solar-calculator/', name: 'Solar Calculator', cta: 'Estimate your system size and savings' };
		}
		if (/emi|loan|financing/.test(slug) || pillarSlug === 'solar-financing') {
			return { href: '/in/tools/emi-calculator/', name: 'EMI Calculator', cta: 'Calculate your monthly solar loan EMI' };
		}
		if (/subsidy|eligibility|pm-surya-ghar|how-to-apply/.test(slug) || pillarSlug === 'solar-subsidy') {
			return { href: '/in/tools/subsidy-checker/', name: 'Subsidy Checker', cta: 'Check your solar subsidy eligibility' };
		}
		return null;
	});
</script>

<div class="max-w-6xl mx-auto px-4 py-8">
	<Breadcrumb items={[
		{ name: 'Home', href: '/in/' },
		{ name: pillarName, href: `/in/${pillarSlug}/` },
		{ name: clusterData.h1, href: '' }
	]} />

	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">{clusterData.h1}</h1>

	<ContentSections sections={clusterData.content} />

	<FAQ items={clusterData.faq ?? []} />

	{#if toolLink}
		<section class="mb-8 bg-accent/10 rounded-lg p-6 text-center">
			<p class="text-muted-foreground mb-3">{toolLink.cta}</p>
			<a
				href={toolLink.href}
				class="inline-block bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
			>
				{toolLink.name} →
			</a>
		</section>
	{/if}

	<DistrictCTA districts={topDistricts} />

	{#if sizeKw && topDistricts.length > 0}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-3">
				{sizeKw}kW Solar System — Prices by City
			</h2>
			<p class="text-sm text-muted-foreground mb-4">
				See {sizeKw}kW system prices and installers in top districts.
			</p>
			<div class="flex flex-wrap gap-2">
				{#each topDistricts as d}
					<a
						href="/in/solar/{d.stateSlug}/{d.districtSlug}/{sizeKw}kw-solar-system/"
						class="bg-card border rounded-lg px-4 py-2 text-sm font-medium hover:border-primary hover:shadow-sm transition-all"
					>
						{sizeKw}kW in {d.name}
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<ClusterNav clusters={siblingClusters} currentSlug={clusterData.slug} {pillarSlug} />

	<div class="text-center mt-8 mb-8">
		<a
			href="/in/get-quotes/"
			class="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
		>
			Get Free Solar Quotes
		</a>
	</div>
</div>
