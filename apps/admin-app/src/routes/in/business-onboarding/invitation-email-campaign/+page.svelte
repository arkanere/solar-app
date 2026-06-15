<script>
	export let data;

	$: ({ dailySummary, recentEmails, stats, filters, error } = data);

	function formatDate(dateString) {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatDateTime(dateString) {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function applyFilters() {
		const params = new URLSearchParams();
		if (filters.dateFrom) params.set('from', filters.dateFrom);
		if (filters.dateTo) params.set('to', filters.dateTo);
		const query = params.toString();
		window.location.href = '/in/business-onboarding/invitation-email-campaign' + (query ? '?' + query : '');
	}

	function clearFilters() {
		window.location.href = '/in/business-onboarding/invitation-email-campaign';
	}
</script>

<svelte:head>
	<title>Invitation Email Campaign - Solar Vipani Admin</title>
</svelte:head>

<div class="page">
	<header>
		<h1>Invitation Email Campaign</h1>
		<a href="/in/business-onboarding" class="back-link">Back to Business Onboarding</a>
	</header>

	{#if error}
		<div class="error-banner">{error}</div>
	{/if}

	<!-- Overall Stats -->
	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-value">{stats.total_sent || 0}</div>
			<div class="stat-label">Total Emails Sent</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">{stats.unique_recipients || 0}</div>
			<div class="stat-label">Unique Recipients</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">{stats.total_runs || 0}</div>
			<div class="stat-label">Campaign Runs</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">{stats.active_days || 0}</div>
			<div class="stat-label">Active Days</div>
		</div>
	</div>

	<!-- Filters -->
	<div class="section">
		<h2>Filters</h2>
		<div class="filters">
			<label>
				From
				<input type="date" bind:value={filters.dateFrom} />
			</label>
			<label>
				To
				<input type="date" bind:value={filters.dateTo} />
			</label>
<button class="btn-apply" on:click={applyFilters}>Apply</button>
			<button class="btn-clear" on:click={clearFilters}>Clear</button>
		</div>
	</div>

	<!-- Daily Summary -->
	<div class="section">
		<h2>Daily Summary</h2>
		{#if dailySummary.length === 0}
			<p class="empty">No data yet.</p>
		{:else}
			<div class="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>Date</th>
							<th>Emails Sent</th>
						</tr>
					</thead>
					<tbody>
						{#each dailySummary as row}
							<tr>
								<td>{formatDate(row.date)}</td>
								<td>{row.emails_sent}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>

	<!-- Recent Emails -->
	<div class="section">
		<h2>Recent Emails (last 200)</h2>
		{#if recentEmails.length === 0}
			<p class="empty">No emails sent yet.</p>
		{:else}
			<div class="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>Sent At</th>
							<th>Vendor Name</th>
							<th>Email</th>
							<th>State</th>
							<th>Email #</th>
							<th>Run ID</th>
						</tr>
					</thead>
					<tbody>
						{#each recentEmails as email}
							<tr>
								<td>{formatDateTime(email.sent_at)}</td>
								<td>{email.vendor_name || '-'}</td>
								<td class="email-cell">{email.recipient_email}</td>
								<td>{email.state || '-'}</td>
								<td>{email.email_number || '-'}</td>
								<td class="run-id">{email.campaign_run_id}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

<style>
	.page {
		padding: 30px;
		max-width: 1400px;
		margin: 0 auto;
		font-family: 'Georgia', serif;
		color: #333;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
	}

	h1 {
		font-size: 28px;
		margin: 0;
	}

	h2 {
		font-size: 20px;
		margin: 0 0 15px 0;
	}

	.back-link {
		color: #0077cc;
		text-decoration: none;
		font-size: 14px;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	.error-banner {
		background: #fee;
		border: 1px solid #fcc;
		color: #c33;
		padding: 12px 16px;
		border-radius: 6px;
		margin-bottom: 20px;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 16px;
		margin-bottom: 30px;
	}

	.stats-grid.small {
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	}

	.stat-card {
		background: #f8f9fa;
		border: 1px solid #e9ecef;
		border-radius: 8px;
		padding: 20px;
		text-align: center;
	}

	.stat-value {
		font-size: 32px;
		font-weight: bold;
		color: #0077cc;
	}

	.stat-label {
		font-size: 13px;
		color: #666;
		margin-top: 4px;
	}

	.stat-sub {
		font-size: 12px;
		color: #999;
		margin-top: 2px;
	}

	.section {
		margin-bottom: 30px;
	}

	.filters {
		display: flex;
		gap: 16px;
		align-items: flex-end;
		flex-wrap: wrap;
	}

	.filters label {
		display: flex;
		flex-direction: column;
		font-size: 13px;
		color: #666;
		gap: 4px;
	}

	.filters input,
	.filters select {
		padding: 8px 12px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 14px;
	}

	.btn-apply {
		padding: 8px 20px;
		background: #0077cc;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 14px;
	}

	.btn-apply:hover {
		background: #005fa3;
	}

	.btn-clear {
		padding: 8px 20px;
		background: #6c757d;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 14px;
	}

	.btn-clear:hover {
		background: #5a6268;
	}

	.table-wrapper {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14px;
	}

	th {
		background: #f1f3f5;
		padding: 10px 12px;
		text-align: left;
		font-weight: 600;
		border-bottom: 2px solid #dee2e6;
		white-space: nowrap;
	}

	td {
		padding: 10px 12px;
		border-bottom: 1px solid #eee;
	}

	tr:hover {
		background: #f8f9fa;
	}

	.email-cell {
		font-family: monospace;
		font-size: 13px;
	}

	.run-id {
		font-family: monospace;
		font-size: 11px;
		color: #999;
		max-width: 160px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.badge {
		display: inline-block;
		padding: 2px 8px;
		border-radius: 12px;
		font-size: 12px;
		font-weight: 600;
	}

	.badge-india {
		background: #fff3e0;
		color: #e65100;
	}

	.badge-usa {
		background: #e3f2fd;
		color: #1565c0;
	}

	.empty {
		color: #999;
		font-style: italic;
	}
</style>
