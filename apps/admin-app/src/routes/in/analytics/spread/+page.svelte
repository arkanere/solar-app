<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';

	$: darkMode = $isDarkMode;
	
	// Get data from page data (server-side)
	$: analytics = $page.data.analytics || {};
	$: error = $page.data.error;

	// State for expandable district leads
	let selectedDistrict = null;

	// Toggle function for expanding/collapsing district leads
	function toggleDistrictLeads(districtName) {
		selectedDistrict = selectedDistrict === districtName ? null : districtName;
	}

	// Format date for display
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	// Get leads for a specific district
	function getDistrictLeads(districtName) {
		return analytics.districtLeadsData?.[districtName] || [];
	}
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="header">
		<a href="/admin/analytics" class="back-link">← Back to Analytics</a>
		<h1>Lead Distribution Spread Analytics</h1>
		<p class="subtitle">Understanding the geographic spread of incoming leads and business coverage</p>
	</div>

	{#if error}
		<div class="error">{error}</div>
	{:else}
		<!-- Main Stats Grid -->
		<div class="stats-grid">
			<div class="stat-card primary">
				<h2>Districts with Leads</h2>
				<div class="stat-number">{analytics.districtsWithLeads || 0}</div>
				<div class="stat-label">Districts generating leads</div>
			</div>
			
			<div class="stat-card success">
				<h2>Districts with Businesses</h2>
				<div class="stat-number">{analytics.districtsWithBusinesses || 0}</div>
				<div class="stat-label">Of lead-generating districts</div>
			</div>
			
			<div class="stat-card info">
				<h2>Service Coverage</h2>
				<div class="stat-number">{analytics.coveragePercentage || 0}%</div>
				<div class="stat-label">Lead districts with businesses</div>
			</div>
		</div>

		<!-- Top 20 Districts Table -->
		{#if analytics.top20Districts && analytics.top20Districts.length > 0}
			<div class="table-section">
				<h3>Top 20 Districts by Lead Count</h3>
				<div class="table-wrapper">
					<table class="districts-table">
						<thead>
							<tr>
								<th>District</th>
								<th>Number of Leads</th>
							</tr>
						</thead>
						<tbody>
							{#each analytics.top20Districts as district, index}
								<tr class:selected={selectedDistrict === district.district}>
									<td class="district-name">{district.district}</td>
									<td class="lead-count clickable" on:click={() => toggleDistrictLeads(district.district)} role="button" tabindex="0">
										{district.lead_count}
										<span class="expand-icon">{selectedDistrict === district.district ? '▼' : '▶'}</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Expandable District Leads -->
				{#if selectedDistrict}
					<div class="district-leads-section">
						<div class="district-leads-header">
							<h4>Leads from {selectedDistrict} ({getDistrictLeads(selectedDistrict).length} leads)</h4>
						</div>
						
						{#if getDistrictLeads(selectedDistrict).length > 0}
							<div class="leads-grid">
								{#each getDistrictLeads(selectedDistrict) as lead}
									<div class="lead-card">
										<div class="lead-info">
											<h5>{lead.name}</h5>
											<p class="lead-details">
												<span class="lead-phone">{lead.phone}</span>
												{#if lead.email}
													• <span class="lead-email">{lead.email}</span>
												{/if}
												<br>
												<span class="lead-pincode">PIN: {lead.pin_code}</span>
												• <span class="lead-date">Created: {formatDate(lead.created_at)}</span>
											</p>
											
											<!-- Lead Type and Comment -->
											{#if lead.type}
												<div class="lead-type">
													<span class="type-label">Type:</span>
													<span class="type-value">{lead.type}</span>
												</div>
											{/if}
											
											{#if lead.comment}
												<div class="lead-comment">
													<span class="comment-label">Comment:</span>
													<span class="comment-value">{lead.comment}</span>
												</div>
											{/if}
											
											{#if lead.urlparams}
												<div class="lead-urlparams">
													<span class="urlparams-label">URL Params:</span>
													<span class="urlparams-value">{lead.urlparams}</span>
												</div>
											{/if}
										</div>
										<div class="lead-meta">
											<span class="lead-id">ID: {lead.id}</span>
										</div>
									</div>
								{/each}
							</div>
							
							{#if getDistrictLeads(selectedDistrict).length === 50}
								<div class="more-leads-notice">
									Showing first 50 leads from this district. <a href="/admin/leaddata">View all leads →</a>
								</div>
							{/if}
						{:else}
							<div class="no-leads">No leads found for this district.</div>
						{/if}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Actions Section -->
		<div class="actions-section">
			<a href="/admin/analytics/coverage" class="action-link">View Geographic Coverage</a>
			<a href="/admin/analytics/lead-generation" class="action-link secondary">View Lead Analytics</a>
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

	/* Insights section */
	.insights-section {
		margin-bottom: 3rem;
	}

	.insight-card {
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.light .insight-card {
		background-color: var(--card-light-bg);
		border: 1px solid var(--border-light);
	}

	.dark .insight-card {
		background-color: var(--card-dark-bg);
		border: 1px solid var(--border-dark);
	}

	.insight-card h3 {
		font-size: 1.3rem;
		margin-bottom: 1rem;
		color: var(--accent-color);
	}

	.insight-content p {
		font-size: 1rem;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	/* Alert styling */
	.alert {
		padding: 1rem;
		border-radius: 4px;
		border-left: 4px solid;
		margin-top: 1rem;
	}

	.alert.success {
		border-left-color: var(--success-color);
		background-color: rgba(40, 167, 69, 0.1);
	}

	.alert.warning {
		border-left-color: var(--warning-color);
		background-color: rgba(255, 193, 7, 0.1);
	}

	.alert.info {
		border-left-color: var(--info-color);
		background-color: rgba(23, 162, 184, 0.1);
	}

	.alert strong {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
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

	.districts-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	.light .districts-table {
		background-color: var(--card-light-bg);
		border: 1px solid var(--border-light);
	}

	.dark .districts-table {
		background-color: var(--card-dark-bg);
		border: 1px solid var(--border-dark);
	}

	.districts-table thead th {
		padding: 1rem;
		text-align: left;
		font-weight: 600;
		border-bottom: 2px solid var(--accent-color);
		color: var(--accent-color);
	}

	.districts-table thead th:last-child {
		text-align: center;
	}

	.districts-table tbody td {
		padding: 0.75rem 1rem;
	}

	.light .districts-table tbody tr {
		border-bottom: 1px solid var(--border-light);
	}

	.dark .districts-table tbody tr {
		border-bottom: 1px solid var(--border-dark);
	}

	.light .districts-table tbody tr:hover {
		background-color: #f8f9fa;
	}

	.dark .districts-table tbody tr:hover {
		background-color: #444;
	}

	.district-name {
		font-weight: 600;
		color: var(--accent-color);
	}

	.lead-count {
		text-align: center;
		font-weight: 500;
	}

	.lead-count.clickable {
		cursor: pointer;
		color: var(--accent-color);
		position: relative;
		transition: all 0.3s ease;
		padding: 0.5rem;
		border-radius: 4px;
	}

	.lead-count.clickable:hover {
		background-color: rgba(0, 86, 179, 0.1);
		transform: scale(1.05);
	}

	.expand-icon {
		font-size: 0.7rem;
		margin-left: 0.5rem;
		opacity: 0.7;
		transition: opacity 0.3s ease;
	}

	.lead-count.clickable:hover .expand-icon {
		opacity: 1;
	}

	.districts-table tbody tr.selected {
		background-color: rgba(0, 86, 179, 0.1);
	}

	.light .districts-table tbody tr.selected {
		background-color: rgba(0, 86, 179, 0.05);
	}

	.dark .districts-table tbody tr.selected {
		background-color: rgba(0, 86, 179, 0.15);
	}

	/* District leads section */
	.district-leads-section {
		margin-top: 2rem;
		padding: 1.5rem;
		border-radius: 8px;
		border: 1px solid var(--accent-color);
	}

	.light .district-leads-section {
		background-color: rgba(0, 86, 179, 0.02);
	}

	.dark .district-leads-section {
		background-color: rgba(0, 86, 179, 0.08);
	}

	.district-leads-header h4 {
		color: var(--accent-color);
		font-size: 1.3rem;
		text-align: center;
		margin: 0 0 1.5rem 0;
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
		margin: 0 0 1rem 0;
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

	.lead-pincode {
		color: var(--info-color);
	}

	.lead-date {
		opacity: 0.7;
	}

	.lead-type, .lead-comment, .lead-urlparams {
		margin-bottom: 0.5rem;
		font-size: 0.85rem;
	}

	.type-label, .comment-label, .urlparams-label {
		font-weight: 600;
		color: var(--accent-color);
	}

	.type-value {
		background-color: rgba(23, 162, 184, 0.1);
		color: var(--info-color);
		padding: 0.2rem 0.5rem;
		border-radius: 12px;
		font-size: 0.8rem;
		margin-left: 0.5rem;
	}

	.comment-value {
		font-style: italic;
		margin-left: 0.5rem;
		opacity: 0.8;
	}

	.urlparams-value {
		font-family: monospace;
		font-size: 0.8rem;
		margin-left: 0.5rem;
		color: var(--purple-color);
		background-color: rgba(111, 66, 193, 0.1);
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		word-break: break-all;
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
		
		.stat-number {
			font-size: 2rem;
		}
		
		.districts-table {
			font-size: 0.8rem;
		}
		
		.districts-table thead th,
		.districts-table tbody td {
			padding: 0.5rem;
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
		.stat-number {
			font-size: 1.8rem;
		}
		
		.districts-table thead th,
		.districts-table tbody td {
			padding: 0.4rem;
		}
	}
</style>