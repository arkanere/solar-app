<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';

	$: darkMode = $isDarkMode;
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<h1>Analytics Dashboard</h1>
	
	<div class="analytics-grid">
		<div class="card">
			<h2>Lead Generation</h2>
			<p>View detailed analytics about lead generation performance</p>
			<a href="/admin/analytics/lead-generation" class="analytics-link">
				View Lead Analytics →
			</a>
		</div>
		
		<div class="card">
			<h2>Business Registration</h2>
			<p>View detailed analytics about business registration and tier breakdown</p>
			<a href="/admin/analytics/businesses" class="analytics-link">
				View Business Analytics →
			</a>
		</div>
		
		<div class="card">
			<h2>State-wise Businesses</h2>
			<p>View businesses by state with analytics and complete business listings</p>
			<a href="/admin/analytics/businesses-statewise" class="analytics-link">
				View State-wise Analytics →
			</a>
		</div>
		
		<div class="card">
			<h2>Business Branches</h2>
			<p>View analytics about business branch distribution and expansion</p>
			<a href="/admin/analytics/businesses-branches" class="analytics-link">
				View Branch Analytics →
			</a>
		</div>
		
		<div class="card">
			<h2>Leads Claimed</h2>
			<p>View analytics about lead claim distribution across businesses</p>
			<a href="/admin/analytics/leads-claimed" class="analytics-link">
				View Claims Analytics →
			</a>
		</div>
		
		<div class="card">
			<h2>Geographic Coverage</h2>
			<p>View district-wise coverage and state-level business distribution</p>
			<a href="/admin/analytics/coverage" class="analytics-link">
				View Coverage Analytics →
			</a>
		</div>
		
		<div class="card">
			<h2>Lead Distribution Spread</h2>
			<p>Analyze geographic spread of incoming leads vs business presence</p>
			<a href="/admin/analytics/spread" class="analytics-link">
				View Spread Analytics →
			</a>
		</div>
		
		<div class="card">
			<h2>Business Login Activity</h2>
			<p>Track business engagement through login activity and usage patterns</p>
			<a href="/admin/analytics/business-login" class="analytics-link">
				View Login Analytics →
			</a>
		</div>
		
		<div class="card">
			<h2>Recent Projects</h2>
			<p>Analyze business participation in project showcases and portfolio building</p>
			<a href="/admin/analytics/recent-projects" class="analytics-link">
				View Project Analytics →
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

	/* Analytics grid */
	.analytics-grid {
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

	/* Analytics link styling */
	.analytics-link {
		display: inline-block;
		color: var(--accent-color);
		text-decoration: none;
		font-weight: 600;
		padding: 0.75rem 1.5rem;
		border: 2px solid var(--accent-color);
		border-radius: 4px;
		transition: all 0.3s ease;
	}

	.analytics-link:hover {
		background-color: var(--accent-color);
		color: white;
	}

	/* Coming soon styling */
	.coming-soon {
		display: inline-block;
		color: #999;
		font-style: italic;
		font-weight: 500;
		padding: 0.75rem 1.5rem;
		border: 2px solid #999;
		border-radius: 4px;
		cursor: not-allowed;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.analytics-grid {
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