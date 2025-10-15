<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';

	$: darkMode = $isDarkMode;
	
	// Get data from page data (server-side)
	$: analytics = $page.data.analytics || {};
	$: error = $page.data.error;
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="header">
		<a href="/admin/analytics" class="back-link">← Back to Analytics</a>
		<h1>Business Branches Analytics</h1>
	</div>

	{#if error}
		<div class="error">{error}</div>
	{:else}
		<!-- Main Stats Grid -->
		<div class="stats-grid">
			<div class="stat-card primary">
				<h2>Total Branches</h2>
				<div class="stat-number">{analytics.totalBranches?.toLocaleString() || 0}</div>
				<div class="stat-label">All branch locations</div>
			</div>

			<div class="stat-card success">
				<h2>Businesses with Branches</h2>
				<div class="stat-number">{analytics.businessesWithBranches || 0}</div>
				<div class="stat-label">Main businesses that have branches</div>
			</div>
		</div>

		<!-- Branch Distribution Breakdown -->
		{#if analytics.branchBreakdown}
			<div class="breakdown-section">
				<h3>Branch Distribution by Business</h3>
				<div class="branch-grid">
					<div class="branch-card one-branch">
						<div class="branch-header">
							<h4>1 Branch</h4>
							<span class="branch-description">Single branch location</span>
						</div>
						<div class="branch-number">{analytics.branchBreakdown.oneBranch || 0}</div>
						<div class="branch-label">businesses</div>
					</div>

					<div class="branch-card two-branches">
						<div class="branch-header">
							<h4>2 Branches</h4>
							<span class="branch-description">Two branch locations</span>
						</div>
						<div class="branch-number">{analytics.branchBreakdown.twoBranches || 0}</div>
						<div class="branch-label">businesses</div>
					</div>

					<div class="branch-card three-branches">
						<div class="branch-header">
							<h4>3 Branches</h4>
							<span class="branch-description">Three branch locations</span>
						</div>
						<div class="branch-number">{analytics.branchBreakdown.threeBranches || 0}</div>
						<div class="branch-label">businesses</div>
					</div>

					<div class="branch-card four-branches">
						<div class="branch-header">
							<h4>4 Branches</h4>
							<span class="branch-description">Four branch locations</span>
						</div>
						<div class="branch-number">{analytics.branchBreakdown.fourBranches || 0}</div>
						<div class="branch-label">businesses</div>
					</div>

					<div class="branch-card many-branches">
						<div class="branch-header">
							<h4>5+ Branches</h4>
							<span class="branch-description">More than 4 locations</span>
						</div>
						<div class="branch-number">{analytics.branchBreakdown.moreThanFour || 0}</div>
						<div class="branch-label">businesses</div>
					</div>
				</div>
			</div>
		{/if}


		<!-- Actions Section -->
		<div class="actions-section">
			<a href="/admin/allbusinesses" class="action-link">View All Businesses</a>
			<a href="/admin/analytics/businesses" class="action-link secondary">View Business Analytics</a>
		</div>
	{/if}
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
		--success-color: #28a745;
		--warning-color: #ffc107;
		--info-color: #17a2b8;
		--purple-color: #6f42c1;
		--orange-color: #fd7e14;
		--card-light-bg: #fff;
		--card-dark-bg: #333;
		--border-light: #ddd;
		--border-dark: #555;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	/* Main layout styling */
	main {
		padding: 2rem 1rem;
		font-family: var(--font-family);
		min-height: 100vh;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
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

	/* Header section */
	.header {
		margin-bottom: 2rem;
	}

	.back-link {
		display: inline-block;
		color: var(--accent-color);
		text-decoration: none;
		margin-bottom: 1rem;
		font-weight: 500;
		transition: color 0.3s ease;
	}

	.back-link:hover {
		color: var(--hover-color);
	}

	h1 {
		font-size: 2.2rem;
		margin: 0;
		font-weight: 600;
	}

	/* Error state */
	.error {
		text-align: center;
		padding: 2rem;
		font-size: 1.1rem;
		color: #dc3545;
	}

	/* Stats grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	/* Stat card styling */
	.stat-card {
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		text-align: center;
		transition: transform 0.2s ease;
	}

	.light .stat-card {
		background-color: var(--card-light-bg);
		border: 1px solid var(--border-light);
	}

	.dark .stat-card {
		background-color: var(--card-dark-bg);
		border: 1px solid var(--border-dark);
	}

	.stat-card:hover {
		transform: translateY(-2px);
	}

	.stat-card.primary {
		border-left: 4px solid var(--accent-color);
	}

	.stat-card.success {
		border-left: 4px solid var(--success-color);
	}

	.stat-card h2 {
		font-size: 1rem;
		margin-bottom: 1rem;
		opacity: 0.8;
		font-weight: 500;
	}

	.stat-number {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: var(--accent-color);
	}

	.stat-card.success .stat-number {
		color: var(--success-color);
	}

	.stat-label {
		font-size: 0.9rem;
		opacity: 0.7;
	}

	/* Branch distribution section */
	.breakdown-section {
		margin-bottom: 3rem;
		width: 100%;
	}

	.breakdown-section h3 {
		font-size: 1.5rem;
		margin-bottom: 1.5rem;
		color: var(--accent-color);
		text-align: center;
	}

	.branch-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.branch-card {
		padding: 1.5rem;
		border-radius: 8px;
		text-align: center;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.light .branch-card {
		background-color: var(--card-light-bg);
		border: 1px solid var(--border-light);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.dark .branch-card {
		background-color: var(--card-dark-bg);
		border: 1px solid var(--border-dark);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.branch-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.branch-card.one-branch {
		border-left: 4px solid var(--info-color);
	}

	.branch-card.two-branches {
		border-left: 4px solid var(--success-color);
	}

	.branch-card.three-branches {
		border-left: 4px solid var(--warning-color);
	}

	.branch-card.four-branches {
		border-left: 4px solid var(--orange-color);
	}

	.branch-card.many-branches {
		border-left: 4px solid var(--purple-color);
	}

	.branch-header {
		margin-bottom: 1rem;
	}

	.branch-header h4 {
		font-size: 1.1rem;
		margin-bottom: 0.25rem;
		font-weight: 600;
	}

	.branch-description {
		font-size: 0.8rem;
		opacity: 0.7;
	}

	.branch-number {
		font-size: 2.2rem;
		font-weight: 700;
		color: var(--accent-color);
		margin-bottom: 0.25rem;
	}

	.branch-label {
		font-size: 0.9rem;
		opacity: 0.8;
	}


	/* Actions section */
	.actions-section {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.action-link {
		display: inline-block;
		color: white;
		background-color: var(--accent-color);
		text-decoration: none;
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		font-weight: 600;
		transition: background-color 0.3s ease;
	}

	.action-link:hover {
		background-color: var(--hover-color);
	}

	.action-link.secondary {
		background-color: #6c757d;
	}

	.action-link.secondary:hover {
		background-color: #545b62;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.stats-grid {
			grid-template-columns: 1fr;
		}
		
		.branch-grid {
			grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		}
		
		.branch-card {
			padding: 1rem;
		}
		
		.stat-number {
			font-size: 2rem;
		}
		
		.branch-number {
			font-size: 1.8rem;
		}
		
		.breakdown-section h3 {
			font-size: 1.3rem;
		}
		
		h1 {
			font-size: 1.8rem;
		}
		
		.actions-section {
			flex-direction: column;
			align-items: center;
		}
	}

	@media (max-width: 480px) {
		.branch-grid {
			grid-template-columns: 1fr 1fr;
		}
		
		.stat-number {
			font-size: 1.8rem;
		}
		
		.branch-number {
			font-size: 1.6rem;
		}
	}
</style>