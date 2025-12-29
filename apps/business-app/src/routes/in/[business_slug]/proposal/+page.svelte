<script>
	import { page } from '$app/stores';
	import ProposalFormModal from '$lib/in/ProposalFormModal.svelte';
	import { Button } from '$lib/components/ui/button';
	import { EmptyState } from '$lib/components/ui/empty-state';
	import { PageHeader } from '$lib/components/ui/page-header';
	import { DataTable, TableHeader, TableRow, TableCell } from '$lib/components/ui/data-table';
	import { toast } from 'svelte-sonner';

	// Access page data
	let businessSlug = $derived($page.params.business_slug);
	let business = $derived($page.data.business);
	let proposals = $derived($page.data.proposals || []);

	// Modal state
	let showProposalModal = $state(false);
	let selectedProposal = $state(null);

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
				toast.success('Proposal deleted successfully!');
				window.location.reload();
			} else {
				toast.error(result.error);
			}
		} catch (error) {
			console.error('Error deleting proposal:', error);
			toast.error('An error occurred while deleting the proposal');
		}
	}
</script>

<div class="min-h-screen p-8 md:p-4 transition-colors duration-300 bg-background text-foreground">
	<PageHeader
		title="Proposals"
		description="Create, Update and Download Proposals"
		centered
	/>

	<section>
		{#if proposals.length === 0}
			<EmptyState
				title="No proposals found."
				description="Proposals will appear here once created."
			/>
		{:else}
			<DataTable>
				{#snippet headers()}
					<TableHeader>Customer Name</TableHeader>
					<TableHeader>System Size</TableHeader>
					<TableHeader>Action</TableHeader>
				{/snippet}
				{#each proposals as proposal}
					<TableRow>
						<TableCell>{proposal.customer_name}</TableCell>
						<TableCell>{proposal.system_capacity_kw} kW</TableCell>
						<TableCell>
							<div class="flex gap-2 flex-wrap">
								<Button
									variant="default"
									size="sm"
									onclick={() => openUpdateProposal(proposal)}
								>
									Update Proposal
								</Button>
								<Button
									variant="destructive"
									size="sm"
									onclick={() => deleteProposal(proposal.id, proposal.customer_name)}
								>
									Delete
								</Button>
							</div>
						</TableCell>
					</TableRow>
				{/each}
			</DataTable>
		{/if}
	</section>
</div>

<!-- Proposal Form Modal -->
{#if showProposalModal}
	<ProposalFormModal
		bind:show={showProposalModal}
		{business}
		proposal={selectedProposal}
		onClose={() => {
			showProposalModal = false;
			selectedProposal = null;
		}}
		onGenerated={handleProposalGenerated}
	/>
{/if}

