<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';

	$: darkMode = $isDarkMode;
	
	// Get data from page data (server-side)
	$: analytics = $page.data.analytics || {};
	$: error = $page.data.error;

	// State for expandable business lists
	let selectedCategory = null;

	// Toggle function for expanding/collapsing business lists
	function toggleBusinessList(category) {
		selectedCategory = selectedCategory === category ? null : category;
	}

	// Format date for display
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	// Get businesses for a specific category
	function getCategoryBusinesses(category) {
		return analytics.businessListsData?.[category] || [];
	}

	// Get category display name and project count
	function getCategoryInfo(category) {
		const info = {
			zeroProjects: { name: '0 Projects', count: 0 },
			oneProject: { name: '1 Project', count: 1 },
			twoProjects: { name: '2 Projects', count: 2 },
			threeProjects: { name: '3 Projects', count: 3 },
			fourProjects: { name: '4 Projects', count: 4 },
			fiveProjects: { name: '5 Projects', count: 5 },
			moreThanFiveProjects: { name: '5+ Projects', count: '5+' }
		};
		return info[category] || { name: 'Unknown', count: '?' };
	}
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="header">
		<a href="/admin/analytics" class="back-link">← Back to Analytics</a>
		<h1>Recent Projects Analytics</h1>
		<p class="subtitle">Track business engagement through project showcase activity</p>
	</div>

	{#if error}
		<div class="error">{error}</div>
	{:else}
		<!-- Main Stats Grid -->
		<div class="stats-grid">
			<div class="stat-card primary">
				<h2>Total Businesses</h2>
				<div class="stat-number">{analytics.totalBusinesses?.toLocaleString() || 0}</div>
				<div class="stat-label">Active registered businesses</div>
			</div>
			
			<div class="stat-card success">
				<h2>Businesses with Projects</h2>
				<div class="stat-number">{analytics.businessesWithProjects || 0}</div>
				<div class="stat-label">Posted at least 1 project</div>
			</div>
			
			<div class="stat-card info">
				<h2>Project Participation</h2>
				<div class="stat-number">{analytics.percentageWithProjects || 0}%</div>
				<div class="stat-label">Businesses showcasing work</div>
			</div>
		</div>

		<!-- Project Distribution Breakdown -->
		{#if analytics.projectDistribution}
			<div class="breakdown-section">
				<h3>Project Count Distribution</h3>
				<div class="project-grid">
					<div class="project-card zero-projects clickable" class:selected={selectedCategory === 'zeroProjects'} on:click={() => toggleBusinessList('zeroProjects')} role="button" tabindex="0">
						<div class="project-header">
							<h4>0 Projects</h4>
							<span class="project-description">No projects posted</span>
						</div>
						<div class="project-number">
							{analytics.projectDistribution.zeroProjects || 0}
							<span class="expand-icon">{selectedCategory === 'zeroProjects' ? '▼' : '▶'}</span>
						</div>
						<div class="project-label">businesses</div>
					</div>

					<div class="project-card one-project clickable" class:selected={selectedCategory === 'oneProject'} on:click={() => toggleBusinessList('oneProject')} role="button" tabindex="0">
						<div class="project-header">
							<h4>1 Project</h4>
							<span class="project-description">Single project showcase</span>
						</div>
						<div class="project-number">
							{analytics.projectDistribution.oneProject || 0}
							<span class="expand-icon">{selectedCategory === 'oneProject' ? '▼' : '▶'}</span>
						</div>
						<div class="project-label">businesses</div>
					</div>

					<div class="project-card two-projects clickable" class:selected={selectedCategory === 'twoProjects'} on:click={() => toggleBusinessList('twoProjects')} role="button" tabindex="0">
						<div class="project-header">
							<h4>2 Projects</h4>
							<span class="project-description">Two project showcases</span>
						</div>
						<div class="project-number">
							{analytics.projectDistribution.twoProjects || 0}
							<span class="expand-icon">{selectedCategory === 'twoProjects' ? '▼' : '▶'}</span>
						</div>
						<div class="project-label">businesses</div>
					</div>

					<div class="project-card three-projects clickable" class:selected={selectedCategory === 'threeProjects'} on:click={() => toggleBusinessList('threeProjects')} role="button" tabindex="0">
						<div class="project-header">
							<h4>3 Projects</h4>
							<span class="project-description">Three project showcases</span>
						</div>
						<div class="project-number">
							{analytics.projectDistribution.threeProjects || 0}
							<span class="expand-icon">{selectedCategory === 'threeProjects' ? '▼' : '▶'}</span>
						</div>
						<div class="project-label">businesses</div>
					</div>

					<div class="project-card four-projects clickable" class:selected={selectedCategory === 'fourProjects'} on:click={() => toggleBusinessList('fourProjects')} role="button" tabindex="0">
						<div class="project-header">
							<h4>4 Projects</h4>
							<span class="project-description">Four project showcases</span>
						</div>
						<div class="project-number">
							{analytics.projectDistribution.fourProjects || 0}
							<span class="expand-icon">{selectedCategory === 'fourProjects' ? '▼' : '▶'}</span>
						</div>
						<div class="project-label">businesses</div>
					</div>

					<div class="project-card five-projects clickable" class:selected={selectedCategory === 'fiveProjects'} on:click={() => toggleBusinessList('fiveProjects')} role="button" tabindex="0">
						<div class="project-header">
							<h4>5 Projects</h4>
							<span class="project-description">Five project showcases</span>
						</div>
						<div class="project-number">
							{analytics.projectDistribution.fiveProjects || 0}
							<span class="expand-icon">{selectedCategory === 'fiveProjects' ? '▼' : '▶'}</span>
						</div>
						<div class="project-label">businesses</div>
					</div>

					<div class="project-card many-projects clickable" class:selected={selectedCategory === 'moreThanFiveProjects'} on:click={() => toggleBusinessList('moreThanFiveProjects')} role="button" tabindex="0">
						<div class="project-header">
							<h4>5+ Projects</h4>
							<span class="project-description">Highly active businesses</span>
						</div>
						<div class="project-number">
							{analytics.projectDistribution.moreThanFiveProjects || 0}
							<span class="expand-icon">{selectedCategory === 'moreThanFiveProjects' ? '▼' : '▶'}</span>
						</div>
						<div class="project-label">businesses</div>
					</div>
				</div>

				<!-- Expandable Business Lists -->
				{#if selectedCategory}
					<div class="business-list-section">
						<div class="business-list-header">
							<h4>Businesses with {getCategoryInfo(selectedCategory).name} ({getCategoryBusinesses(selectedCategory).length} businesses)</h4>
						</div>
						
						{#if getCategoryBusinesses(selectedCategory).length > 0}
							<div class="businesses-grid">
								{#each getCategoryBusinesses(selectedCategory) as business}
									<div class="business-card">
										<div class="business-info">
											<h5>{business.businessname}</h5>
											<p class="business-details">
												<span class="business-location">{business.district}{business.state ? `, ${business.state}` : ''}</span>
												<br>
												<span class="business-date">Registered: {formatDate(business.created_at)}</span>
											</p>
											
											<!-- Project Count Badge -->
											<div class="project-count-badge">
												<span class="badge-label">Projects:</span>
												<span class="badge-value">{business.project_count}</span>
											</div>
										</div>
										<div class="business-meta">
											<span class="business-slug">@{business.slug}</span>
										</div>
									</div>
								{/each}
							</div>
							
							{#if getCategoryBusinesses(selectedCategory).length === 50}
								<div class="more-businesses-notice">
									Showing first 50 businesses. <a href="/admin/allbusinesses">View all businesses →</a>
								</div>
							{/if}
						{:else}
							<div class="no-businesses">No businesses found in this category.</div>
						{/if}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Actions Section -->
		<div class="actions-section">
			<a href="/admin/allrecentprojects" class="action-link">View All Projects</a>
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
		text-align: center;
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
		margin: 0 0 0.5rem 0;
		font-weight: 600;
	}

	.subtitle {
		font-size: 1rem;
		opacity: 0.8;
		margin: 0;
		font-style: italic;
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

	/* Project distribution section */
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

	.project-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1.5rem;
	}

	.project-card {
		padding: 1.5rem;
		border-radius: 8px;
		text-align: center;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.light .project-card {
		background-color: var(--card-light-bg);
		border: 1px solid var(--border-light);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.dark .project-card {
		background-color: var(--card-dark-bg);
		border: 1px solid var(--border-dark);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.project-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.project-card.zero-projects {
		border-left: 4px solid var(--danger-color);
	}

	.project-card.one-project {
		border-left: 4px solid var(--info-color);
	}

	.project-card.two-projects {
		border-left: 4px solid var(--success-color);
	}

	.project-card.three-projects {
		border-left: 4px solid var(--warning-color);
	}

	.project-card.four-projects {
		border-left: 4px solid var(--orange-color);
	}

	.project-card.five-projects {
		border-left: 4px solid var(--purple-color);
	}

	.project-card.many-projects {
		border-left: 4px solid var(--accent-color);
	}

	.project-header {
		margin-bottom: 1rem;
	}

	.project-header h4 {
		font-size: 1.1rem;
		margin-bottom: 0.25rem;
		font-weight: 600;
	}

	.project-description {
		font-size: 0.8rem;
		opacity: 0.7;
	}

	.project-number {
		font-size: 2.2rem;
		font-weight: 700;
		color: var(--accent-color);
		margin-bottom: 0.25rem;
	}

	.project-label {
		font-size: 0.9rem;
		opacity: 0.8;
	}

	/* Clickable project cards */
	.project-card.clickable {
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.project-card.clickable:hover {
		transform: translateY(-4px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
	}

	.project-card.selected {
		border-color: var(--accent-color);
		box-shadow: 0 4px 12px rgba(0, 86, 179, 0.2);
	}

	.expand-icon {
		font-size: 0.8rem;
		margin-left: 0.5rem;
		opacity: 0.7;
		transition: opacity 0.3s ease;
	}

	.project-card.clickable:hover .expand-icon {
		opacity: 1;
	}

	/* Business list section */
	.business-list-section {
		margin-top: 2rem;
		padding: 1.5rem;
		border-radius: 8px;
		border: 1px solid var(--accent-color);
	}

	.light .business-list-section {
		background-color: rgba(0, 86, 179, 0.02);
	}

	.dark .business-list-section {
		background-color: rgba(0, 86, 179, 0.08);
	}

	.business-list-header h4 {
		color: var(--accent-color);
		font-size: 1.3rem;
		text-align: center;
		margin: 0 0 1.5rem 0;
	}

	/* Businesses grid */
	.businesses-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.business-card {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 1.5rem;
		border-radius: 8px;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.light .business-card {
		background-color: var(--card-light-bg);
		border: 1px solid var(--border-light);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.dark .business-card {
		background-color: var(--card-dark-bg);
		border: 1px solid var(--border-dark);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.business-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.business-info {
		flex: 1;
	}

	.business-info h5 {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--accent-color);
	}

	.business-details {
		margin: 0 0 1rem 0;
		font-size: 0.9rem;
		line-height: 1.4;
		opacity: 0.8;
	}

	.business-location {
		font-weight: 500;
		color: var(--info-color);
	}

	.business-date {
		opacity: 0.7;
	}

	.project-count-badge {
		display: inline-block;
	}

	.badge-label {
		font-weight: 600;
		color: var(--accent-color);
		font-size: 0.85rem;
	}

	.badge-value {
		background-color: var(--success-color);
		color: white;
		padding: 0.2rem 0.6rem;
		border-radius: 12px;
		font-size: 0.8rem;
		font-weight: 600;
		margin-left: 0.5rem;
	}

	.business-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.25rem;
		font-size: 0.8rem;
		opacity: 0.7;
	}

	.business-slug {
		font-weight: 500;
		font-family: monospace;
		color: var(--purple-color);
	}

	.no-businesses {
		text-align: center;
		padding: 2rem;
		opacity: 0.6;
		font-style: italic;
	}

	.more-businesses-notice {
		margin-top: 1rem;
		padding: 0.75rem;
		text-align: center;
		border-radius: 4px;
		font-size: 0.9rem;
	}

	.light .more-businesses-notice {
		background-color: #e9ecef;
	}

	.dark .more-businesses-notice {
		background-color: #555;
	}

	.more-businesses-notice a {
		color: var(--accent-color);
		text-decoration: none;
		font-weight: 500;
	}

	.more-businesses-notice a:hover {
		text-decoration: underline;
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
		
		.project-grid {
			grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		}
		
		.project-card {
			padding: 1rem;
		}
		
		.stat-number {
			font-size: 2rem;
		}
		
		.project-number {
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

		.businesses-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.business-card {
			flex-direction: column;
			gap: 1rem;
		}

		.business-meta {
			align-items: flex-start;
			flex-direction: row;
			justify-content: space-between;
		}
	}

	@media (max-width: 480px) {
		.project-grid {
			grid-template-columns: 1fr 1fr;
		}
		
		.stat-number {
			font-size: 1.8rem;
		}
		
		.project-number {
			font-size: 1.6rem;
		}
	}
</style>