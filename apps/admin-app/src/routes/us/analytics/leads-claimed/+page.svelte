<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';

	$: darkMode = $isDarkMode;
	
	// Get data from page data (server-side)
	$: analytics = $page.data.analytics || {};
	$: error = $page.data.error;

	// State for expandable sections
	let expandedCategory = null;

	// Toggle function for expanding/collapsing lead lists
	function toggleCategory(category) {
		expandedCategory = expandedCategory === category ? null : category;
	}

	// Keyboard event handler for accessibility
	function handleKeydown(event, category) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleCategory(category);
		}
	}

	// Format date for display
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	// Get category data
	function getCategoryData(category) {
		return analytics.leadsByCategory?.[category] || [];
	}

	// Get category count
	function getCategoryCount(category) {
		return analytics.claimDistribution?.[category] || 0;
	}
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="header">
		<a href="/us/analytics" class="back-link">← Back to Analytics</a>
		<h1>Leads Claimed Analytics</h1>
	</div>

	{#if error}
		<div class="error">{error}</div>
	{:else}
		<!-- Main Stats Grid -->
		<div class="stats-grid">
			<div class="stat-card primary">
				<h2>Total Leads</h2>
				<div class="stat-number">{analytics.totalLeads?.toLocaleString() || 0}</div>
				<div class="stat-label">Available for claiming</div>
			</div>
			
			<div class="stat-card success">
				<h2>% Leads Claimed</h2>
				<div class="stat-number">{analytics.totalLeads > 0 ? ((analytics.totalLeads - (analytics.claimDistribution?.zeroClaims || 0)) / analytics.totalLeads * 100).toFixed(1) : 0}%</div>
				<div class="stat-label">At least one claim</div>
			</div>
		</div>

		<!-- Claim Distribution Breakdown -->
		{#if analytics.claimDistribution}
			<div class="breakdown-section">
				<h3>Lead Distribution by Number of Claims</h3>
				<div class="claim-grid">
					<div class="claim-card unclaimed clickable" class:expanded={expandedCategory === 'zeroClaims'} on:click={() => toggleCategory('zeroClaims')} on:keydown={(e) => handleKeydown(e, 'zeroClaims')} role="button" tabindex="0">
						<div class="claim-header">
							<h4>0 Claims</h4>
							<span class="claim-description">Unclaimed leads</span>
						</div>
						<div class="claim-number">{getCategoryCount('zeroClaims')}</div>
						<div class="claim-label">leads</div>
						<div class="expand-icon">{expandedCategory === 'zeroClaims' ? '▼' : '▶'}</div>
					</div>

					<div class="claim-card one-claim clickable" class:expanded={expandedCategory === 'oneClaim'} on:click={() => toggleCategory('oneClaim')} on:keydown={(e) => handleKeydown(e, 'oneClaim')} role="button" tabindex="0">
						<div class="claim-header">
							<h4>1 Claim</h4>
							<span class="claim-description">Claimed by 1 business</span>
						</div>
						<div class="claim-number">{getCategoryCount('oneClaim')}</div>
						<div class="claim-label">leads</div>
						<div class="expand-icon">{expandedCategory === 'oneClaim' ? '▼' : '▶'}</div>
					</div>

					<div class="claim-card two-claims clickable" class:expanded={expandedCategory === 'twoClaims'} on:click={() => toggleCategory('twoClaims')} on:keydown={(e) => handleKeydown(e, 'twoClaims')} role="button" tabindex="0">
						<div class="claim-header">
							<h4>2 Claims</h4>
							<span class="claim-description">Claimed by 2 businesses</span>
						</div>
						<div class="claim-number">{getCategoryCount('twoClaims')}</div>
						<div class="claim-label">leads</div>
						<div class="expand-icon">{expandedCategory === 'twoClaims' ? '▼' : '▶'}</div>
					</div>

					<div class="claim-card three-claims clickable" class:expanded={expandedCategory === 'threeClaims'} on:click={() => toggleCategory('threeClaims')} on:keydown={(e) => handleKeydown(e, 'threeClaims')} role="button" tabindex="0">
						<div class="claim-header">
							<h4>3 Claims</h4>
							<span class="claim-description">Claimed by 3 businesses</span>
						</div>
						<div class="claim-number">{getCategoryCount('threeClaims')}</div>
						<div class="claim-label">leads</div>
						<div class="expand-icon">{expandedCategory === 'threeClaims' ? '▼' : '▶'}</div>
					</div>

					<div class="claim-card four-claims clickable" class:expanded={expandedCategory === 'fourClaims'} on:click={() => toggleCategory('fourClaims')} on:keydown={(e) => handleKeydown(e, 'fourClaims')} role="button" tabindex="0">
						<div class="claim-header">
							<h4>4 Claims</h4>
							<span class="claim-description">Claimed by 4 businesses</span>
						</div>
						<div class="claim-number">{getCategoryCount('fourClaims')}</div>
						<div class="claim-label">leads</div>
						<div class="expand-icon">{expandedCategory === 'fourClaims' ? '▼' : '▶'}</div>
					</div>

					<div class="claim-card many-claims clickable" class:expanded={expandedCategory === 'fiveOrMoreClaims'} on:click={() => toggleCategory('fiveOrMoreClaims')} on:keydown={(e) => handleKeydown(e, 'fiveOrMoreClaims')} role="button" tabindex="0">
						<div class="claim-header">
							<h4>5+ Claims</h4>
							<span class="claim-description">High-demand leads</span>
						</div>
						<div class="claim-number">{getCategoryCount('fiveOrMoreClaims')}</div>
						<div class="claim-label">leads</div>
						<div class="expand-icon">{expandedCategory === 'fiveOrMoreClaims' ? '▼' : '▶'}</div>
					</div>
				</div>

				<!-- Expandable Lead Lists -->
				{#if expandedCategory}
					<div class="leads-section-header">
						<h4>Leads with {expandedCategory === 'zeroClaims' ? '0' : expandedCategory === 'oneClaim' ? '1' : expandedCategory === 'twoClaims' ? '2' : expandedCategory === 'threeClaims' ? '3' : expandedCategory === 'fourClaims' ? '4' : '5+'} claim{expandedCategory === 'oneClaim' ? '' : 's'}</h4>
					</div>
					
					{#if getCategoryData(expandedCategory).length > 0}
						<div class="leads-grid">
							{#each getCategoryData(expandedCategory) as lead}
								<div class="lead-card">
									<div class="lead-info">
										<h5>{lead.name}</h5>
										<p class="lead-details">
											<span class="lead-phone">{lead.phone}</span>
											{#if lead.email}
												• <span class="lead-email">{lead.email}</span>
											{/if}
											<br>
											<span class="lead-location">{lead.pin_code}, {lead.district}</span>
											• <span class="lead-date">Created: {formatDate(lead.created_at)}</span>
										</p>
										
										<!-- Claiming Businesses -->
										{#if lead.claiming_businesses && lead.claiming_businesses.length > 0}
											<div class="claiming-businesses">
												<span class="businesses-label">Claimed by:</span>
												<div class="businesses-list">
													{#each lead.claiming_businesses as business, index}
														<span class="business-name">{business}</span>{#if index < lead.claiming_businesses.length - 1}, {/if}
													{/each}
												</div>
											</div>
										{:else if lead.claim_count > 0}
											<div class="claiming-businesses">
												<span class="businesses-label">Claimed by:</span>
												<span class="business-unavailable">Business names not available</span>
											</div>
										{/if}
									</div>
									<div class="lead-meta">
										<span class="lead-id">ID: {lead.id}</span>
										<span class="lead-claims">Claims: {lead.claim_count || 0}</span>
									</div>
								</div>
							{/each}
						</div>
						
						{#if getCategoryData(expandedCategory).length === 50}
							<div class="more-leads-notice">
								Showing first 50 leads. <a href="/us/leaddata">View all leads →</a>
							</div>
						{/if}
					{:else}
						<div class="no-leads">No leads found in this category.</div>
					{/if}
				{/if}
			</div>
		{/if}

		<!-- Actions Section -->
		<div class="actions-section">
			<a href="/us/leaddata" class="action-link">View All Leads</a>
			<a href="/us/analytics/lead-generation" class="action-link secondary">View Lead Generation</a>
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
		justify-content: center;
	}

	/* Stat card styling */
	.stat-card {
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		text-align: center;
		transition: transform 0.2s ease;
		max-width: 350px;
		margin: 0 auto;
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

	.stat-card.success .stat-number {
		color: var(--success-color);
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

	/* Claim distribution section */
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

	.claim-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.claim-card {
		padding: 1.5rem;
		border-radius: 8px;
		text-align: center;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.light .claim-card {
		background-color: var(--card-light-bg);
		border: 1px solid var(--border-light);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.dark .claim-card {
		background-color: var(--card-dark-bg);
		border: 1px solid var(--border-dark);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.claim-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	/* Clickable cards */
	.claim-card.clickable {
		cursor: pointer;
		position: relative;
		transition: all 0.3s ease;
	}

	.claim-card.clickable:hover {
		transform: translateY(-3px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
	}

	.claim-card.expanded {
		border-color: var(--accent-color);
		box-shadow: 0 4px 12px rgba(0, 86, 179, 0.2);
	}

	.expand-icon {
		position: absolute;
		top: 1rem;
		right: 1rem;
		font-size: 0.8rem;
		opacity: 0.6;
		transition: opacity 0.3s ease;
	}

	.claim-card.clickable:hover .expand-icon {
		opacity: 1;
	}

	.claim-card.unclaimed {
		border-left: 4px solid var(--danger-color);
	}

	.claim-card.one-claim {
		border-left: 4px solid var(--info-color);
	}

	.claim-card.two-claims {
		border-left: 4px solid var(--success-color);
	}

	.claim-card.three-claims {
		border-left: 4px solid var(--warning-color);
	}

	.claim-card.four-claims {
		border-left: 4px solid var(--orange-color);
	}

	.claim-card.many-claims {
		border-left: 4px solid var(--purple-color);
	}

	.claim-header {
		margin-bottom: 1rem;
	}

	.claim-header h4 {
		font-size: 1.1rem;
		margin-bottom: 0.25rem;
		font-weight: 600;
	}

	.claim-description {
		font-size: 0.8rem;
		opacity: 0.7;
	}

	.claim-number {
		font-size: 2.2rem;
		font-weight: 700;
		color: var(--accent-color);
		margin-bottom: 0.25rem;
	}

	.claim-label {
		font-size: 0.9rem;
		opacity: 0.8;
	}

	/* Leads section header */
	.leads-section-header {
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.leads-section-header h4 {
		color: var(--accent-color);
		font-size: 1.3rem;
		text-align: center;
		margin: 0;
	}

	/* Leads grid */
	.leads-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.lead-card {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 1.5rem;
		border-radius: 8px;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.light .lead-card {
		background-color: var(--card-light-bg);
		border: 1px solid var(--border-light);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.dark .lead-card {
		background-color: var(--card-dark-bg);
		border: 1px solid var(--border-dark);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.lead-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.lead-info {
		flex: 1;
	}

	.lead-info h5 {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		font-weight: 600;
	}

	.lead-details {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.4;
		opacity: 0.8;
	}

	.lead-phone {
		font-weight: 500;
		color: var(--accent-color);
	}

	.lead-email {
		color: var(--success-color);
	}

	.lead-location {
		color: var(--info-color);
	}

	.lead-date {
		opacity: 0.7;
	}

	/* Claiming businesses section */
	.claiming-businesses {
		margin-top: 0.75rem;
		padding: 0.5rem;
		border-radius: 4px;
	}

	.light .claiming-businesses {
		background-color: #f1f3f4;
		border-left: 3px solid var(--accent-color);
	}

	.dark .claiming-businesses {
		background-color: #555;
		border-left: 3px solid var(--accent-color);
	}

	.businesses-label {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--accent-color);
		display: block;
		margin-bottom: 0.25rem;
	}

	.businesses-list {
		font-size: 0.85rem;
		line-height: 1.3;
	}

	.business-name {
		font-weight: 500;
		color: var(--success-color);
		background-color: rgba(40, 167, 69, 0.1);
		padding: 0.15rem 0.4rem;
		border-radius: 12px;
		margin-right: 0.25rem;
		display: inline-block;
		margin-bottom: 0.2rem;
	}

	.business-unavailable {
		font-size: 0.8rem;
		color: var(--warning-color);
		font-style: italic;
	}

	.lead-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.25rem;
		font-size: 0.8rem;
		opacity: 0.7;
	}

	.lead-id {
		font-weight: 500;
	}

	.lead-claims {
		background-color: var(--accent-color);
		color: white;
		padding: 0.2rem 0.5rem;
		border-radius: 12px;
		font-size: 0.7rem;
	}

	.no-leads {
		text-align: center;
		padding: 2rem;
		opacity: 0.6;
		font-style: italic;
	}

	.more-leads-notice {
		margin-top: 1rem;
		padding: 0.75rem;
		text-align: center;
		border-radius: 4px;
		font-size: 0.9rem;
	}

	.light .more-leads-notice {
		background-color: #e9ecef;
	}

	.dark .more-leads-notice {
		background-color: #555;
	}

	.more-leads-notice a {
		color: var(--accent-color);
		text-decoration: none;
		font-weight: 500;
	}

	.more-leads-notice a:hover {
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
		
		.claim-grid {
			grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		}
		
		.claim-card {
			padding: 1rem;
		}
		
		.stat-number {
			font-size: 2rem;
		}
		
		.claim-number {
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

		.leads-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.lead-card {
			flex-direction: column;
			gap: 1rem;
		}

		.lead-meta {
			align-items: flex-start;
			flex-direction: row;
			justify-content: space-between;
		}
	}

	@media (max-width: 480px) {
		.claim-grid {
			grid-template-columns: 1fr 1fr;
		}
		
		.stat-number {
			font-size: 1.8rem;
		}
		
		.claim-number {
			font-size: 1.6rem;
		}
	}
</style>