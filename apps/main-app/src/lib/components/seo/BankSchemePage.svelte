<script lang="ts">
	import { contentUrl, countryUrl } from '$lib/countries/urls';
	import type { CountryCode } from '$lib/countries';
	import Breadcrumb from './Breadcrumb.svelte';
	import ContentSections from './ContentSections.svelte';
	import FAQ from './FAQ.svelte';

	let { bank, siblingBanks = [], country }: {
		bank: {
			slug: string;
			name: string;
			interest_rate: string | null;
			max_amount: string | null;
			tenure: string | null;
			eligibility: string | null;
			documents: string | null;
			content: { heading: string; body: string }[] | null;
			faq: { question: string; answer: string }[] | null;
		};
		siblingBanks?: { slug: string; name: string }[];
		country: CountryCode;
	} = $props();
</script>

<div class="max-w-6xl mx-auto px-4 py-8">
	<Breadcrumb items={[
		{ name: 'Home', href: countryUrl(country, '/') },
		{ name: 'Solar Financing', href: contentUrl('/solar-financing/') },
		{ name: bank.name, href: '' }
	]} />

	<h1 class="text-3xl md:text-4xl font-bold text-primary-strong mb-4">
		{bank.name} — Solar Loan
	</h1>

	<!-- Key terms grid -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
		{#if bank.interest_rate}
			<div class="bg-accent/10 rounded-lg p-4">
				<p class="text-sm text-muted-foreground">Interest Rate</p>
				<p class="text-lg font-semibold text-primary-strong">{bank.interest_rate}</p>
			</div>
		{/if}
		{#if bank.max_amount}
			<div class="bg-accent/10 rounded-lg p-4">
				<p class="text-sm text-muted-foreground">Max Loan Amount</p>
				<p class="text-lg font-semibold text-primary-strong">{bank.max_amount}</p>
			</div>
		{/if}
		{#if bank.tenure}
			<div class="bg-accent/10 rounded-lg p-4">
				<p class="text-sm text-muted-foreground">Tenure</p>
				<p class="text-lg font-semibold text-primary-strong">{bank.tenure}</p>
			</div>
		{/if}
	</div>

	{#if bank.eligibility}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary-strong mb-3">Eligibility</h2>
			<div class="text-muted-foreground leading-relaxed prose prose-sm max-w-none">
				{@html bank.eligibility}
			</div>
		</section>
	{/if}

	{#if bank.documents}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold text-primary-strong mb-3">Documents Required</h2>
			<div class="text-muted-foreground leading-relaxed prose prose-sm max-w-none">
				{@html bank.documents}
			</div>
		</section>
	{/if}

	<ContentSections sections={bank.content ?? []} />

	<!-- Related links -->
	<section class="mb-8">
		<h2 class="text-lg font-semibold text-primary-strong mb-3">Related Resources</h2>
		<div class="flex flex-wrap gap-2">
			<a href={contentUrl('/solar-financing/solar-loan/')} class="bg-muted hover:bg-accent/20 text-sm rounded-lg px-3 py-1.5 transition-colors">
				Solar Loan Guide
			</a>
			<a href={contentUrl('/tools/emi-calculator/')} class="bg-muted hover:bg-accent/20 text-sm rounded-lg px-3 py-1.5 transition-colors">
				EMI Calculator
			</a>
		</div>
	</section>

	{#if siblingBanks.length > 0}
		<section class="mb-8">
			<h2 class="text-lg font-semibold text-primary-strong mb-3">Other Bank Schemes</h2>
			<div class="flex flex-wrap gap-2">
				{#each siblingBanks as sibling}
					<a
						href={contentUrl(`/solar-financing/${sibling.slug}/`)}
						class="bg-muted hover:bg-accent/20 text-sm rounded-lg px-3 py-1.5 transition-colors"
					>
						{sibling.name}
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<FAQ items={bank.faq ?? []} title="FAQs — {bank.name} Solar Loan" />

	<div class="text-center mt-8 mb-8">
		<a
			href={countryUrl(country, '/get-quotes/')}
			class="inline-block bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
		>
			Get Free Solar Quotes
		</a>
	</div>
</div>
