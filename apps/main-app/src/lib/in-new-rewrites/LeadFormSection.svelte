<script lang="ts">
	import QueryForm from './QueryForm.svelte';

	let { city = '', hasBusinesses = false } = $props();
</script>

<section id="lead-form-sv" class="w-full" style="max-width: var(--max-width-4xl); margin-bottom: 2.5rem; padding: 2rem;">
	<h2 class="text-primary" style="font-size: var(--font-size-3xl); line-height: var(--font-size-3xl--line-height); font-weight: 700; margin-bottom: var(--space-y-6);">Get Free Quotation for Solar Installation in {city}</h2>
	<p class="text-muted-foreground" style="margin-bottom: var(--space-y-6);">
		Fill the form below to get free quotes from verified solar installers in {city}.
	</p>
	<QueryForm />
</section>
