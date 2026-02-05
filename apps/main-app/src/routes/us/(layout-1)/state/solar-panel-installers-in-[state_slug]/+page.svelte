<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/us/themeStore';
	import { formatCountyStateUrl } from '$lib/us/stateAbbreviations';

	// Get reactive data from the page store
	let state = $derived($page.data.state);
	let counties = $derived($page.data.districts || []); // Backend returns as 'districts' for compatibility
	let errorMessage = $derived($page.data.errorMessage);
	let darkMode = $derived($isDarkMode);
</script>

<svelte:head>
	<title>Solar Panel Installers in {state} - Find installers by county - Solar Vipani</title>
	<meta
		name="description"
		content="Find the best solar panel installers in {state}. Browse by county to find top solar companies in your area."
	/>
</svelte:head>

<main class={darkMode ? 'dark' : 'light'}>
	<h1>Solar Panel Installers in {state}</h1>

	{#if errorMessage}
		<div class="error-message" role="alert">
			<p>{errorMessage}</p>
		</div>
	{:else if counties.length === 0}
		<div class="warning-message" role="alert">
			<p>No counties found in {state}.</p>
		</div>
	{:else}
		<p class="intro-text">
			Browse solar panel installers in {state} by county. We have listings in {counties.length}
			counties.
		</p>

		<ul class="counties-grid">
			{#each counties as county}
				<li>
					<div class="county-card">
						<h2>{county}</h2>
						<p>Find solar installers in {county}</p>
						<div class="card-actions">
							<a
								href={`/us/county/${formatCountyStateUrl(county, state)}`}
								rel="noopener"
								class="action-link primary"
							>
								<span>View cities & installers</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="arrow-icon"
								>
									<path
										fill-rule="evenodd"
										d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
										clip-rule="evenodd"
									/>
								</svg>
							</a>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</main>

<style>
	/* Root variables using custom properties */
	:root {
		/* Colors */
		--primary-color: #0056b3;
		--primary-hover: #004494;
		--primary-light: #e6f0ff;

		/* Text colors */
		--text-dark: #2c3e50;
		--text-medium: #546e7a;
		--text-light: #ecf0f1;

		/* Theme colors */
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a202c;
		--light-card-bg: #ffffff;
		--dark-card-bg: #2d3748;

		/* UI elements */
		--border-radius-sm: 4px;
		--border-radius-md: 8px;
		--border-radius-lg: 16px;
		--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
		--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
		--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

		/* Typography */
		--font-family: 'Poppins', 'Helvetica Neue', Arial, sans-serif;
		--heading-line-height: 1.2;
		--body-line-height: 1.6;

		/* Layout */
		--section-padding: 2rem 1.5rem;
		--container-width: 1140px;
		--grid-gap: 1.5rem;

		/* Transitions */
		--transition-fast: 0.2s ease;
		--transition-medium: 0.3s ease;
	}

	/* Base styles */
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	main {
		width: 100%;
		font-family: var(--font-family);
		line-height: var(--body-line-height);
		overflow-x: hidden;
		transition:
			background-color var(--transition-medium),
			color var(--transition-medium);
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem 1rem;
		min-height: 100vh;
	}

	main > * {
		max-width: var(--container-width);
		width: 100%;
		margin-bottom: 2rem;
	}

	/* Theme styling */
	.light {
		background-color: var(--light-bg-color);
		color: var(--text-dark);
	}

	.dark {
		background-color: var(--dark-bg-color);
		color: var(--text-light);
	}

	/* Typography */
	h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
		font-weight: 600;
		text-align: center;
		color: var(--primary-color);
		line-height: var(--heading-line-height);
	}

	.dark h1 {
		color: var(--primary-light);
	}

	h2 {
		font-size: 1.8rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--primary-color);
		text-align: left;
	}

	.dark h2 {
		color: var(--primary-light);
	}

	p {
		font-size: 1rem;
		margin-bottom: 0.75rem;
		line-height: 1.6;
		color: var(--text-medium);
	}

	.dark p {
		color: #cbd5e0;
	}

	.intro-text {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 1.1rem;
	}

	.error-message,
	.warning-message {
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
	}

	.error-message {
		background-color: #ffebee;
		border: 1px solid #f44336;
		color: #b71c1c;
	}

	.dark .error-message {
		background-color: rgba(244, 67, 54, 0.2);
		border-color: #f44336;
		color: #ef9a9a;
	}

	.warning-message {
		background-color: #fff8e1;
		border: 1px solid #ffc107;
		color: #ff6f00;
	}

	.dark .warning-message {
		background-color: rgba(255, 193, 7, 0.2);
		border-color: #ffc107;
		color: #ffcc80;
	}

	/* Counties grid */
	.counties-grid {
		list-style-type: none;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--grid-gap);
		width: 100%;
		margin-bottom: 2rem;
	}

	/* County card styling */
	.county-card {
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-md);
		transition: all var(--transition-medium);
		height: 100%;
		background-color: var(--light-card-bg);
		border: 1px solid rgba(0, 0, 0, 0.08);
	}

	.dark .county-card {
		background-color: var(--dark-card-bg);
		border-color: rgba(255, 255, 255, 0.1);
	}

	.county-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
	}

	.county-card h2 {
		font-size: 1.3rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--primary-color);
		text-align: left;
	}

	.dark .county-card h2 {
		color: var(--primary-light);
	}

	.county-card p {
		font-size: 0.95rem;
		margin-bottom: 1rem;
		color: var(--text-medium);
	}

	.dark .county-card p {
		color: #a0aec0;
	}

	/* Card actions container */
	.card-actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: auto;
		padding-top: 1rem;
	}

	/* Action link styling */
	.action-link {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1rem;
		border-radius: var(--border-radius-md);
		font-size: 0.9rem;
		font-weight: 500;
		text-decoration: none;
		transition: all var(--transition-fast);
		border: 1px solid;
	}

	.action-link.primary {
		background-color: var(--primary-color);
		color: white;
		border-color: var(--primary-color);
	}

	.action-link.primary:hover {
		background-color: var(--primary-hover);
		border-color: var(--primary-hover);
	}

	.arrow-icon {
		width: 16px;
		height: 16px;
		transition: transform var(--transition-fast);
	}

	.action-link:hover .arrow-icon {
		transform: translateX(4px);
	}

	/* Responsive design */
	@media (max-width: 992px) {
		main {
			padding: 1.5rem 1rem;
		}

		h1 {
			font-size: 2.2rem;
		}

		h2 {
			font-size: 1.6rem;
		}

		.counties-grid {
			grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		}
	}

	@media (max-width: 768px) {
		main {
			padding: 1rem 0.5rem;
		}

		h1 {
			font-size: 2rem;
		}

		h2 {
			font-size: 1.4rem;
		}

		.counties-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}
	}

	@media (max-width: 576px) {
		h1 {
			font-size: 1.8rem;
		}

		h2 {
			font-size: 1.3rem;
		}

		.county-card {
			padding: 1rem;
		}
	}
</style>
