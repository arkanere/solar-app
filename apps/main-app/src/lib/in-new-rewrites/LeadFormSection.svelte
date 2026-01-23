<script lang="ts">
	import LeadForm from './LeadForm.svelte';

	let { city = '', title = '', hasBusinesses = true } = $props();

	const defaultTitle = $derived(city ? `Get 2-3 Free Quotes at ${city}` : 'Get Free Quote');
	const displayTitle = $derived(title || defaultTitle);
</script>

<section id="lead-form-sv" class="mb-8 mx-auto max-w-[theme(--max-width-md)]">
	<div class="rounded-[theme(--radius-lg)] p-[theme(--card-padding-y)] shadow-card bg-card">
		<div class="text-center mb-[theme(--spacing-2xl)]">
			<h2 class="text-2xl md:text-4xl font-semibold mb-[theme(--spacing-lg)]">{displayTitle}</h2>
			<div class="flex justify-center items-center my-[theme(--spacing-lg)]">
				<span class="w-[theme(--divider-line-width)] h-[theme(--divider-line-height)] bg-foreground-muted rounded"></span>
			</div>
		</div>
		<LeadForm showWrapper={false} />
	</div>
</section>
