<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';

	let businesses = $page.data.businesses || [];
	let errorMessage = $page.data.errorMessage;
	let totalCount = $page.data.totalCount || 0;
	let businessCount = $page.data.businessCount || 0;
	let noEngagementCount = $page.data.noEngagementCount || 0;
	let tier1Count = $page.data.tier1Count || 0;
	let tier2Count = $page.data.tier2Count || 0;
	let tier3Count = $page.data.tier3Count || 0;

	// Filter state
	let selectedEngagement = 'all';
	$: filteredBusinesses = filterBusinessesByEngagement(businesses, selectedEngagement);

	// Calculate engagement counts
	$: highEngagementCount = businesses.filter(b => getEngagementLevel(b) === 'high').length;
	$: mediumEngagementCount = businesses.filter(b => getEngagementLevel(b) === 'medium').length;

	$: darkMode = $isDarkMode;

	// Get tier display text
	function getTierDisplay(business) {
		if (!business.businessfilled) return 'Tier-1';
		if (business.tier3) return 'Tier-3';
		return 'Tier-2';
	}

	// Get tier class for styling
	function getTierClass(business) {
		if (!business.businessfilled) return 'tier1';
		if (business.tier3) return 'tier3';
		return 'tier2';
	}

	// Format date for display
	function formatDate(dateString) {
		if (!dateString) return 'Never';
		return new Date(dateString).toLocaleDateString('en-IN', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// Calculate days since last lead
	function getDaysSinceLastLead(dateString) {
		if (!dateString) return null;
		const leadDate = new Date(dateString);
		const today = new Date();
		const diffTime = Math.abs(today - leadDate);
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	}

	// Get engagement level based on non-exclusive available vs claimed leads
	function getEngagementLevel(business) {
		const availableLeads = business.non_exclusive_available_count || 0;
		const claimedLeads = business.claimed_leads_count || 0;

		// High Engagement: No available leads left (0) AND has claimed leads (> 0)
		// They have claimed all available leads
		if (availableLeads === 0 && claimedLeads > 0) {
			return 'high';
		}
		
		// Medium Engagement: Has both available leads AND claimed leads
		// They are actively claiming but haven't claimed everything
		if (availableLeads > 0 && claimedLeads > 0) {
			return 'medium';
		}
		
		// No Engagement: Has available leads (> 0) BUT no claimed leads (0)
		// They have opportunities but haven't taken action
		if (availableLeads > 0 && claimedLeads === 0) {
			return 'none';
		}
		
		// Edge case: No available leads AND no claimed leads
		// This shouldn't appear in the list but handle gracefully
		return 'none';
	}

	function getEngagementClass(level) {
		const classes = {
			'high': 'engagement-high',
			'medium': 'engagement-medium',
			'low': 'engagement-low',
			'none': 'engagement-none'
		};
		return classes[level] || 'engagement-none';
	}

	function getEngagementText(level) {
		const texts = {
			'high': 'High Engagement',
			'medium': 'Medium Engagement',
			'low': 'Low Engagement',
			'none': 'No Engagement'
		};
		return texts[level] || 'Unknown';
	}

	// Filter businesses by engagement level
	function filterBusinessesByEngagement(businessList, engagementFilter) {
		if (engagementFilter === 'all') {
			return businessList;
		}
		
		return businessList.filter(business => {
			const level = getEngagementLevel(business);
			return level === engagementFilter;
		});
	}
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="header">
		<h1>Eligible Businesses</h1>
		<div class="summary-stats">
			<div class="stat-card">
				<h3>Total Businesses</h3>
				<p class="stat-number">{totalCount}</p>
			</div>
			<div class="stat-card high-engagement">
				<h3>High Engagement</h3>
				<p class="stat-number">{highEngagementCount}</p>
			</div>
			<div class="stat-card medium-engagement">
				<h3>Medium Engagement</h3>
				<p class="stat-number">{mediumEngagementCount}</p>
			</div>
			<div class="stat-card no-engagement">
				<h3>No Engagement</h3>
				<p class="stat-number">{noEngagementCount}</p>
			</div>
		</div>
		
		<div class="filter-section">
			<label for="engagement-filter">Filter by Engagement:</label>
			<select id="engagement-filter" bind:value={selectedEngagement}>
				<option value="all">All</option>
				<option value="high">High Engagement</option>
				<option value="medium">Medium Engagement</option>
				<option value="none">No Engagement</option>
			</select>
		</div>
	</div>


	{#if errorMessage}
		<p class="error-message">{errorMessage}</p>
	{:else if filteredBusinesses.length > 0}
		<div class="businesses-container">
			{#each filteredBusinesses as business}
				<div class="business-card">
					<div class="business-header">
						<h2>{business.businessname}</h2>
						<div class="business-meta">
							<span class="tier-badge {getTierClass(business)}">{getTierDisplay(business)}</span>
							<span class="engagement-badge {getEngagementClass(getEngagementLevel(business))}">
								{getEngagementText(getEngagementLevel(business))}
							</span>
						</div>
					</div>
					
					<div class="business-details">
						<div class="detail-row">
							<strong>Business ID:</strong> {business.id}
						</div>
						<div class="detail-row">
							<strong>District:</strong> {business.district || 'Not specified'}
						</div>
						<div class="detail-row">
							<strong>State:</strong> {business.state || 'Not specified'}
						</div>
						<div class="detail-row">
							<strong>Contact:</strong> {business.phonenumber || 'Not provided'}
						</div>
						<div class="detail-row">
							<strong>Email:</strong> {business.email || 'Not provided'}
						</div>
						<div class="detail-row">
							<strong>Registered:</strong> {formatDate(business.created_at)}
						</div>
					</div>

					<div class="lead-stats">
						<div class="stats-grid">
							<div class="stat-item non-exclusive-leads">
								<span class="stat-value">{business.non_exclusive_available_count}</span>
								<span class="stat-label">Non-Exclusive</span>
							</div>
							<div class="stat-item claimed-leads">
								<span class="stat-value">{business.claimed_leads_count}</span>
								<span class="stat-label">Claimed</span>
							</div>
						</div>
					</div>

					{#if business.latest_lead_date}
						<div class="activity-info">
							<div class="activity-item">
								<strong>Latest Lead:</strong> 
								{formatDate(business.latest_lead_date)}
								{#if getDaysSinceLastLead(business.latest_lead_date) !== null}
									<span class="days-ago">({getDaysSinceLastLead(business.latest_lead_date)} days ago)</span>
								{/if}
							</div>
							{#if business.latest_claim_date}
								<div class="activity-item">
									<strong>Latest Claim:</strong> 
									{formatDate(business.latest_claim_date)}
								</div>
							{/if}
						</div>
					{/if}

					<div class="business-actions">
						<a href="/us/allbusinesses/{business.id}/edit" target="_blank" class="action-link">Edit Business</a>
						{#if business.slug}
							<a href="/solar-panel-installer/{business.slug}" target="_blank" class="action-link secondary">View Profile</a>
						{/if}
						{#if business.magic_link_token && business.slug}
							<a href="/business/{business.slug}/signin-link/{business.magic_link_token}" target="_blank" class="action-link access-account">Access Account</a>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<p class="no-results">No businesses found.</p>
	{/if}
</main>

<style>
	/* Root variables */
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--accent-color: #0056b3;
		--hover-color: #003366;
		--success-color: #28a745;
		--warning-color: #ffc107;
		--danger-color: #dc3545;
		--info-color: #17a2b8;
		--card-light-bg: #fff;
		--card-dark-bg: #333;
		--border-light: #ddd;
		--border-dark: #555;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	/* Main layout */
	main {
		padding: 2rem 1rem;
		font-family: var(--font-family);
		min-height: 100vh;
		transition: background-color 0.3s ease, color 0.3s ease;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
	}

	.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	/* Header */
	.header {
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2.2rem;
		margin-bottom: 1.5rem;
		font-weight: 600;
		color: var(--accent-color);
	}

	.summary-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		padding: 1.5rem;
		border-radius: 8px;
		text-align: center;
		transition: transform 0.2s ease;
	}

	.light .stat-card {
		background-color: var(--card-light-bg);
		border: 1px solid var(--border-light);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.dark .stat-card {
		background-color: var(--card-dark-bg);
		border: 1px solid var(--border-dark);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.stat-card:hover {
		transform: translateY(-2px);
	}

	.stat-card h3 {
		font-size: 0.9rem;
		margin-bottom: 0.5rem;
		opacity: 0.8;
		font-weight: 500;
	}

	.stat-number {
		font-size: 2rem;
		font-weight: 700;
		color: var(--accent-color);
		margin: 0;
	}

	.stat-card.eligible {
		border-left: 4px solid var(--success-color);
	}

	.stat-card.eligible .stat-number {
		color: var(--success-color);
	}

	.stat-card.ineligible {
		border-left: 4px solid var(--danger-color);
	}

	.stat-card.ineligible .stat-number {
		color: var(--danger-color);
	}

	.stat-card.active-claimers {
		border-left: 4px solid var(--info-color);
	}

	.stat-card.active-claimers .stat-number {
		color: var(--info-color);
	}

	.stat-card.tier3 {
		border-left: 4px solid var(--warning-color);
	}

	.stat-card.tier3 .stat-number {
		color: #b8860b;
	}

	.stat-card.percent-active {
		border-left: 4px solid var(--success-color);
	}

	.stat-card.percent-active .stat-number {
		color: var(--success-color);
	}

	.stat-card.high-engagement {
		border-left: 4px solid var(--success-color);
	}

	.stat-card.high-engagement .stat-number {
		color: var(--success-color);
	}

	.stat-card.medium-engagement {
		border-left: 4px solid var(--warning-color);
	}

	.stat-card.medium-engagement .stat-number {
		color: #b8860b;
	}

	.stat-card.no-engagement {
		border-left: 4px solid var(--danger-color);
	}

	.stat-card.no-engagement .stat-number {
		color: var(--danger-color);
	}

	.stat-card.percent-no-engagement {
		border-left: 4px solid var(--danger-color);
	}

	.stat-card.percent-no-engagement .stat-number {
		color: var(--danger-color);
	}

	/* Filter section */
	.filter-section {
		margin-top: 1.5rem;
		margin-bottom: 2rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.filter-section label {
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--accent-color);
	}

	.filter-section select {
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		border: 2px solid var(--border-light);
		font-size: 0.9rem;
		font-weight: 500;
		background-color: var(--card-light-bg);
		color: var(--light-primary-text-color);
		cursor: pointer;
		transition: all 0.2s ease;
		min-width: 160px;
	}

	.dark .filter-section select {
		background-color: var(--card-dark-bg);
		color: var(--dark-primary-text-color);
		border-color: var(--border-dark);
	}

	.filter-section select:focus {
		outline: none;
		border-color: var(--accent-color);
		box-shadow: 0 0 0 3px rgba(0, 86, 179, 0.1);
	}

	.filter-section select:hover {
		border-color: var(--accent-color);
	}

	/* Business cards */
	.businesses-container {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		max-width: 1000px;
		margin: 0 auto;
	}

	.business-card {
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s ease;
	}

	.light .business-card {
		background-color: var(--card-light-bg);
		border: 1px solid var(--border-light);
	}

	.dark .business-card {
		background-color: var(--card-dark-bg);
		border: 1px solid var(--border-dark);
	}

	.business-card:hover {
		transform: translateY(-2px);
	}

	.business-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.business-header h2 {
		font-size: 1.3rem;
		margin: 0;
		color: var(--accent-color);
		flex: 1;
		min-width: 200px;
	}

	.business-meta {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tier-badge {
		font-size: 0.75rem;
		padding: 0.2rem 0.5rem;
		border-radius: 3px;
		color: white;
		font-weight: 600;
		white-space: nowrap;
	}

	.tier-badge.tier1 {
		background-color: #17a2b8;
	}

	.tier-badge.tier2 {
		background-color: var(--warning-color);
		color: #333;
	}

	.tier-badge.tier3 {
		background-color: var(--success-color);
	}

	.engagement-badge {
		font-size: 0.75rem;
		padding: 0.2rem 0.5rem;
		border-radius: 3px;
		color: white;
		font-weight: 600;
		white-space: nowrap;
	}

	.engagement-high {
		background-color: var(--success-color);
	}

	.engagement-medium {
		background-color: var(--warning-color);
		color: #333;
	}

	.engagement-low {
		background-color: var(--info-color);
	}

	.engagement-none {
		background-color: #6c757d;
	}

	.business-details {
		margin-bottom: 1rem;
	}

	.detail-row {
		margin: 0.5rem 0;
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.lead-stats {
		margin: 1rem 0;
		padding: 1rem;
		border-radius: 6px;
	}

	.light .lead-stats {
		background-color: #f8f9fa;
		border: 1px solid #e9ecef;
	}

	.dark .lead-stats {
		background-color: #2a2a2a;
		border: 1px solid #444;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
		gap: 0.5rem;
		text-align: center;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.stat-value {
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--accent-color);
	}

	.stat-label {
		font-size: 0.7rem;
		opacity: 0.8;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.activity-info {
		margin: 1rem 0;
		font-size: 0.9rem;
	}

	.activity-item {
		margin: 0.5rem 0;
	}

	.days-ago {
		color: #6c757d;
		font-size: 0.8rem;
	}

	.business-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 1rem;
		flex-wrap: wrap;
	}

	.action-link {
		display: inline-block;
		color: white;
		background-color: var(--accent-color);
		text-decoration: none;
		padding: 0.4rem 0.8rem;
		border-radius: 4px;
		font-size: 0.8rem;
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

	.action-link.access-account {
		background-color: var(--success-color);
	}

	.action-link.access-account:hover {
		background-color: #218838;
	}

	/* Error and no results */
	.error-message {
		text-align: center;
		color: var(--danger-color);
		font-size: 1.1rem;
		padding: 2rem;
	}

	.no-results {
		text-align: center;
		color: #6c757d;
		font-size: 1.1rem;
		padding: 2rem;
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.summary-stats {
			grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		}

		.filter-section {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.filter-section select {
			width: 100%;
			max-width: 300px;
		}

		.business-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.stats-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		h1 {
			font-size: 1.8rem;
		}
	}
</style>