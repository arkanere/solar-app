<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';

	$: darkMode = $isDarkMode;
	
	// Get data from page data (server-side)
	$: analytics = $page.data.analytics || {};
	$: error = $page.data.error;
	
	// Calculate weekly totals for display
	$: weeklyTotal = analytics.weeklyBreakdown ? 
		analytics.weeklyBreakdown.reduce((sum, week) => sum + week.count, 0) : 0;
	
	// Calculate daily totals for display
	$: dailyTotal = analytics.dailyBreakdown ? 
		analytics.dailyBreakdown.reduce((sum, day) => sum + day.count, 0) : 0;
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="header">
		<a href="/admin/analytics" class="back-link">← Back to Analytics</a>
		<h1>Lead Generation Analytics</h1>
	</div>

	{#if error}
		<div class="error">{error}</div>
	{:else}
		<!-- Main Stats Grid -->
		<div class="stats-grid">
			<div class="stat-card primary">
				<h2>Total Leads</h2>
				<div class="stat-number">{analytics.totalLeads?.toLocaleString() || 0}</div>
				<div class="stat-label">All time</div>
			</div>

			<div class="stat-card">
				<h2>Today</h2>
				<div class="stat-number">{analytics.today || 0}</div>
				<div class="stat-label">New leads today</div>
			</div>

			<div class="stat-card">
				<h2>Last 7 Days</h2>
				<div class="stat-number">{dailyTotal}</div>
				<div class="stat-label">Total this week</div>
			</div>

			<div class="stat-card success">
				<h2>Last 30 Days</h2>
				<div class="stat-number">{analytics.last30Days || 0}</div>
				<div class="stat-label">Total this month</div>
			</div>
		</div>

		<!-- Weekly Breakdown -->
		{#if analytics.weeklyBreakdown && analytics.weeklyBreakdown.length > 0}
			<div class="breakdown-section">
				<h3>Last 4 Weeks - Week by Week</h3>
				<div class="breakdown-grid">
					{#each analytics.weeklyBreakdown as week}
						<div class="breakdown-card">
							<div class="breakdown-header">
								<h4>{week.week}</h4>
								<span class="breakdown-date">{week.weekStart} to {week.weekEnd}</span>
							</div>
							<div class="breakdown-number">{week.count}</div>
							<div class="breakdown-label">leads</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Daily Breakdown -->
		{#if analytics.dailyBreakdown && analytics.dailyBreakdown.length > 0}
			<div class="breakdown-section">
				<h3>Last 7 Days - Day by Day</h3>
				<div class="breakdown-grid daily">
					{#each analytics.dailyBreakdown as day}
						<div class="breakdown-card daily-card">
							<div class="breakdown-header">
								<h4>{day.dayName}</h4>
								<span class="breakdown-date">{day.date}</span>
							</div>
							<div class="breakdown-number">{day.count}</div>
							<div class="breakdown-label">leads</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Actions Section -->
		<div class="actions-section">
			<a href="/admin/leaddata" class="action-link">View All Leads</a>
			<a href="/admin/allclaims" class="action-link">View Lead Claims</a>
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

	/* Loading and error states */
	.loading, .error {
		text-align: center;
		padding: 2rem;
		font-size: 1.1rem;
	}

	.error {
		color: #dc3545;
	}

	/* Stats grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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

	/* Breakdown sections */
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

	.breakdown-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.breakdown-grid.daily {
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
	}

	.breakdown-card {
		padding: 1.5rem;
		border-radius: 8px;
		text-align: center;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.light .breakdown-card {
		background-color: var(--card-light-bg);
		border: 1px solid var(--border-light);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.dark .breakdown-card {
		background-color: var(--card-dark-bg);
		border: 1px solid var(--border-dark);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.breakdown-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.dark .breakdown-card:hover {
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	}

	.breakdown-header {
		margin-bottom: 1rem;
	}

	.breakdown-header h4 {
		font-size: 1.1rem;
		margin-bottom: 0.25rem;
		font-weight: 600;
	}

	.breakdown-date {
		font-size: 0.8rem;
		opacity: 0.7;
	}

	.breakdown-number {
		font-size: 2rem;
		font-weight: 700;
		color: var(--accent-color);
		margin-bottom: 0.25rem;
	}

	.breakdown-label {
		font-size: 0.9rem;
		opacity: 0.8;
	}

	.daily-card .breakdown-number {
		font-size: 1.8rem;
	}

	.daily-card .breakdown-header h4 {
		font-size: 1rem;
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

	/* Responsive design */
	@media (max-width: 768px) {
		.stats-grid {
			grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		}
		
		.breakdown-grid {
			grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		}
		
		.breakdown-grid.daily {
			grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		}
		
		.breakdown-card {
			padding: 1rem;
		}
		
		.daily-card .breakdown-number {
			font-size: 1.5rem;
		}
		
		.stat-number {
			font-size: 2rem;
		}
		
		.breakdown-number {
			font-size: 1.6rem;
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
		.stats-grid {
			grid-template-columns: 1fr 1fr;
		}
		
		.breakdown-grid {
			grid-template-columns: 1fr 1fr;
		}
		
		.breakdown-grid.daily {
			grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
		}
		
		.stat-number {
			font-size: 1.8rem;
		}
		
		.breakdown-number {
			font-size: 1.4rem;
		}
		
		.daily-card .breakdown-number {
			font-size: 1.3rem;
		}
	}
</style>