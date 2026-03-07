<script lang="ts">
	import Breadcrumb from './Breadcrumb.svelte';
	import ClusterNav from './ClusterNav.svelte';
	import ContentSections from './ContentSections.svelte';
	import FAQ from './FAQ.svelte';

	let { clusterData, siblingClusters, pillarSlug, pillarName }: {
		clusterData: {
			h1: string;
			slug: string;
			content: { heading: string; body: string }[];
			faq: { question: string; answer: string }[];
		};
		siblingClusters: { slug: string; name: string }[];
		pillarSlug: string;
		pillarName: string;
	} = $props();
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
