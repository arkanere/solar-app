<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';

	$: darkMode = $isDarkMode;
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<h1>Control Tower</h1>
	
	<div class="control-grid">
		<div class="card">
			<h2>Eligible Leads</h2>
			<p>View leads where businesses are present to handle the requirements</p>
			<a href="/control-tower/eligible-leads" class="control-link">
				View Eligible Leads →
			</a>
		</div>
		
		<div class="card">
			<h2>Eligible Businesses</h2>
			<p>View businesses that can claim leads with eligibility analysis and engagement metrics</p>
			<a href="/control-tower/eligible-businesses" class="control-link">
				View Eligible Businesses →
			</a>
		</div>
	</div>
</main>

<style>
	/* Root variables for light and dark modes */
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--accent-color: #0056b3;
		--hover-color: #003366;
		--card-light-bg: #fff;
		--card-dark-bg: #333;
		--border-light: #ddd;
		--border-dark: #555;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	/* Main layout styling */
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem 1rem;
		font-family: var(--font-family);
		min-height: 100vh;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
		width: 100%;
	}

	/* Light mode */
	.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	/* Dark mode */
	.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	/* Page title styling */
	h1 {
		font-size: 2.2rem;
		margin-bottom: 2rem;
		font-weight: 600;
		text-align: center;
	}

	/* Control grid */
	.control-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		width: 100%;
		max-width: 1200px;
	}

	/* Card styling */
	.card {
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
		position: relative;
	}

	.light .card {
		background-color: var(--card-light-bg);
		border: 1px solid var(--border-light);
	}

	.dark .card {
		background-color: var(--card-dark-bg);
		border: 1px solid var(--border-dark);
	}

	.card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	}

	.card h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: var(--accent-color);
	}

	.card p {
		font-size: 1rem;
		line-height: 1.5;
		margin-bottom: 1.5rem;
		opacity: 0.8;
	}

	/* Control link styling */
	.control-link {
		display: inline-block;
		color: var(--accent-color);
		text-decoration: none;
		font-weight: 600;
		padding: 0.75rem 1.5rem;
		border: 2px solid var(--accent-color);
		border-radius: 4px;
		transition: all 0.3s ease;
	}

	.control-link:hover {
		background-color: var(--accent-color);
		color: white;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.control-grid {
			grid-template-columns: 1fr;
		}
		
		.card {
			padding: 1.5rem;
		}
		
		h1 {
			font-size: 1.8rem;
		}
	}
</style>