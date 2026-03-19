<script lang="ts">
	import Breadcrumb from './Breadcrumb.svelte';
	import ContentSections from './ContentSections.svelte';
	import FAQ from './FAQ.svelte';

	let { subsidy, discoms }: {
		subsidy: {
			state_slug: string;
			state_name: string;
			central_subsidy_rate: string | null;
			state_topup_rate: string | null;
			eligibility: string | null;
			application_process: string | null;
			content: { heading: string; body: string }[] | null;
			faq: { question: string; answer: string }[] | null;
		};
		discoms: { slug: string; name: string }[];
	} = $props();
</script>

<div class="max-w-6xl mx-auto px-4 py-8">
	<Breadcrumb items={[
		{ name: 'Home', href: '/in/' },
		{ name: 'Solar Subsidy', href: '/in/solar-subsidy/' },
		{ name: subsidy.state_name, href: '' }
	]} />

	<h1 class="text-3xl md:text-4xl font-bold text-primary mb-4">
		Solar Subsidy in {subsidy.state_name}
	</h1>

	<!-- Subsidy rates -->
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
		{#if subsidy.central_subsidy_rate}
			<div class="bg-accent/10 rounded-lg p-4">
				<p class="text-sm text-muted-foreground">Central Subsidy</p>
				<p class="text-lg font-semibold text-primary">{subsidy.central_subsidy_rate}</p>
			</div>
		{/if}
		{#if subsidy.state_topup_rate}
			<div class="bg-accent/10 rounded-lg p-4">
				<p class="text-sm text-muted-foreground">State Top-up</p>
				<p class="text-lg font-semibold text-primary">{subsidy.state_topup_rate}</p>
			</div>
		{/if}
	</div>

	{#if subsidy.eligibility}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-3">Eligibility</h2>
			<div class="text-muted-foreground leading-relaxed prose prose-sm max-w-none">
				{@html subsidy.eligibility}
			</div>
		</section>
	{/if}

	{#if subsidy.application_process}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-3">Application Process</h2>
			<div class="text-muted-foreground leading-relaxed prose prose-sm max-w-none">
				{@html subsidy.application_process}
			</div>
		</section>
	{/if}

	<ContentSections sections={subsidy.content ?? []} />

	<!-- Funnel link to state hub -->
	<section class="mb-8 bg-accent/10 rounded-lg p-6">
		<p class="text-sm text-muted-foreground mb-2">Ready to install solar with subsidy benefits?</p>
		<a
			href="/in/solar/{subsidy.state_slug}/"
			class="text-primary font-semibold hover:underline"
		>
			Find verified solar installers in {subsidy.state_name} →
		</a>
	</section>

	{#if discoms.length > 0}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary mb-4">DISCOMs in {subsidy.state_name}</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each discoms as discom}
					<a
						href="/in/solar-subsidy/{discom.slug}/"
						class="block border rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all"
					>
						<h3 class="font-medium text-foreground">{discom.name}</h3>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Related guides -->
	<section class="mb-8">
		<h2 class="text-lg font-semibold text-primary mb-3">Related Guides</h2>
		<div class="flex flex-wrap gap-2">
			<a href="/in/solar-subsidy/state-wise/" class="bg-muted hover:bg-accent/20 text-sm rounded-lg px-3 py-1.5 transition-colors">
				State-wise Subsidy Comparison
			</a>
			<a href="/in/solar-subsidy/how-to-apply/" class="bg-muted hover:bg-accent/20 text-sm rounded-lg px-3 py-1.5 transition-colors">
				How to Apply for Subsidy
			</a>
		</div>
	</section>

	<FAQ items={subsidy.faq ?? []} title="FAQs — Solar Subsidy in {subsidy.state_name}" />

	<div class="text-center mt-8 mb-8">
		<a
			href="/in/get-quotes/"
			class="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
		>
			Get Free Solar Quotes
		</a>
	</div>
</div>
