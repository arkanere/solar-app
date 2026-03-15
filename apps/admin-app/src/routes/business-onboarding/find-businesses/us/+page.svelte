<script>
	export let data;

	$: ({ businesses, states, stats, total, page, totalPages, filters, error } = data);

	function applyFilters() {
		const params = new URLSearchParams();
		if (filters.state) params.set('state', filters.state);
		if (filters.search) params.set('search', filters.search);
		if (filters.emailStatus !== 'all') params.set('email_status', filters.emailStatus);
		const query = params.toString();
		window.location.href = '/business-onboarding/find-businesses/us' + (query ? '?' + query : '');
	}

	function clearFilters() {
		window.location.href = '/business-onboarding/find-businesses/us';
	}

	function goToPage(p) {
		const params = new URLSearchParams();
		if (filters.state) params.set('state', filters.state);
		if (filters.search) params.set('search', filters.search);
		if (filters.emailStatus !== 'all') params.set('email_status', filters.emailStatus);
		params.set('page', p);
		window.location.href = '/business-onboarding/find-businesses/us?' + params.toString();
	}

	function formatDate(dateString) {
		if (!dateString) return '-';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric', month: 'short', day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>USA Businesses - Solar Vipani Admin</title>
</svelte:head>

<div class="page">
	<header>
		<h1>USA - Master Business List</h1>
		<a href="/business-onboarding/find-businesses" class="back-link">Back</a>
	</header>

	{#if error}
		<div class="error-banner">{error}</div>
	{/if}

	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-value">{stats.total || 0}</div>
			<div class="stat-label">Total</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">{stats.emailed || 0}</div>
			<div class="stat-label">Emailed</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">{stats.not_emailed || 0}</div>
			<div class="stat-label">Not Emailed</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">{stats.unsubscribed || 0}</div>
			<div class="stat-label">Unsubscribed</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">{stats.verified || 0}</div>
			<div class="stat-label">Verified</div>
		</div>
	</div>

	<div class="section">
		<div class="filters">
			<label>
				Search
				<input type="text" bind:value={filters.search} placeholder="Name or email..." on:keydown={(e) => e.key === 'Enter' && applyFilters()} />
			</label>
			<label>
				State
				<select bind:value={filters.state}>
					<option value="">All States</option>
					{#each states as s}
						<option value={s}>{s}</option>
					{/each}
				</select>
			</label>
			<label>
				Status
				<select bind:value={filters.emailStatus}>
					<option value="all">All</option>
					<option value="sent">Emailed</option>
					<option value="unsent">Not Emailed</option>
					<option value="unsubscribed">Unsubscribed</option>
					<option value="verified">Verified</option>
				</select>
			</label>
			<button class="btn-apply" on:click={applyFilters}>Apply</button>
			<button class="btn-clear" on:click={clearFilters}>Clear</button>
		</div>
	</div>

	<div class="section">
		<p class="result-count">Showing {businesses.length} of {total} businesses (Page {page}/{totalPages || 1})</p>

		{#if businesses.length === 0}
			<p class="empty">No businesses found.</p>
		{:else}
			<div class="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>Vendor Name</th>
							<th>Email</th>
							<th>Contact Person</th>
							<th>Mobile</th>
							<th>State</th>
							<th>County</th>
							<th>Website</th>
							<th>Emails Sent</th>
							<th>Last Sent</th>
							<th>Unsub</th>
							<th>Verified</th>
						</tr>
					</thead>
					<tbody>
						{#each businesses as biz}
							<tr>
								<td>{biz.vendor_name || '-'}</td>
								<td class="email-cell">{biz.recipient_email || '-'}</td>
								<td>{biz.contact_person || '-'}</td>
								<td>{biz.mobile_number || '-'}</td>
								<td>{biz.state || '-'}</td>
								<td>{biz.county || '-'}</td>
								<td>
									{#if biz.website}
										<a href={biz.website} target="_blank" class="link">{biz.website}</a>
									{:else}
										-
									{/if}
								</td>
								<td>{biz.number_of_emails_sent || 0}</td>
								<td>{formatDate(biz.earlier_date)}</td>
								<td>{biz.unsubscribe === 1 ? 'Yes' : 'No'}</td>
								<td>{biz.verified === 1 ? 'Yes' : 'No'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="pagination">
				{#if page > 1}
					<button on:click={() => goToPage(page - 1)}>Previous</button>
				{/if}
				<span>Page {page} of {totalPages}</span>
				{#if page < totalPages}
					<button on:click={() => goToPage(page + 1)}>Next</button>
				{/if}
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

	h1 { font-size: 28px; margin: 0; }

	.back-link {
		color: #0077cc;
		text-decoration: none;
		font-size: 14px;
	}
	.back-link:hover { text-decoration: underline; }

	.error-banner {
		background: #fee; border: 1px solid #fcc; color: #c33;
		padding: 12px 16px; border-radius: 6px; margin-bottom: 20px;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 16px; margin-bottom: 30px;
	}

	.stat-card {
		background: #f8f9fa; border: 1px solid #e9ecef;
		border-radius: 8px; padding: 16px; text-align: center;
	}
	.stat-value { font-size: 28px; font-weight: bold; color: #1565c0; }
	.stat-label { font-size: 13px; color: #666; margin-top: 4px; }

	.section { margin-bottom: 30px; }

	.filters {
		display: flex; gap: 16px; align-items: flex-end; flex-wrap: wrap;
	}
	.filters label {
		display: flex; flex-direction: column; font-size: 13px; color: #666; gap: 4px;
	}
	.filters input, .filters select {
		padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;
	}

	.btn-apply {
		padding: 8px 20px; background: #0077cc; color: white;
		border: none; border-radius: 4px; cursor: pointer; font-size: 14px;
	}
	.btn-apply:hover { background: #005fa3; }

	.btn-clear {
		padding: 8px 20px; background: #6c757d; color: white;
		border: none; border-radius: 4px; cursor: pointer; font-size: 14px;
	}
	.btn-clear:hover { background: #5a6268; }

	.result-count { font-size: 14px; color: #666; margin-bottom: 10px; }

	.table-wrapper { overflow-x: auto; }

	table { width: 100%; border-collapse: collapse; font-size: 14px; }
	th {
		background: #f1f3f5; padding: 10px 12px; text-align: left;
		font-weight: 600; border-bottom: 2px solid #dee2e6; white-space: nowrap;
	}
	td { padding: 10px 12px; border-bottom: 1px solid #eee; }
	tr:hover { background: #f8f9fa; }

	.email-cell { font-family: monospace; font-size: 13px; }
	.link { color: #0077cc; text-decoration: none; font-size: 13px; }
	.link:hover { text-decoration: underline; }
	.empty { color: #999; font-style: italic; }

	.pagination {
		display: flex; align-items: center; gap: 16px;
		justify-content: center; margin-top: 20px;
	}
	.pagination button {
		padding: 8px 16px; background: #0077cc; color: white;
		border: none; border-radius: 4px; cursor: pointer; font-size: 14px;
	}
	.pagination button:hover { background: #005fa3; }
	.pagination span { font-size: 14px; color: #666; }
</style>
