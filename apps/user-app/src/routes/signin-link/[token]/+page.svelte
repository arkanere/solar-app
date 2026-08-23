<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Signing In - User App</title>
</svelte:head>

{#if data.error}
	<div class="error-container">
		<div class="error-box">
			<h1>Authentication Error</h1>
			<p class="error-message">{data.error}</p>
			<a href="/" class="btn-home">Return to Home</a>
		</div>
	</div>
{:else}
	<div class="loading-container">
		<div class="spinner"></div>
		<p>Signing you in...</p>
	</div>
{/if}

<style>
	.error-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 2rem;
		background-color: hsl(var(--background));
	}

	.error-box {
		background: hsl(var(--card));
		padding: 3rem;
		border-radius: 8px;
		box-shadow: var(--shadow-lg);
		text-align: center;
		max-width: 500px;
	}

	h1 {
		color: hsl(var(--destructive));
		margin-bottom: 1rem;
		font-size: 2rem;
	}

	.error-message {
		color: hsl(var(--muted-foreground));
		margin-bottom: 2rem;
		line-height: 1.6;
	}

	.btn-home {
		display: inline-block;
		padding: 0.75rem 2rem;
		background-color: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
		text-decoration: none;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	.btn-home:hover {
		background-color: var(--primary-hover);
	}

	.loading-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background-color: hsl(var(--background));
	}

	.spinner {
		border: 4px solid hsl(var(--border));
		border-top: 4px solid hsl(var(--primary));
		border-radius: 50%;
		width: 50px;
		height: 50px;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.loading-container p {
		color: hsl(var(--muted-foreground));
		font-size: 1.2rem;
	}
</style>
