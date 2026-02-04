<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';

	$: darkMode = $isDarkMode;
	
	// Get data from page data (server-side)
	$: analytics = $page.data.analytics || {};
	$: error = $page.data.error;

	// Group district details by state for better display
	$: districtsByState = analytics.districtDetails?.reduce((acc, item) => {
		if (!acc[item.state]) {
			acc[item.state] = {
				covered: [],
				uncovered: []
			};
		}
		if (item.has_business) {
			acc[item.state].covered.push(item.district);
		} else {
			acc[item.state].uncovered.push(item.district);
		}
		return acc;
	}, {}) || {};
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="header">
		<a href="/us/analytics" class="back-link">← Back to Analytics</a>
		<h1>Geographic Coverage Analytics</h1>
	</div>

	{#if error}
		<div class="error">{error}</div>
	{:else}
		<!-- Main Stats Grid -->
		<div class="stats-grid">
			<div class="stat-card primary">
				<h2>Total Districts</h2>
				<div class="stat-number">{analytics.totalDistricts?.toLocaleString() || 0}</div>
				<div class="stat-label">Districts in India</div>
			</div>
			
			<div class="stat-card success">
				<h2>Districts Covered</h2>
				<div class="stat-number">{analytics.coveredDistricts || 0}</div>
				<div class="stat-label">With at least 1 business</div>
			</div>
			
			<div class="stat-card info">
				<h2>Coverage %</h2>
				<div class="stat-number">{analytics.coveragePercentage || 0}%</div>
				<div class="stat-label">Geographic coverage</div>
			</div>
		</div>

		<!-- State-wise Coverage Table -->
		{#if analytics.statewiseCoverage && analytics.statewiseCoverage.length > 0}
			<div class="table-section">
				<h3>State-wise Coverage Breakdown</h3>
				<div class="table-wrapper">
					<table class="coverage-table">
						<thead>
							<tr>
								<th>State</th>
								<th>Total Districts</th>
								<th>Covered Districts</th>
								<th>Coverage %</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{#each analytics.statewiseCoverage as state}
								<tr>
									<td class="state-name">{state.state}</td>
									<td class="text-center">{state.total_districts}</td>
									<td class="text-center">{state.covered_districts}</td>
									<td class="text-center">
										<span class="percentage" class:high={state.coverage_percentage >= 50} class:medium={state.coverage_percentage >= 20 && state.coverage_percentage < 50} class:low={state.coverage_percentage < 20}>
											{state.coverage_percentage}%
										</span>
									</td>
									<td class="text-center">
										<span class="status-badge" class:excellent={state.coverage_percentage >= 80} class:good={state.coverage_percentage >= 50 && state.coverage_percentage < 80} class:fair={state.coverage_percentage >= 20 && state.coverage_percentage < 50} class:poor={state.coverage_percentage < 20}>
											{#if state.coverage_percentage >= 80}
												Excellent
											{:else if state.coverage_percentage >= 50}
												Good
											{:else if state.coverage_percentage >= 20}
												Fair
											{:else}
												Poor
											{/if}
										</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}

		<!-- Actions Section -->
		<div class="actions-section">
			<a href="/us/allbusinesses" class="action-link">View All Businesses</a>
			<a href="/us/analytics/businesses" class="action-link secondary">View Business Analytics</a>
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
		--danger-color: #dc3545;
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

	.stat-card.info {
		border-left: 4px solid var(--info-color);
	}

	.stat-card.success .stat-number {
		color: var(--success-color);
	}

	.stat-card.info .stat-number {
		color: var(--info-color);
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

	.stat-label {
		font-size: 0.9rem;
		opacity: 0.7;
	}

	/* Table section */
	.table-section {
		margin-bottom: 3rem;
	}

	.table-section h3 {
		font-size: 1.5rem;
		margin-bottom: 1.5rem;
		color: var(--accent-color);
		text-align: center;
	}

	.table-wrapper {
		overflow-x: auto;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.coverage-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	.light .coverage-table {
		background-color: var(--card-light-bg);
		border: 1px solid var(--border-light);
	}

	.dark .coverage-table {
		background-color: var(--card-dark-bg);
		border: 1px solid var(--border-dark);
	}

	.coverage-table thead th {
		padding: 1rem;
		text-align: left;
		font-weight: 600;
		border-bottom: 2px solid var(--accent-color);
		color: var(--accent-color);
	}

	.coverage-table tbody td {
		padding: 0.75rem 1rem;
	}

	.light .coverage-table tbody tr {
		border-bottom: 1px solid var(--border-light);
	}

	.dark .coverage-table tbody tr {
		border-bottom: 1px solid var(--border-dark);
	}

	.light .coverage-table tbody tr:hover {
		background-color: #f8f9fa;
	}

	.dark .coverage-table tbody tr:hover {
		background-color: #444;
	}

	.text-center {
		text-align: center;
	}

	.state-name {
		font-weight: 600;
		color: var(--accent-color);
	}

	.percentage.high {
		color: var(--success-color);
		font-weight: 600;
	}

	.percentage.medium {
		color: var(--warning-color);
		font-weight: 600;
	}

	.percentage.low {
		color: var(--danger-color);
		font-weight: 600;
	}

	.status-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.status-badge.excellent {
		background-color: rgba(40, 167, 69, 0.1);
		color: var(--success-color);
		border: 1px solid var(--success-color);
	}

	.status-badge.good {
		background-color: rgba(23, 162, 184, 0.1);
		color: var(--info-color);
		border: 1px solid var(--info-color);
	}

	.status-badge.fair {
		background-color: rgba(255, 193, 7, 0.1);
		color: var(--warning-color);
		border: 1px solid var(--warning-color);
	}

	.status-badge.poor {
		background-color: rgba(220, 53, 69, 0.1);
		color: var(--danger-color);
		border: 1px solid var(--danger-color);
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
		
		.coverage-table {
			font-size: 0.8rem;
		}
		
		.coverage-table thead th,
		.coverage-table tbody td {
			padding: 0.5rem;
		}
		
		.stat-number {
			font-size: 2rem;
		}
		
		.table-section h3 {
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
		.stat-number {
			font-size: 1.8rem;
		}
		
		.coverage-table thead th,
		.coverage-table tbody td {
			padding: 0.4rem;
		}
		
		.status-badge {
			font-size: 0.7rem;
			padding: 0.2rem 0.5rem;
		}
	}
</style>