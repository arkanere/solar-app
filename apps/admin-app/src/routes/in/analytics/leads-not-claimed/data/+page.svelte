<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';

	$: darkMode = $isDarkMode;
	$: leads = $page.data.leads || [];
	$: error = $page.data.error;

	let filterReason = 'all';
	let searchQuery = '';

	$: filteredLeads = leads.filter(lead => {
		if (filterReason !== 'all' && lead.reason !== filterReason) return false;
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			return (
				lead.name?.toLowerCase().includes(q) ||
				lead.district?.toLowerCase().includes(q)
			);
		}
		return true;
	});

	$: noBusinessCount = leads.filter(l => l.reason === 'No Business').length;
	$: notClaimedCount = leads.filter(l => l.reason === 'Not Claimed').length;

	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('en-IN', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="header">
		<a href="/in/analytics/leads-not-claimed" class="back-link">← Back to Leads Not Claimed</a>
		<h1>Unclaimed Leads Data</h1>
	</div>

	{#if error}
		<div class="error">{error}</div>
	{:else}
		<div class="controls">
			<div class="filter-group">
				<button class:active={filterReason === 'all'} on:click={() => filterReason = 'all'}>
					All ({leads.length})
				</button>
				<button class:active={filterReason === 'No Business'} on:click={() => filterReason = 'No Business'}>
					No Business ({noBusinessCount})
				</button>
				<button class:active={filterReason === 'Not Claimed'} on:click={() => filterReason = 'Not Claimed'}>
					Not Claimed ({notClaimedCount})
				</button>
			</div>
			<input
				type="text"
				placeholder="Search by name, district..."
				bind:value={searchQuery}
				class="search-input"
			/>
		</div>

		<div class="table-info">Showing {filteredLeads.length} of {leads.length} leads</div>

		<div class="table-wrapper">
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>District</th>
						<th>State</th>
						<th>Created</th>
						<th>Reason</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredLeads as lead}
						<tr>
							<td>{lead.id}</td>
							<td>{lead.name || '-'}</td>
							<td>{lead.district || '-'}</td>
							<td>{lead.state || '-'}</td>
							<td>{formatDate(lead.created_at)}</td>
							<td>
								<span class="reason-badge" class:no-business={lead.reason === 'No Business'} class:not-claimed={lead.reason === 'Not Claimed'}>
									{lead.reason}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</main>

<style>
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--accent-color: #0056b3;
		--card-light-bg: #fff;
		--card-dark-bg: #333;
		--border-light: #ddd;
		--border-dark: #555;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	main {
		padding: 2rem 1rem;
		font-family: var(--font-family);
		min-height: 100vh;
		transition: background-color 0.3s ease, color 0.3s ease;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
	}

	.light { background-color: var(--light-bg-color); color: var(--light-primary-text-color); }
	.dark { background-color: var(--dark-bg-color); color: var(--dark-primary-text-color); }

	.header { margin-bottom: 2rem; }

	.back-link {
		display: inline-block;
		color: var(--accent-color);
		text-decoration: none;
		margin-bottom: 1rem;
		font-weight: 500;
		transition: color 0.3s ease;
	}

	.back-link:hover { color: #003366; }

	h1 { font-size: 2.2rem; margin: 0; font-weight: 600; }

	.error { text-align: center; padding: 2rem; font-size: 1.1rem; color: #dc3545; }

	.controls {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.filter-group {
		display: flex;
		gap: 0.5rem;
	}

	.filter-group button {
		padding: 0.5rem 1rem;
		border-radius: 4px;
		border: 1px solid var(--border-light);
		background: transparent;
		cursor: pointer;
		font-size: 0.85rem;
		font-weight: 500;
		transition: all 0.2s ease;
	}

	.light .filter-group button { color: var(--light-primary-text-color); border-color: var(--border-light); }
	.dark .filter-group button { color: var(--dark-primary-text-color); border-color: var(--border-dark); }

	.filter-group button.active {
		background-color: var(--accent-color);
		color: white;
		border-color: var(--accent-color);
	}

	.search-input {
		padding: 0.5rem 1rem;
		border-radius: 4px;
		border: 1px solid var(--border-light);
		font-size: 0.9rem;
		flex: 1;
		min-width: 200px;
	}

	.light .search-input { background-color: var(--card-light-bg); color: var(--light-primary-text-color); border-color: var(--border-light); }
	.dark .search-input { background-color: var(--card-dark-bg); color: var(--dark-primary-text-color); border-color: var(--border-dark); }

	.table-info {
		font-size: 0.85rem;
		opacity: 0.7;
		margin-bottom: 0.75rem;
	}

	.table-wrapper {
		overflow-x: auto;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	thead th {
		padding: 0.75rem 1rem;
		text-align: left;
		font-weight: 600;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		position: sticky;
		top: 0;
		z-index: 1;
	}

	.light thead th { background-color: #e9ecef; color: var(--light-primary-text-color); border-bottom: 2px solid var(--border-light); }
	.dark thead th { background-color: #444; color: var(--dark-primary-text-color); border-bottom: 2px solid var(--border-dark); }

	tbody td {
		padding: 0.6rem 1rem;
		white-space: nowrap;
	}

	.light tbody tr { background-color: var(--card-light-bg); }
	.dark tbody tr { background-color: var(--card-dark-bg); }

	.light tbody tr:nth-child(even) { background-color: #f1f3f5; }
	.dark tbody tr:nth-child(even) { background-color: #3a3a3a; }

	.light tbody tr:hover { background-color: #e2e6ea; }
	.dark tbody tr:hover { background-color: #454545; }

	.light tbody td { border-bottom: 1px solid var(--border-light); }
	.dark tbody td { border-bottom: 1px solid var(--border-dark); }

	.reason-badge {
		display: inline-block;
		padding: 0.2rem 0.6rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.reason-badge.no-business {
		background-color: rgba(220, 53, 69, 0.15);
		color: #dc3545;
	}

	.reason-badge.not-claimed {
		background-color: rgba(255, 193, 7, 0.2);
		color: #d39e00;
	}

	@media (max-width: 768px) {
		h1 { font-size: 1.8rem; }

		.controls { flex-direction: column; }

		.filter-group { width: 100%; overflow-x: auto; }

		.search-input { width: 100%; }
	}
</style>
