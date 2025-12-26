<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/in/themeStore';
	import AddReferrer from '$lib/in/AddReferrer.svelte';

	// Access page data
	const businessSlug = $page.params.business_slug;
	$: ({ business, referrers = [] } = $page.data);
	$: darkMode = $isDarkMode;

	// Modal state
	let showAddReferrer = false;

	// Handle referrer added event
	function handleReferrerAdded() {
		showAddReferrer = false;
		window.location.reload();
	}

	// Function to get referrer link
	function getReferrerLink(referrerSlug) {
		return `https://solarvipani.com/in/solar-panel-installer/${businessSlug}/referrer/${referrerSlug}`;
	}

	// Function to copy link to clipboard
	function copyReferrerLink(referrerSlug) {
		const link = getReferrerLink(referrerSlug);
		navigator.clipboard.writeText(link).then(() => {
			alert('Link copied to clipboard!');
		}).catch(err => {
			console.error('Failed to copy link:', err);
		});
	}

	// Function to delete referrer
	async function deleteReferrer(referrerId, referrerName) {
		if (!confirm(`Are you sure you want to delete referrer "${referrerName}"? This action cannot be undone.`)) {
			return;
		}

		try {
			const response = await fetch('/in/api/deleteReferrer', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					referrerId: referrerId,
					businessId: business.id
				})
			});

			const result = await response.json();

			if (result.success) {
				alert('Referrer deleted successfully!');
				window.location.reload();
			} else {
				alert(`Error: ${result.error}`);
			}
		} catch (error) {
			console.error('Error deleting referrer:', error);
			alert('An error occurred while deleting the referrer');
		}
	}
</script>

<svelte:head>
	<title>Referrers - {businessSlug} | Solar Vipani Business Dashboard</title>
</svelte:head>

<div class="page-content {darkMode ? 'dark' : 'light'}">
	<header>
		<div class="header-content">
			<div>
				<h1>Referrers</h1>
				<p>Manage your business referrers and partners</p>
			</div>
			<button class="btn add-referrer-btn" on:click={() => (showAddReferrer = true)}>
				➕ Add Referrer
			</button>
		</div>
	</header>

	<section id="referrers-section">
		{#if referrers.length === 0}
			<div class="no-referrers">
				<p>No referrers found.</p>
				<p class="hint">Click "Add Referrer" to add your first referrer partner.</p>
			</div>
		{:else}
			<div class="table-container">
				<table class="referrers-table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Slug</th>
							<th>Phone</th>
							<th>Email</th>
							<th>Notes</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each referrers as referrer}
							<tr>
								<td>
									<div class="referrer-name">{referrer.name}</div>
								</td>
								<td>
									<code class="slug-code">{referrer.slug}</code>
								</td>
								<td>{referrer.phone || 'N/A'}</td>
								<td>{referrer.email || 'N/A'}</td>
								<td>
									<div class="notes-cell">
										{referrer.notes || '-'}
									</div>
								</td>
								<td>
									<div class="action-buttons">
										<button class="copy-btn" on:click={() => copyReferrerLink(referrer.slug)} title="Copy link to clipboard">
											📋 Copy
										</button>
										<button class="delete-btn" on:click={() => deleteReferrer(referrer.id, referrer.name)} title="Delete referrer">
											🗑️ Delete
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</div>

<!-- Add Referrer Modal -->
{#if showAddReferrer && business}
	<AddReferrer
		show={showAddReferrer}
		businessId={business.id}
		{businessSlug}
		on:close={() => (showAddReferrer = false)}
		on:referrerAdded={handleReferrerAdded}
	/>
{/if}

<style>
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--accent-color: #0056b3;
		--accent-hover: #00449e;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	.page-content {
		min-height: 100vh;
		font-family: var(--font-family);
		padding: 2rem;
		transition: background-color 0.3s ease, color 0.3s ease;
	}

	.page-content.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	.page-content.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	/* Header */
	header {
		margin-bottom: 2rem;
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.header-content > div:first-child {
		flex: 1;
	}

	.header-content > button {
		flex: 0 0 auto;
	}

	header h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
		color: var(--accent-color);
	}

	.dark header h1 {
		color: #66b2ff;
	}

	header p {
		font-size: 1rem;
		opacity: 0.8;
	}

	.add-referrer-btn {
		background: var(--accent-color);
		color: white;
		white-space: nowrap;
		padding: 0.5rem 1rem;
		border-radius: 5px;
		border: none;
		cursor: pointer;
		font-weight: 500;
		font-size: 0.9rem;
		flex-shrink: 0;
		width: auto;
		transition: background-color 0.3s ease;
	}

	.add-referrer-btn:hover {
		background: var(--accent-hover);
	}

	.dark .add-referrer-btn {
		background: #66b2ff;
		color: #1a1a1a;
	}

	.dark .add-referrer-btn:hover {
		background: #5aa3ff;
	}

	.no-referrers {
		text-align: center;
		padding: 3rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.dark .no-referrers {
		background: #2a2a2a;
	}

	.no-referrers p {
		margin: 0.5rem 0;
	}

	.hint {
		font-size: 0.9rem;
		opacity: 0.7;
	}

	.table-container {
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		overflow-x: auto;
	}

	.dark .table-container {
		background: #2a2a2a;
	}

	.referrers-table {
		width: 100%;
		border-collapse: collapse;
	}

	.referrers-table thead {
		background: #f8f9fa;
	}

	.dark .referrers-table thead {
		background: #333;
	}

	.referrers-table th {
		padding: 1rem;
		text-align: left;
		font-weight: 600;
		border-bottom: 2px solid #dee2e6;
		white-space: nowrap;
	}

	.dark .referrers-table th {
		border-bottom-color: #444;
	}

	.referrers-table td {
		padding: 1rem;
		border-bottom: 1px solid #dee2e6;
	}

	.dark .referrers-table td {
		border-bottom-color: #444;
	}

	.referrers-table tbody tr:hover {
		background: #f8f9fa;
	}

	.dark .referrers-table tbody tr:hover {
		background: #333;
	}

	.referrer-name {
		font-weight: 600;
	}

	.notes-cell {
		max-width: 300px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.slug-code {
		background-color: #f0f0f0;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-family: 'Courier New', monospace;
		font-size: 0.85rem;
		color: #333;
	}

	.dark .slug-code {
		background-color: #444;
		color: #f0f0f0;
	}

	.action-buttons {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.copy-btn,
	.delete-btn {
		padding: 0.4rem 0.8rem;
		border-radius: 5px;
		border: none;
		cursor: pointer;
		font-size: 0.85rem;
		font-weight: 500;
		transition: background-color 0.3s ease;
		white-space: nowrap;
		color: white;
	}

	.copy-btn {
		background: #28a745;
	}

	.copy-btn:hover {
		background: #218838;
	}

	.delete-btn {
		background: #dc3545;
	}

	.delete-btn:hover {
		background: #c82333;
	}

	.dark .copy-btn {
		background: #28a745;
		color: white;
	}

	.dark .copy-btn:hover {
		background: #218838;
	}

	.dark .delete-btn {
		background: #dc3545;
		color: white;
	}

	.dark .delete-btn:hover {
		background: #c82333;
	}

	@media (max-width: 768px) {
		.page-content {
			padding: 1rem;
		}

		header h1 {
			font-size: 1.5rem;
		}

		.header-content {
			flex-direction: column;
			align-items: stretch;
		}

		.add-referrer-btn {
			width: 100%;
		}

		.referrers-table {
			font-size: 0.9rem;
		}

		.referrers-table th,
		.referrers-table td {
			padding: 0.75rem 0.5rem;
		}

		.notes-cell {
			max-width: 150px;
		}
	}
</style>
