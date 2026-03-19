<script lang="ts">
	import Breadcrumb from './Breadcrumb.svelte';
	import ContentSections from './ContentSections.svelte';
	import FAQ from './FAQ.svelte';

	type LinkItem = { name: string; href: string };

	let {
		pillarData,
		clusters,
		stats,
		siblingPillars = [],
		toolLink,
		entitySection
	}: {
		pillarData: {
			h1: string;
			content: { heading: string; body: string }[];
			faq: { question: string; answer: string }[];
		};
		clusters: { slug: string; name: string; pillarSlug: string }[];
		stats: { installerCount?: number; stateCount?: number };
		siblingPillars?: LinkItem[];
		toolLink?: LinkItem;
		entitySection?: { title: string; items: LinkItem[] };
	} = $props();
</script>

<div class="max-w-6xl mx-auto px-4 py-8">
	<Breadcrumb items={[
		{ name: 'Home', href: '/in/' },
		{ name: pillarData.h1, href: '' }
	]} />

	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">{pillarData.h1}</h1>

	{#if stats.installerCount || stats.stateCount}
		<div class="flex flex-wrap gap-4 mb-8 text-sm">
			{#if stats.installerCount}
				<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">{stats.installerCount} Installers</span>
			{/if}
			{#if stats.stateCount}
				<span class="bg-muted rounded-lg px-3 py-1.5 font-medium">{stats.stateCount} States</span>
			{/if}
		</div>
	{/if}

	<ContentSections sections={pillarData.content} />

	{#if clusters.length > 0}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-4">Explore Topics</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each clusters as cluster}
					<a
						href="/in/{cluster.pillarSlug}/{cluster.slug}/"
						class="block border rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all"
					>
						<h3 class="font-medium text-foreground">{cluster.name}</h3>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<FAQ items={pillarData.faq ?? []} />

	{#if entitySection && entitySection.items.length > 0}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-4">{entitySection.title}</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each entitySection.items as item}
					<a
						href={item.href}
						class="block border rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all"
					>
						<h3 class="font-medium text-foreground">{item.name}</h3>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	{#if siblingPillars.length > 0 || toolLink}
		<section class="mb-8 bg-accent/10 rounded-lg p-6">
			<h2 class="text-lg font-semibold text-primary mb-3">Related Resources</h2>
			<div class="flex flex-wrap gap-3">
				{#each siblingPillars as sibling}
					<a
						href={sibling.href}
						class="bg-card border rounded-lg px-4 py-2 text-sm font-medium hover:border-primary hover:shadow-sm transition-all"
					>
						{sibling.name}
					</a>
				{/each}
				{#if toolLink}
					<a
						href={toolLink.href}
						class="bg-card border rounded-lg px-4 py-2 text-sm font-medium hover:border-primary hover:shadow-sm transition-all"
					>
						{toolLink.name}
					</a>
				{/if}
			</div>
		</section>
	{/if}

	<!-- Geographic funnel bridge -->
	<section class="mb-8 bg-accent/10 rounded-lg p-6">
		<p class="text-sm text-muted-foreground mb-2">Ready to go solar?</p>
		<a href="/in/solar/" class="text-primary font-semibold hover:underline">
			Find verified solar installers across India →
		</a>
	</section>

	<div class="text-center mt-8 mb-8">
		<a
			href="/in/get-quotes/"
			class="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
		>
			Get Free Solar Quotes
		</a>
	</div>
</div>
