<script lang="ts">
	import { page } from '$app/stores';
	import ProposalFormModal from '$lib/components/ProposalFormModal.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '$lib/components/ui/table';
	import { toast } from 'svelte-sonner';
	import DeleteButton from '$lib/components/DeleteButton.svelte';
	import ConfirmDeleteDialog from '$lib/components/ConfirmDeleteDialog.svelte';

	// Access page data
	let businessSlug = $derived($page.params.business_slug);
	let business = $derived($page.data.business);
	let proposals = $derived($page.data.proposals || []);

	// Modal state
	let showProposalModal = $state(false);
	let selectedProposal: any = $state(null);

	// Open modal to update proposal
	function openUpdateProposal(proposal: any) {
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

	// State for delete confirmation
	let showDeleteConfirm = $state(false);
	let proposalToDelete: any = $state(null);
	let deleting = $state(false);

	// Function to delete proposal
	async function deleteProposal() {
		if (!proposalToDelete || deleting) return;
		const proposalId = proposalToDelete.id;
		deleting = true;

		try {
			const response = await fetch('/api/deleteProposal', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					proposalId: proposalId,
					businessSlug: businessSlug
				})
			});

			const result = await response.json();

			if (result.success) {
				showDeleteConfirm = false;
				proposalToDelete = null;
				toast.success('Proposal deleted successfully!');
				window.location.reload();
			} else {
				toast.error(result.error);
			}
		} catch (error) {
			console.error('Error deleting proposal:', error);
			toast.error('An error occurred while deleting the proposal');
		} finally {
			deleting = false;
		}
	}
</script>

<div>
	<header class="mb-6">
		<div>
			<h1 class="text-2xl font-semibold text-foreground">Proposals</h1>
			<p class="mt-1 text-sm text-muted-foreground">Create, Update and Download Proposals</p>
		</div>
	</header>

	<section>
		{#if proposals.length === 0}
			<div class="text-center py-12 bg-card rounded-lg border border-border">
				<p class="text-muted-foreground">No proposals found. Proposals will appear here once created. Proposals can be created from the CRM, when inquiry reaches the contacted stage</p>
			</div>
		{:else}
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Customer Name</TableHead>
						<TableHead>System Size</TableHead>
						<TableHead>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
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
									<DeleteButton
										label="Delete proposal"
										onclick={() => {
											proposalToDelete = proposal;
											showDeleteConfirm = true;
										}}
									/>
								</div>
							</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
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

<ConfirmDeleteDialog
	bind:open={showDeleteConfirm}
	title="Delete proposal?"
	loading={deleting}
	onConfirm={deleteProposal}
	onCancel={() => (proposalToDelete = null)}
>
	Delete the proposal for <strong>{proposalToDelete?.customer_name}</strong>?
</ConfirmDeleteDialog>
