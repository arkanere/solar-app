<script>
	import { isDarkMode } from '$lib/us/themeStore';
	import { onMount } from 'svelte';

	$: darkMode = $isDarkMode;

	onMount(() => {
		// Redirect to login page if not authenticated
		window.location.href = '/us/login';
	});
</script>

<svelte:head>
	<title>Solar Vipani Business Portal</title>
</svelte:head>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="container">
		<h1>Welcome to Solar Vipani Business Portal</h1>
		<p>Redirecting you to login...</p>
	</div>
</main>

<style>
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		padding: 2rem;
		font-family: var(--font-family);
		transition: background-color 0.3s ease, color 0.3s ease;
	}

	.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	.container {
		text-align: center;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	p {
		font-size: 1.1rem;
	}
</style>