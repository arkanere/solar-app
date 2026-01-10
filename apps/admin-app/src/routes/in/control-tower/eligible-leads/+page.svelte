<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';

	let eligibleLeads = $page.data.eligibleLeads || [];
	let errorMessage = $page.data.errorMessage;
	let totalCount = $page.data.totalCount || 0;
	let unclaimedCount = $page.data.unclaimedCount || 0;
	let claimedCount = $page.data.claimedCount || 0;
	let exclusiveCount = $page.data.exclusiveCount || 0;
	let nonExclusiveCount = $page.data.nonExclusiveCount || 0;
	let totalClaimedDuplicates = $page.data.totalClaimedDuplicates || 0;
	let message = $page.data.message;

	// Calculate action required count
	$: actionRequiredCount = eligibleLeads.filter(lead => (lead.total_claims || 0) === 0).length;

	// Filter state
	let selectedActionStatus = 'all';
	$: filteredLeads = filterLeadsByActionStatus(eligibleLeads, selectedActionStatus);

	$: darkMode = $isDarkMode;

	// Function to get stage label
	function getStageLabel(stage) {
		const stages = {
			0: 'New Inquiry',
			1: 'Qualified',
			2: 'Proposal Sent',
			3: 'Won'
		};
		return stages[stage] || 'Unknown';
	}

	// Function to get category color
	function getCategoryColor(category) {
		const colors = {
			1: '#28a745', // Green
			2: '#ffc107', // Yellow
			3: '#dc3545', // Red
			4: '#007bff', // Blue
			5: '#6c757d'  // Gray
		};
		return colors[category] || '#6c757d';
	}

	// Function to format business count display
	function getBusinessCountDisplay(count, businesses) {
		if (count === 1) {
			return `1 business available: ${businesses}`;
		} else {
			return `${count} businesses available in area`;
		}
	}

	// Function to calculate days since lead was received
	function getDaysSinceReceived(createdAt) {
		const createdDate = new Date(createdAt);
		const today = new Date();
		const diffTime = Math.abs(today - createdDate);
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	}

	// Filter leads by action status
	function filterLeadsByActionStatus(leadsList, actionFilter) {
		if (actionFilter === 'all') {
			return leadsList;
		}
		
		return leadsList.filter(lead => {
			const claimCount = lead.total_claims || 0;
			
			if (actionFilter === 'action-required') {
				return claimCount === 0;
			} else if (actionFilter === 'has-claims') {
				return claimCount > 0;
			}
			
			return true;
		});
	}
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="header">
		<h1>Eligible Leads</h1>
		<div class="summary-stats">
			<div class="stat-card">
				<h3>Total Eligible</h3>
				<p class="stat-number">{totalCount}</p>
			</div>
			<div class="stat-card action-required">
				<h3>Action Required</h3>
				<p class="stat-number">{actionRequiredCount}</p>
			</div>
			<div class="stat-card exclusive">
				<h3>Exclusive</h3>
				<p class="stat-number">{exclusiveCount}</p>
			</div>
			<div class="stat-card non-exclusive">
				<h3>Non-Exclusive</h3>
				<p class="stat-number">{nonExclusiveCount}</p>
			</div>
			<div class="stat-card claimed">
				<h3>With Claims</h3>
				<p class="stat-number">{claimedCount}</p>
				<p class="stat-detail">{totalClaimedDuplicates} total claims</p>
			</div>
		</div>
	</div>

	<div class="filter-section">
		<label for="action-status-filter">Filter by Action Status:</label>
		<select id="action-status-filter" bind:value={selectedActionStatus}>
			<option value="all">All</option>
			<option value="action-required">Action Required</option>
			<option value="has-claims">Has Claims</option>
		</select>
	</div>

	{#if errorMessage}
		<p class="error-message">{errorMessage}</p>
	{:else if message}
		<p class="info-message">{message}</p>
	{:else if filteredLeads.length > 0}
		<div class="leads-container">
			{#each filteredLeads as lead}
				<div class="lead-card">
					<div class="lead-header">
						<h2>{lead.name}</h2>
						<div class="lead-meta">
							{#if (lead.total_claims || 0) === 0}
								<span class="action-required-badge">ACTION REQUIRED</span>
							{/if}
							<span class="lead-type-badge {lead.lead_type}">
								{lead.lead_type === 'exclusive' ? 'EXCLUSIVE' : 'NON-EXCLUSIVE'}
							</span>
							<span class="claim-count-badge">
								{lead.total_claims || 0} CLAIM{(lead.total_claims || 0) !== 1 ? 'S' : ''}
							</span>
							<span class="category-badge" style="background-color: {getCategoryColor(lead.category)}">
								Cat {lead.category === null ? 'null' : lead.category}
							</span>
							<span class="days-badge">
								{getDaysSinceReceived(lead.created_at)} day{getDaysSinceReceived(lead.created_at) !== 1 ? 's' : ''} ago
							</span>
							<span class="email-invite-badge">
								{lead.email_invite_count || 0} EMAIL INVITE{(lead.email_invite_count || 0) !== 1 ? 'S' : ''}
							</span>
						</div>
					</div>
					
					<div class="lead-content">
						<div class="contact-info">
							<p><strong>Phone:</strong> {lead.phone}</p>
							<p><strong>Email:</strong> {lead.email || 'Not provided'}</p>
							<p><strong>Pin Code:</strong> {lead.pin_code}</p>
							<p><strong>District:</strong> {lead.mapped_district || lead.district}</p>
							<p><strong>Source:</strong> {lead.urlparams || 'Not provided'}</p>
						</div>
						
						<div class="lead-details">
							<p><strong>Type:</strong> {lead.type}</p>
							{#if lead.comment}
								<p><strong>Comment:</strong> {lead.comment}</p>
							{/if}
							{#if lead.sv_comment_for_businesses}
								<div class="sv-comment-for-business">
									<p><strong>SolarVipani Comment for Businesses:</strong></p>
									<p class="sv-comment-content">{lead.sv_comment_for_businesses}</p>
								</div>
							{/if}
							{#if lead.svnotes}
								<p><strong>SV Notes:</strong> {lead.svnotes}</p>
							{/if}
						</div>
						
						{#if lead.lead_type !== 'exclusive'}
							<div class="business-availability">
								{#if lead.has_claims}
									<h4>Claimed by Businesses ({lead.total_claims})</h4>
									<div class="claims-list">
										{#each lead.claimed_duplicates as claim}
											<div class="claim-item">
												<div class="claim-header">
													<div class="claim-business-info">
														<span class="business-name">{claim.assigned_business_name}</span>
														<div class="claim-business-location">
															{claim.business_district}, {claim.business_state}
														</div>
														<div class="business-lead-stats">
															<div class="lead-stat-item non-exclusive-leads">
																<span class="stat-value">{claim.business_non_exclusive_available_count || 0}</span>
																<span class="stat-label">Non-Exclusive</span>
															</div>
															<div class="lead-stat-item claimed-leads">
																<span class="stat-value">{claim.business_claimed_leads_count || 0}</span>
																<span class="stat-label">Claimed</span>
															</div>
														</div>
														{#if claim.business_notes}
															<div class="claim-business-notes">
																<strong>Notes:</strong> {claim.business_notes}
															</div>
														{/if}
													</div>
													<span class="claim-date">Claimed: {new Date(claim.created_at).toLocaleDateString()}</span>
												</div>

												<div class="claim-details">
													<div class="business-contact-info">
														<span class="business-id">Business ID: #{claim.business_id}</span>
														{#if claim.business_phonenumber}
															<span class="business-phone">Phone: {claim.business_phonenumber}</span>
														{/if}
													</div>
													<div class="claimed-lead-progress">
														<span class="claimed-stage-info">
															<strong>Stage:</strong>
															<span class="stage-badge stage-{claim.stage}">{getStageLabel(claim.stage)}</span>
														</span>
														<span class="claimed-status-info">
															<strong>Status:</strong>
															<span class="status-badge {claim.status ? 'active' : 'inactive'}">
																{claim.status ? 'Active' : 'Inactive'}
															</span>
														</span>
													</div>
												</div>

												{#if claim.isresolved}
													<div class="claim-status">
														<span class="status-badge resolved">Resolved</span>
													</div>
												{/if}

												<div class="claim-business-actions">
													<a href="/allbusinesses/{claim.business_id}/edit" target="_blank" class="business-action-btn edit">Edit</a>
													{#if claim.business_slug}
														<a href="/solar-panel-installer/{claim.business_slug}" target="_blank" class="business-action-btn view">View</a>
													{/if}
													{#if claim.business_magic_link_token && claim.business_slug}
														<a href="/business/{claim.business_slug}/signin-link/{claim.business_magic_link_token}" target="_blank" class="business-action-btn access">Access</a>
													{/if}
												</div>

												<p class="claim-id">Claim ID: #{claim.id}</p>
											</div>
										{/each}
									</div>
								{/if}

								<!-- Always show available businesses section -->
								<div class="available-businesses-section">
									{#if lead.business_details && lead.business_details.length > 0}
										{@const unclaimedBusinesses = lead.business_details.filter(business => {
											// Check if this business has claimed this lead
											const claimedBusinessIds = new Set((lead.claimed_duplicates || []).map(claim => claim.assigned_business_id));

											// If this business itself has claimed the lead, exclude it
											if (claimedBusinessIds.has(business.id)) {
												return false;
											}

											// If this is a branch office, check if its main business has claimed the lead
											if (business.is_branch && business.main_business_slug) {
												// Find main business from the claimed list by matching slug
												const mainBusinessClaimed = (lead.claimed_duplicates || []).some(claim =>
													claim.business_slug === business.main_business_slug
												);
												if (mainBusinessClaimed) {
													return false;
												}
											}

											// If this is a main business, check if any of its branches have claimed the lead
											if (!business.is_branch && business.slug) {
												// Check if any claimed business is a branch of this main business
												const branchClaimed = (lead.claimed_duplicates || []).some(claim =>
													claim.business_slug && claim.business_slug.startsWith(business.slug + '-branch-')
												);
												if (branchClaimed) {
													return false;
												}
											}

											return true;
										})}
										<h4>Available Businesses Not Claimed ({unclaimedBusinesses.length})</h4>
										{#if unclaimedBusinesses.length > 0}
											<div class="business-cards-grid">
												{#each unclaimedBusinesses as business}
												<div class="business-card-small">
													<div class="business-card-header">
														<div class="business-name-with-tag">
															<h5 class="business-card-name">{business.businessname}</h5>
															{#if business.is_branch}
																<span class="branch-tag">BRANCH</span>
															{/if}
														</div>
														<div class="business-card-location">
															{business.district}, {business.state}
														</div>
														<div class="business-lead-stats">
															<div class="lead-stat-item non-exclusive-leads">
																<span class="stat-value">{business.non_exclusive_available_count}</span>
																<span class="stat-label">Non-Exclusive</span>
															</div>
															<div class="lead-stat-item claimed-leads">
																<span class="stat-value">{business.claimed_leads_count}</span>
																<span class="stat-label">Claimed</span>
															</div>
														</div>
														{#if business.notes}
															<div class="business-card-notes">
																<strong>Notes:</strong> {business.notes}
															</div>
														{/if}
													</div>
													<div class="business-card-actions">
														<a href="/allbusinesses/{business.id}/edit" target="_blank" class="business-action-btn edit">Edit</a>
														{#if business.slug}
															<a href="/solar-panel-installer/{business.slug}" target="_blank" class="business-action-btn view">View</a>
														{/if}
														{#if business.is_branch && business.main_business_magic_link_token && business.main_business_slug}
															<a href="/business/{business.main_business_slug}/signin-link/{business.main_business_magic_link_token}" target="_blank" class="business-action-btn access">Access</a>
														{:else if !business.is_branch && business.magic_link_token && business.slug}
															<a href="/business/{business.slug}/signin-link/{business.magic_link_token}" target="_blank" class="business-action-btn access">Access</a>
														{/if}
													</div>
												</div>
											{/each}
											</div>
										{:else}
											<p class="no-business-details">No unclaimed businesses available</p>
										{/if}
									{:else}
										<h4>Available Businesses Not Claimed (0)</h4>
										<p class="no-business-details">No businesses available in this area</p>
									{/if}
								</div>
							</div>
						{/if}
						
						<div class="lead-footer">
							<div class="timestamps">
								<p><strong>Created:</strong> {new Date(lead.created_at).toLocaleString()}</p>
								<p><strong>Lead ID:</strong> #{lead.id}</p>
								{#if lead.claim_count > 0}
									<p><strong>Claims:</strong> {lead.claim_count}</p>
								{/if}
							</div>
							
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="empty-state">
			<h3>No Eligible Leads Found</h3>
			<p>There are currently no leads in areas where businesses are available to service them.</p>
		</div>
	{/if}
</main>

<style>
	/* Root variables */
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--light-secondary-text-color: #666;
		--dark-secondary-text-color: #ccc;
		--accent-color: #0056b3;
		--success-color: #28a745;
		--warning-color: #ffc107;
		--danger-color: #dc3545;
		--info-color: #17a2b8;
		--light-card-bg: #fff;
		--dark-card-bg: #333;
		--light-border-color: #e0e0e0;
		--dark-border-color: #555;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	/* Main layout */
	main {
		padding: 2rem;
		font-family: var(--font-family);
		min-height: 100vh;
		transition: background-color 0.3s ease, color 0.3s ease;
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2.2rem;
		margin: 0;
		font-weight: 600;
	}

	.summary-stats {
		display: flex;
		gap: 1rem;
	}

	.stat-card {
		text-align: center;
		padding: 1rem;
		border-radius: 8px;
		min-width: 120px;
	}

	.light .stat-card {
		background-color: var(--light-card-bg);
		border: 1px solid var(--light-border-color);
	}

	.dark .stat-card {
		background-color: var(--dark-card-bg);
		border: 1px solid var(--dark-border-color);
	}

	.stat-card h3 {
		font-size: 0.9rem;
		margin: 0 0 0.5rem 0;
		opacity: 0.8;
	}

	.stat-number {
		font-size: 1.8rem;
		font-weight: bold;
		margin: 0;
		color: var(--accent-color);
	}

	.stat-card.claimed .stat-number {
		color: var(--success-color);
	}

	.stat-card.exclusive .stat-number {
		color: #008000; /* Green for exclusive */
	}

	.stat-card.non-exclusive .stat-number {
		color: #ff9800; /* Orange for non-exclusive */
	}

	.stat-card.action-required .stat-number {
		color: var(--danger-color); /* Red for action required */
	}

	.stat-detail {
		font-size: 0.8rem;
		margin: 0;
		opacity: 0.8;
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
		border: 2px solid var(--light-border-color);
		font-size: 0.9rem;
		font-weight: 500;
		background-color: var(--light-card-bg);
		color: var(--light-primary-text-color);
		cursor: pointer;
		transition: all 0.2s ease;
		min-width: 160px;
	}

	.dark .filter-section select {
		background-color: var(--dark-card-bg);
		color: var(--dark-primary-text-color);
		border-color: var(--dark-border-color);
	}

	.filter-section select:focus {
		outline: none;
		border-color: var(--accent-color);
		box-shadow: 0 0 0 3px rgba(0, 86, 179, 0.1);
	}

	.filter-section select:hover {
		border-color: var(--accent-color);
	}

	/* Messages */
	.error-message {
		color: var(--danger-color);
		font-size: 1.1rem;
		padding: 1rem;
		border-radius: 4px;
		border: 1px solid var(--danger-color);
		background-color: rgba(220, 53, 69, 0.1);
	}

	.info-message {
		color: var(--info-color);
		font-size: 1.1rem;
		padding: 1rem;
		border-radius: 4px;
		border: 1px solid var(--info-color);
		background-color: rgba(23, 162, 184, 0.1);
	}

	/* Leads container */
	.leads-container {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: 1fr;
		max-width: 800px;
		margin: 0 auto;
	}

	/* Lead card */
	.lead-card {
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
		overflow: hidden;
	}

	.light .lead-card {
		background-color: var(--light-card-bg);
		border: 1px solid var(--light-border-color);
	}

	.dark .lead-card {
		background-color: var(--dark-card-bg);
		border: 1px solid var(--dark-border-color);
	}

	.lead-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	}

	/* Lead header */
	.lead-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem 1.5rem 1rem 1.5rem;
		border-bottom: 1px solid;
	}

	.light .lead-header {
		border-bottom-color: var(--light-border-color);
	}

	.dark .lead-header {
		border-bottom-color: var(--dark-border-color);
	}

	.lead-header h2 {
		font-size: 1.3rem;
		margin: 0;
		color: var(--accent-color);
	}

	.lead-meta {
		display: flex;
		gap: 0.5rem;
	}

	/* Badges */
	.stage-badge, .category-badge, .claim-status-badge, .claim-count-badge, .days-badge, .lead-type-badge, .action-required-badge, .email-invite-badge {
		padding: 0.25rem 0.5rem;
		border-radius: 12px;
		font-size: 0.8rem;
		font-weight: 500;
		color: white;
	}

	.stage-0 { background-color: var(--info-color); }
	.stage-1 { background-color: var(--warning-color); }
	.stage-2 { background-color: var(--accent-color); }
	.stage-3 { background-color: var(--success-color); }

	.claim-status-badge.claimed {
		background-color: var(--success-color);
	}

	.claim-status-badge.unclaimed {
		background-color: var(--warning-color);
	}

	.claim-count-badge {
		background-color: var(--accent-color);
	}

	.days-badge {
		background-color: var(--info-color);
	}

	.lead-type-badge.exclusive {
		background-color: #008000; /* Green for exclusive */
	}

	.lead-type-badge.non-exclusive {
		background-color: #ff9800; /* Orange for non-exclusive */
	}

	.action-required-badge {
		background-color: var(--danger-color); /* Red for action required */
		font-weight: 600;
	}
	.email-invite-badge {
		background-color: #6c757d; /* Gray for email invites */
	}

	/* Lead content */
	.lead-content {
		padding: 1.5rem;
	}

	.contact-info, .lead-details {
		margin-bottom: 1.5rem;
	}

	.contact-info p, .lead-details p {
		margin: 0.5rem 0;
		font-size: 0.9rem;
	}

	.light .contact-info p, .light .lead-details p {
		color: var(--light-secondary-text-color);
	}

	.dark .contact-info p, .dark .lead-details p {
		color: var(--dark-secondary-text-color);
	}

	/* SV Comment for Business styling */
	.sv-comment-for-business {
		margin: 1rem 0;
		padding: 1rem;
		border-radius: 6px;
		border-left: 4px solid var(--accent-color);
	}

	.light .sv-comment-for-business {
		background-color: rgba(0, 86, 179, 0.05);
		border-left-color: var(--accent-color);
	}

	.dark .sv-comment-for-business {
		background-color: rgba(0, 86, 179, 0.1);
		border-left-color: #64b5f6;
	}

	.sv-comment-for-business p:first-child {
		margin: 0 0 0.5rem 0;
		font-weight: 600;
		color: var(--accent-color);
	}

	.dark .sv-comment-for-business p:first-child {
		color: #64b5f6;
	}

	.sv-comment-content {
		margin: 0;
		font-style: italic;
		line-height: 1.5;
		color: var(--light-primary-text-color);
	}

	.dark .sv-comment-content {
		color: var(--dark-primary-text-color);
	}

	/* Business availability */
	.business-availability {
		padding: 1rem;
		border-radius: 6px;
		margin-bottom: 1.5rem;
	}

	.light .business-availability {
		background-color: #f8f9fa;
		border: 1px solid #e9ecef;
	}

	.dark .business-availability {
		background-color: #2a2a2a;
		border: 1px solid #444;
	}

	.business-availability h4 {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		color: var(--success-color);
	}

	/* Available businesses section styling */
	.available-businesses-section {
		margin-top: 1.5rem;
		padding: 1rem;
		border-radius: 6px;
		border-left: 4px solid var(--info-color);
	}

	.light .available-businesses-section {
		background-color: rgba(23, 162, 184, 0.05);
		border-left-color: var(--info-color);
	}

	.dark .available-businesses-section {
		background-color: rgba(23, 162, 184, 0.1);
		border-left-color: #64b5f6;
	}

	.available-businesses-section h4 {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		color: var(--info-color);
	}

	.dark .available-businesses-section h4 {
		color: #64b5f6;
	}

	/* Business cards grid */
	.business-cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
		margin-top: 1rem;
	}

	/* Small business cards */
	.business-card-small {
		padding: 1rem;
		border-radius: 6px;
		border: 1px solid;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.light .business-card-small {
		background-color: #fff;
		border-color: #e9ecef;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.dark .business-card-small {
		background-color: #2a2a2a;
		border-color: #444;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}

	.business-card-small:hover {
		transform: translateY(-2px);
		box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
	}

	/* Business card header */
	.business-card-header {
		margin-bottom: 0.75rem;
	}

	.business-name-with-tag {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 0.25rem;
	}

	.business-card-name {
		font-size: 1rem;
		font-weight: 600;
		margin: 0;
		color: var(--accent-color);
		line-height: 1.3;
	}

	.dark .business-card-name {
		color: #64b5f6;
	}

	.branch-tag {
		font-size: 0.6rem;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		background-color: #ff9800;
		color: white;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		white-space: nowrap;
	}

	.business-card-location {
		font-size: 0.8rem;
		opacity: 0.7;
		font-style: italic;
	}

	.business-card-notes {
		font-size: 0.8rem;
		margin-top: 0.5rem;
		padding: 0.5rem;
		border-radius: 4px;
		line-height: 1.4;
	}

	.light .business-card-notes {
		background-color: #f8f9fa;
		border: 1px solid #e9ecef;
		color: #495057;
	}

	.dark .business-card-notes {
		background-color: #2a2a2a;
		border: 1px solid #444;
		color: #ccc;
	}

	.business-card-notes strong {
		color: var(--accent-color);
		font-size: 0.75rem;
	}

	.dark .business-card-notes strong {
		color: #64b5f6;
	}

	/* Business lead stats */
	.business-lead-stats {
		display: flex;
		gap: 1rem;
		margin: 0.5rem 0;
		padding: 0.5rem;
		border-radius: 4px;
	}

	.light .business-lead-stats {
		background-color: #f8f9fa;
		border: 1px solid #e9ecef;
	}

	.dark .business-lead-stats {
		background-color: #2a2a2a;
		border: 1px solid #444;
	}

	.lead-stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		flex: 1;
	}

	.stat-value {
		font-size: 1.2rem;
		font-weight: 700;
		line-height: 1;
	}

	.stat-label {
		font-size: 0.7rem;
		opacity: 0.8;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		text-align: center;
		line-height: 1;
	}

	.lead-stat-item.non-exclusive-leads .stat-value {
		color: #ff9800; /* Orange for non-exclusive */
	}

	.lead-stat-item.claimed-leads .stat-value {
		color: var(--success-color); /* Green for claimed */
	}

	/* Business card actions */
	.business-card-actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.business-action-btn {
		display: inline-block;
		padding: 0.3rem 0.6rem;
		border-radius: 4px;
		text-decoration: none;
		font-size: 0.75rem;
		font-weight: 600;
		text-align: center;
		transition: background-color 0.2s ease;
		color: white;
		min-width: 50px;
	}

	.business-action-btn.edit {
		background-color: var(--accent-color);
	}

	.business-action-btn.edit:hover {
		background-color: #004494;
	}

	.business-action-btn.view {
		background-color: #6c757d;
	}

	.business-action-btn.view:hover {
		background-color: #545b62;
	}

	.business-action-btn.access {
		background-color: var(--success-color);
	}

	.business-action-btn.access:hover {
		background-color: #218838;
	}

	/* No business details message */
	.no-business-details {
		font-style: italic;
		color: #6c757d;
		margin: 0.5rem 0;
		font-size: 0.9rem;
	}

	.business-count {
		margin: 0.5rem 0;
		font-weight: 500;
	}

	/* Single business display styling */
	.single-business-display {
		margin: 0.5rem 0;
	}

	.single-business-name {
		font-weight: 600;
		font-size: 1.1rem;
		color: var(--accent-color);
		margin: 0.25rem 0;
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		border-left: 3px solid var(--accent-color);
	}

	.light .single-business-name {
		background-color: #f8f9fa;
	}

	.dark .single-business-name {
		background-color: #2a2a2a;
	}

	.business-list {
		margin: 0.5rem 0 0 0;
		font-size: 0.85rem;
		line-height: 1.4;
	}

	.light .business-list {
		color: var(--light-secondary-text-color);
	}

	.dark .business-list {
		color: var(--dark-secondary-text-color);
	}

	/* Assigned business styling */
	.assigned-business {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 0.5rem 0;
	}

	.business-name {
		font-weight: 600;
		font-size: 1rem;
		color: var(--accent-color);
	}

	.assignment-status {
		font-size: 0.85rem;
		color: var(--success-color);
		font-weight: 500;
	}

	/* Claims list styling */
	.claims-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.claim-item {
		padding: 1rem;
		border-radius: 6px;
		border-left: 3px solid var(--accent-color);
	}

	.light .claim-item {
		background-color: #f8f9fa;
		border-left-color: var(--accent-color);
	}

	.dark .claim-item {
		background-color: #2a2a2a;
		border-left-color: var(--accent-color);
	}

	.claim-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.5rem;
	}

	.claim-business-info {
		flex: 1;
	}

	.claim-business-location {
		font-size: 0.8rem;
		opacity: 0.7;
		font-style: italic;
		margin-top: 0.2rem;
	}

	.claim-business-notes {
		font-size: 0.8rem;
		margin-top: 0.5rem;
		padding: 0.5rem;
		border-radius: 4px;
		line-height: 1.4;
	}

	.light .claim-business-notes {
		background-color: #f8f9fa;
		border: 1px solid #e9ecef;
		color: #495057;
	}

	.dark .claim-business-notes {
		background-color: #2a2a2a;
		border: 1px solid #444;
		color: #ccc;
	}

	.claim-business-notes strong {
		color: var(--accent-color);
		font-size: 0.75rem;
	}

	.dark .claim-business-notes strong {
		color: #64b5f6;
	}

	.claim-date {
		font-size: 0.8rem;
		opacity: 0.8;
	}

	.claim-status {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.status-badge {
		padding: 0.2rem 0.5rem;
		border-radius: 10px;
		font-size: 0.75rem;
		font-weight: 500;
		color: white;
	}

	.status-badge.pending {
		background-color: var(--warning-color);
	}

	.status-badge.allotted {
		background-color: var(--success-color);
	}

	.status-badge.resolved {
		background-color: var(--info-color);
	}

	.claim-id {
		font-size: 0.8rem;
		margin: 0.5rem 0 0 0;
		opacity: 0.7;
	}

	/* Claim business actions */
	.claim-business-actions {
		display: flex;
		gap: 0.5rem;
		margin: 0.75rem 0;
		flex-wrap: wrap;
	}

	/* Business contact info styling */
	.claim-details {
		margin: 0.5rem 0;
	}

	.business-contact-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.5rem;
		border-radius: 4px;
		font-size: 0.85rem;
	}

	.light .business-contact-info {
		background-color: #f8f9fa;
		border: 1px solid #e9ecef;
	}

	.dark .business-contact-info {
		background-color: #2a2a2a;
		border: 1px solid #444;
	}

	.business-id,
	.business-phone {
		font-weight: 500;
		color: var(--accent-color);
	}

	.dark .business-id,
	.dark .business-phone {
		color: #64b5f6;
	}

	.business-id {
		font-family: monospace;
	}

	.business-phone {
		color: var(--success-color);
	}

	.dark .business-phone {
		color: #66bb6a;
	}

	/* Claimed lead progress styling */
	.claimed-lead-progress {
		display: flex;
		gap: 1.5rem;
		margin: 0.75rem 0;
		align-items: center;
		flex-wrap: wrap;
		padding: 0.5rem;
		border-radius: 4px;
		border-top: 1px solid #e9ecef;
	}

	.light .claimed-lead-progress {
		border-top-color: #e9ecef;
	}

	.dark .claimed-lead-progress {
		border-top-color: #444;
	}

	.claimed-stage-info,
	.claimed-status-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
	}

	/* Stage and Status row styling */
	.stage-status-row {
		display: flex;
		gap: 2rem;
		margin: 1rem 0;
		align-items: center;
		flex-wrap: wrap;
	}

	.stage-info,
	.status-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	/* Stage badge styling - reusing existing stage classes */
	.stage-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.8rem;
		font-weight: 600;
		color: white;
	}

	.stage-badge.stage-0 { 
		background-color: var(--info-color); 
	}

	.stage-badge.stage-1 { 
		background-color: var(--warning-color); 
		color: #333;
	}

	.stage-badge.stage-2 { 
		background-color: var(--accent-color); 
	}

	.stage-badge.stage-3 { 
		background-color: var(--success-color); 
	}

	/* Status badge styling */
	.status-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.8rem;
		font-weight: 600;
		color: white;
	}

	.status-badge.active {
		background-color: var(--success-color);
	}

	.status-badge.inactive {
		background-color: #6c757d;
	}

	/* Mobile responsiveness for stage-status row and claimed progress */
	@media (max-width: 480px) {
		.stage-status-row,
		.claimed-lead-progress {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}
	}

	/* Lead footer */
	.lead-footer {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		border-top: 1px solid;
		padding-top: 1rem;
	}

	.light .lead-footer {
		border-top-color: var(--light-border-color);
	}

	.dark .lead-footer {
		border-top-color: var(--dark-border-color);
	}

	.timestamps p {
		margin: 0.25rem 0;
		font-size: 0.8rem;
	}

	.light .timestamps p {
		color: var(--light-secondary-text-color);
	}

	.dark .timestamps p {
		color: var(--dark-secondary-text-color);
	}

	/* Actions */
	.actions {
		display: flex;
		gap: 0.5rem;
	}

	.primary-button, .secondary-button, .danger-button {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.primary-button {
		background-color: var(--accent-color);
		color: white;
	}

	.primary-button:hover {
		background-color: #004494;
	}

	.secondary-button {
		background-color: transparent;
		color: var(--accent-color);
		border: 1px solid var(--accent-color);
	}

	.secondary-button:hover {
		background-color: var(--accent-color);
		color: white;
	}

	.danger-button {
		background-color: var(--danger-color);
		color: white;
	}

	.danger-button:hover {
		background-color: #c82333;
	}

	/* Empty state */
	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
	}

	.empty-state h3 {
		margin-bottom: 1rem;
		color: var(--accent-color);
	}

	.light .empty-state p {
		color: var(--light-secondary-text-color);
	}

	.dark .empty-state p {
		color: var(--dark-secondary-text-color);
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.header {
			flex-direction: column;
			gap: 1rem;
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

		.leads-container {
			grid-template-columns: 1fr;
		}

		.lead-footer {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}

		.actions {
			justify-content: stretch;
		}

		.primary-button, .secondary-button {
			flex: 1;
		}

		/* Business cards responsive */
		.business-cards-grid {
			grid-template-columns: 1fr;
		}

		.business-card-actions {
			flex-direction: column;
			gap: 0.25rem;
		}

		.business-action-btn {
			text-align: center;
			width: 100%;
		}

		/* Claimed business actions responsive */
		.claim-business-actions {
			flex-direction: column;
			gap: 0.25rem;
		}

		.claim-business-actions .business-action-btn {
			width: 100%;
		}

		/* Lead stats responsive */
		.business-lead-stats {
			gap: 0.5rem;
		}

		.stat-value {
			font-size: 1rem;
		}

		.stat-label {
			font-size: 0.65rem;
		}
	}

	@media (max-width: 480px) {
		.business-card-small {
			padding: 0.75rem;
		}

		.business-card-name {
			font-size: 0.9rem;
		}

		.business-action-btn {
			padding: 0.4rem 0.6rem;
			font-size: 0.7rem;
		}
	}
</style>