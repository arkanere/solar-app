<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		// Redirect to login page if not authenticated
		window.location.href = '/in/login';
	});
</script>

<svelte:head>
	<title>Solar Vipani Business Portal</title>
</svelte:head>

<main
	class="flex flex-col items-center justify-center min-h-screen p-8 bg-background text-foreground transition-colors duration-300"
>
	<div class="text-center">
		<h1 class="text-2xl md:text-3xl font-semibold mb-4">Welcome to Solar Vipani Business Portal</h1>
		<p class="text-lg text-foreground-secondary">Redirecting you to login...</p>
	</div>
</main>
