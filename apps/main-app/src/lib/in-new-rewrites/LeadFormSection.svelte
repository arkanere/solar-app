<script lang="ts">
	import QueryForm from './QueryForm.svelte';

	let { city = '', hasBusinesses = false } = $props();
</script>

<section id="lead-form-sv" class="w-full max-w-4xl mb-10 p-8">
	<h2 class="text-3xl font-bold mb-6 text-primary">Get Free Quotation for Solar Installation in {city}</h2>
	<p class="text-slate-600 dark:text-slate-300 mb-6">
		Fill the form below to get free quotes from verified solar installers in {city}.
	</p>
	<QueryForm />
</section>
