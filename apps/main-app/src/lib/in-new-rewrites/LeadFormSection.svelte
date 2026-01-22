<script lang="ts">
	import QueryForm from './QueryForm.svelte';
	import { Card } from '$lib/components/ui/card';

	let { city = '' } = $props();
</script>

<section id="lead-form-sv" class="w-full max-w-[theme(--max-width-4xl)] mb-[theme(--spacing-xl)] p-[theme(--container-padding)]">
	<Card class="gap-[theme(--card-gap)]">
		<h2 class="text-[theme(--font-size-3xl)] leading-[theme(--font-size-3xl--line-height)] font-bold tracking-[theme(--tracking-heading)] text-primary">
			Get Free Quotation for Solar Installation in {city}
		</h2>
		<p class="text-[theme(--font-size-base)] text-muted-foreground">
			Fill the form below to get free quotes from verified solar installers in {city}.
		</p>
		<QueryForm />
	</Card>
</section>
