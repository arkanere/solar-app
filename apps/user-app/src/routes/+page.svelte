<script lang="ts">
	import { goto } from '$app/navigation';

	const regions = [
		{ name: 'India', flag: '🇮🇳', path: '/in' },
		{ name: 'United States', flag: '🇺🇸', path: '/us' }
	];
</script>

<svelte:head>
	<title>Solar Vipani | Track Your Solar Inquiry</title>
	<meta name="description" content="Track your solar inquiry and see which verified installers have shown interest in your project." />
</svelte:head>

<main>
	<section class="hero">
		<img
			src="https://solarvipani.com/logo.webp"
			alt="Solar Vipani Logo"
			class="logo"
			width="150"
			height="75"
		/>
		<h1>Solar Vipani</h1>
		<p class="tagline">Get 2-3 Free Quotes from Verified Installers in Your Area</p>
		<p class="sub">Join 2,000+ homeowners and businesses who have begun their switch to solar through our platform.</p>
	</section>

	<section class="region-section">
		<h2>Choose Your Region</h2>
		<div class="region-grid">
			{#each regions as region}
				<button class="region-card" onclick={() => goto(region.path)}>
					<span class="flag">{region.flag}</span>
					<span class="region-name">{region.name}</span>
				</button>
			{/each}
		</div>
	</section>
</main>

<style>
	main {
		min-height: 100vh;
		font-family: var(--font-sans);
		background: hsl(var(--background));
		color: hsl(var(--foreground));
	}

	.hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 4rem 2rem 3rem;
		background: hsl(var(--background));
	}

	.logo {
		margin-bottom: 1.5rem;
		object-fit: contain;
	}

	h1 {
		font-size: 2.8rem;
		font-weight: 700;
		margin: 0 0 0.75rem;
		color: hsl(var(--foreground));
	}

	.tagline {
		font-size: 1.25rem;
		color: hsl(var(--primary-strong));
		font-weight: 500;
		margin: 0 0 0.5rem;
	}

	.sub {
		font-size: 1rem;
		color: hsl(var(--foreground-secondary));
		max-width: 520px;
		margin: 0;
		line-height: 1.6;
	}

	.region-section {
		max-width: 700px;
		margin: 0 auto;
		padding: 3rem 2rem;
		text-align: center;
	}

	h2 {
		font-size: 2rem;
		font-weight: 600;
		color: hsl(var(--primary-strong));
		margin: 0 0 2.5rem;
	}

	.region-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
	}

	.region-card {
		background: hsl(var(--card));
		border: 2px solid hsl(var(--border));
		border-radius: 16px;
		padding: 2.5rem 1.5rem;
		cursor: pointer;
		transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.region-card:hover {
		transform: scale(1.05);
		box-shadow: 0 8px 24px hsl(var(--primary) / 0.15);
		border-color: hsl(var(--primary-strong));
	}

	.flag {
		font-size: 3.5rem;
		line-height: 1;
	}

	.region-name {
		font-size: 1.3rem;
		font-weight: 600;
		color: hsl(var(--primary-strong));
	}

	@media (max-width: 480px) {
		h1 {
			font-size: 2rem;
		}

		.region-grid {
			grid-template-columns: 1fr;
		}

		.region-card {
			padding: 2rem 1.5rem;
		}
	}
</style>
