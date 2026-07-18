<script lang="ts">
	import LeadForm from './LeadForm.svelte';
	import type { CountryConfig } from '$lib/countries';

	let {
		city = '',
		title = '',
		hasBusinesses = true,
		country = null
	}: {
		city?: string;
		title?: string;
		hasBusinesses?: boolean;
		country?: CountryConfig | null;
	} = $props();

	const defaultTitle = $derived(
		hasBusinesses
			? (city ? `Get 2-3 Free Quotes at ${city}` : 'Get Free Quote')
			: `Be the First to Get Quotes When Installers Join ${city}`
	);
	const displayTitle = $derived(title || defaultTitle);
	const submitLabel = $derived(hasBusinesses ? 'Get Free Quotes' : 'Submit');
</script>

<section id="lead-form-sv" class="mb-8 mx-auto max-w-md">
	<div class="rounded-[theme(--radius-lg)] p-[theme(--card-padding-y)] shadow-[theme(--shadow-lg)] bg-gradient-to-br from-primary/10 to-primary/5">
		<div class="text-center mb-8">
			<h2 class="text-3xl md:text-4xl font-semibold mb-4 text-primary">{displayTitle}</h2>
			<div class="flex justify-center items-center my-4">
				<span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-accent rounded"></span>
			</div>
			{#if !hasBusinesses}
				<p class="text-muted-foreground max-w-lg mx-auto">We're building our installer network in {city}. Share your details and we'll connect you with verified installers as soon as they're available.</p>
			{/if}
		</div>
		<LeadForm showWrapper={false} {submitLabel} {country} />
	</div>
</section>
