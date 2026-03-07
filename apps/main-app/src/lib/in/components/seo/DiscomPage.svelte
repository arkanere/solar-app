<script lang="ts">
	import Breadcrumb from './Breadcrumb.svelte';
	import ContentSections from './ContentSections.svelte';
	import FAQ from './FAQ.svelte';

	let { discom, stateSubsidy }: {
		discom: {
			slug: string;
			name: string;
			state_slug: string;
			net_metering_policy: string | null;
			tariff_structure: string | null;
			application_process: string | null;
			content: { heading: string; body: string }[] | null;
			faq: { question: string; answer: string }[] | null;
		};
		stateSubsidy: { state_name: string } | null;
	} = $props();

	const stateName = $derived(stateSubsidy?.state_name ?? discom.state_slug);
</script>

<div class="max-w-6xl mx-auto px-4 py-8">
	<Breadcrumb items={[
		{ name: 'Home', href: '/in/' },
		{ name: 'Solar Subsidy', href: '/in/solar-subsidy/' },
		{ name: stateName, href: `/in/solar-subsidy/${discom.state_slug}/` },
		{ name: discom.name, href: '' }
	]} />

	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">{discom.name} — Solar Net Metering</h1>

	{#if discom.net_metering_policy}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-3">Net Metering Policy</h2>
			<div class="text-muted-foreground leading-relaxed prose prose-sm max-w-none">
				{@html discom.net_metering_policy}
			</div>
		</section>
	{/if}

	{#if discom.tariff_structure}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-3">Tariff Structure</h2>
			<div class="text-muted-foreground leading-relaxed prose prose-sm max-w-none">
				{@html discom.tariff_structure}
			</div>
		</section>
	{/if}

	{#if discom.application_process}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-3">Application Process</h2>
			<div class="text-muted-foreground leading-relaxed prose prose-sm max-w-none">
				{@html discom.application_process}
			</div>
		</section>
	{/if}

	<ContentSections sections={discom.content ?? []} />

	<FAQ items={discom.faq ?? []} title="FAQs — {discom.name}" />

	<div class="mt-8">
		<a href="/in/solar-subsidy/{discom.state_slug}/" class="text-primary hover:underline text-sm">
			← Solar Subsidy in {stateName}
		</a>
	</div>

	<div class="text-center mt-8 mb-8">
		<a
			href="/in/get-quotes/"
			class="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
		>
			Get Free Solar Quotes
		</a>
	</div>
</div>
