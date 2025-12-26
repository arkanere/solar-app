<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/in/themeStore';
	import ProposalFormModal from '$lib/in/ProposalFormModal.svelte';

	// Access page data
	const businessSlug = $page.params.business_slug;
	$: ({ business } = $page.data);
	$: darkMode = $isDarkMode;

	// Modal state
	let showProposalModal = false;
	let selectedProposal = null;

	// Get proposals from page data
	$: ({ proposals = [] } = $page.data);

	// Open modal to update proposal
	function openUpdateProposal(proposal) {
		selectedProposal = proposal;
		showProposalModal = true;
	}

	// Handle proposal generated
	function handleProposalGenerated() {
		showProposalModal = false;
		selectedProposal = null;
		// Refresh the page to show the updated proposal
		window.location.reload();
	}

	// Format date for display
	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-IN', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// Format time ago
	function getTimeAgo(dateString) {
		const now = new Date();
		const date = new Date(dateString);
		const diffInMs = now - date;
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

		if (diffInDays === 0) {
			return 'Today';
		} else if (diffInDays === 1) {
			return '1 day ago';
		} else if (diffInDays < 7) {
			return `${diffInDays} days ago`;
		} else if (diffInDays < 30) {
			const weeks = Math.floor(diffInDays / 7);
			return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
		} else {
			return formatDate(dateString);
		}
	}

	// Function to delete proposal
	async function deleteProposal(proposalId, customerName) {
		if (!confirm(`Are you sure you want to delete proposal for "${customerName}"? This action cannot be undone.`)) {
			return;
		}

		try {
			const response = await fetch('/in/api/deleteProposal', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					proposalId: proposalId
				})
			});

			const result = await response.json();

			if (result.success) {
				alert('Proposal deleted successfully!');
				window.location.reload();
			} else {
				alert(`Error: ${result.error}`);
			}
		} catch (error) {
			console.error('Error deleting proposal:', error);
			alert('An error occurred while deleting the proposal');
		}
	}
</script>

<div class="page-content {darkMode ? 'dark' : 'light'}">
	<header>
		<h1>Proposals</h1>
		<p>Create, Update and Download Proposals</p>
	</header>

	<section id="proposals-section">
		{#if proposals.length === 0}
			<div class="no-proposals">
				<p>No proposals found.</p>
				<p class="hint">Proposals will appear here once created.</p>
			</div>
		{:else}
			<div class="table-container">
				<table class="proposals-table">
					<thead>
						<tr>
							<th>Customer Name</th>
							<th>System Size</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each proposals as proposal}
							<tr>
								<td>{proposal.customer_name}</td>
								<td>{proposal.system_capacity_kw} kW</td>
								<td>
									<div class="action-buttons">
										<button
											class="btn update-btn"
											on:click={() => openUpdateProposal(proposal)}
										>
											Update Proposal
										</button>
										<button
											class="btn delete-btn"
											on:click={() => deleteProposal(proposal.id, proposal.customer_name)}
										>
											Delete
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

<!-- Proposal Form Modal -->
{#if showProposalModal}
	<ProposalFormModal
		show={showProposalModal}
		{business}
		proposal={selectedProposal}
		on:close={() => {
			showProposalModal = false;
			selectedProposal = null;
		}}
		on:generated={handleProposalGenerated}
	/>
{/if}

<style>
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--accent-color: #0056b3;
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

	header {
		text-align: center;
		margin-bottom: 2rem;
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
		opacity: 0.8;
	}

	.no-proposals {
		text-align: center;
		padding: 3rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.dark .no-proposals {
		background: #2a2a2a;
	}

	.hint {
		margin-top: 0.5rem;
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

	.proposals-table {
		width: 100%;
		border-collapse: collapse;
	}

	.proposals-table thead {
		background: #f8f9fa;
	}

	.dark .proposals-table thead {
		background: #333;
	}

	.proposals-table th {
		padding: 1rem;
		text-align: left;
		font-weight: 600;
		border-bottom: 2px solid #dee2e6;
		white-space: nowrap;
	}

	.dark .proposals-table th {
		border-bottom-color: #444;
	}

	.proposals-table td {
		padding: 1rem;
		border-bottom: 1px solid #dee2e6;
	}

	.dark .proposals-table td {
		border-bottom-color: #444;
	}

	.proposals-table tbody tr:hover {
		background: #f8f9fa;
	}

	.dark .proposals-table tbody tr:hover {
		background: #333;
	}

	.action-buttons {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.update-btn {
		background: var(--accent-color);
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 5px;
		border: none;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		transition: background-color 0.3s ease;
		white-space: nowrap;
	}

	.update-btn:hover {
		background: #004494;
	}

	.dark .update-btn {
		background: #66b2ff;
		color: #1a1a1a;
	}

	.dark .update-btn:hover {
		background: #5aa3ff;
	}

	.delete-btn {
		background: #dc3545;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 5px;
		border: none;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		transition: background-color 0.3s ease;
		white-space: nowrap;
	}

	.delete-btn:hover {
		background: #c82333;
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

		.proposals-table {
			font-size: 0.9rem;
		}

		.proposals-table th,
		.proposals-table td {
			padding: 0.75rem 0.5rem;
		}

		.update-btn,
		.delete-btn {
			padding: 0.4rem 0.75rem;
			font-size: 0.85rem;
		}

		.action-buttons {
			flex-direction: column;
			gap: 0.25rem;
		}
	}
</style>
