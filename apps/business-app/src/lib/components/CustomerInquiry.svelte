<script module lang="ts">
	export type Lead = {
		id: number;
		name: string;
		phone: string;
		email: string;
		address?: string;
		stage: number;
		status: boolean;
		category?: number | null;
		business_notes?: string;
		received_at: string;
		pin_code?: string;
		type?: string;
		comment?: string;
		qualification_score?: number | null;
	};

	export type CustomerInquiryProps = {
		leads?: Lead[];
		businessInfo?: Record<string, any>;
		errorMessage?: string | null;
		onClaimSuccess?: (data: { leadId: number; result: any }) => void;
		claimBlocked?: boolean;
		// A just-claimed lead to show open at the top of My Leads
		focusLeadId?: number | null;
	};
</script>

<script lang="ts">
	import { toast } from 'svelte-sonner';
	import LeadStageFilter from './LeadStageFilter.svelte';
	import ProposalFormModal from './ProposalFormModal.svelte';
	import LeadTile from './LeadTile.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import ConfirmDeleteDialog from '$lib/components/ConfirmDeleteDialog.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { cn } from '$lib/utils';
	import { deleteLeadAPI } from '$lib/in/actions/lead-api';
	import PolicyAcceptanceModal from '$lib/compliance/PolicyAcceptanceModal.svelte';

	let {
		leads = $bindable([]),
		businessInfo = {},
		errorMessage = null,
		onClaimSuccess = () => {},
		claimBlocked = false,
		focusLeadId = $bindable(null)
	}: CustomerInquiryProps = $props();

	// Claim state
	let isClaiming = $state(false);
	let showBranchConfirm = $state(false);
	let branchConfirmDistrict = $state('');
	let pendingClaimLeadId: number | null = $state(null);
	let pendingClaimBusinessId: number | null = $state(null);

	// Compliance (data-handling policy) gate state
	let showComplianceModal = $state(false);
	let policySummary = $state('');
	let isAcceptingPolicy = $state(false);
	let pendingComplianceClaim: { leadId: number; businessId: number; confirmBranch: boolean } | null = null;

	// Parent-level state (modals only)
	let showProposalModal = $state(false);
	let selectedLeadForProposal: any = $state(null);
	let showDeleteConfirm = $state(false);
	let leadToDelete: Lead | null = $state(null);
	let isDeleting = $state(false);

	// Opens on Available Leads, or on My Leads when arriving from a dashboard claim
	let activeTab = $state<'available' | 'my-leads' | 'won'>(focusLeadId ? 'my-leads' : 'available');

	// Stage filter state (only applies to My Leads tab)
	let selectedStage = $state('all');

	// Derive available (category 1) and my leads (category 2, 3, null/undefined)
	let availableLeads = $derived(leads.filter((l) => l.category === 1));
	let claimedLeads = $derived(leads.filter((l) => l.category !== 1 && l.status !== false));
	// Won leads get their own tab, so My Leads holds only the ones still in progress
	let myLeads = $derived(claimedLeads.filter((l) => l.stage < 3));
	let wonLeads = $derived(claimedLeads.filter((l) => l.stage >= 3));

	// Filtered my leads — applies stage only
	let filteredMyLeads = $derived(
		myLeads.filter((lead) => {
			if (selectedStage !== 'all' && lead.stage !== parseInt(selectedStage)) return false;
			return true;
		})
	);

	// Count badges
	let availableCount = $derived(availableLeads.length);
	// Active leads not yet won
	let myLeadsActionableCount = $derived(
		myLeads.filter((l) => l.status === true && l.stage < 3).length
	);

	function handleFilterChange(filters: { selectedStage: string }) {
		selectedStage = filters.selectedStage;
	}

	// Event handlers
	function handleLeadUpdate(event: CustomEvent) {
		const { leadId, lead: updatedLead } = event.detail;
		leads = leads.map((l) => (l.id === leadId ? { ...l, ...updatedLead } : l));
	}

	async function handleLeadClaim(event: CustomEvent) {
		const { leadId, businessId } = event.detail;
		if (isClaiming) return;
		await claimLead(leadId, businessId, false);
	}

	async function claimLead(leadId: number, businessId: number, confirmBranch: boolean) {
		isClaiming = true;
		try {
			const response = await fetch('/api/claimLead', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					lead_id: leadId,
					business_id: businessId,
					...(confirmBranch && { confirm_branch_creation: true })
				})
			});
			const result = await response.json();

			// Data-handling policy must be accepted before claiming — show the modal,
			// remember the in-flight claim, and retry it after acceptance.
			if (!result.success && result.error === 'compliance_required') {
				pendingComplianceClaim = { leadId, businessId, confirmBranch };
				await openComplianceModal();
				return;
			}

			if (result.needsBranchConfirmation) {
				pendingClaimLeadId = leadId;
				pendingClaimBusinessId = businessId;
				branchConfirmDistrict = result.district;
				showBranchConfirm = true;
				return;
			}

			if (result.success) {
				// Show the claimed copy open at the top of My Leads
				if (result.newLead?.id) {
					focusLeadId = result.newLead.id;
					selectedStage = 'all';
					activeTab = 'my-leads';
				}
				onClaimSuccess({ leadId, result });
			} else {
				toast.error(result.error);
			}
		} catch (error) {
			console.error('Claim Lead Error:', error);
			toast.error('An error occurred while claiming the lead');
		} finally {
			isClaiming = false;
		}
	}

	async function openComplianceModal() {
		try {
			const res = await fetch('/api/compliance/status');
			const data = await res.json();
			policySummary = data?.policy?.summary ?? '';
		} catch (error) {
			console.error('Compliance status error:', error);
			policySummary = '';
		}
		showComplianceModal = true;
	}

	async function acceptComplianceAndRetry() {
		if (!pendingComplianceClaim || isAcceptingPolicy) return;
		isAcceptingPolicy = true;
		try {
			const res = await fetch('/api/compliance/acceptPolicy', { method: 'POST' });
			const data = await res.json();
			if (!data.success) {
				toast.error(data.error || 'Failed to record acceptance');
				return;
			}
			showComplianceModal = false;
			const claim = pendingComplianceClaim;
			pendingComplianceClaim = null;
			await claimLead(claim.leadId, claim.businessId, claim.confirmBranch);
		} catch (error) {
			console.error('Accept policy error:', error);
			toast.error('An error occurred while accepting the policy');
		} finally {
			isAcceptingPolicy = false;
		}
	}

	async function confirmBranchCreation() {
		if (!pendingClaimLeadId || !pendingClaimBusinessId) return;
		showBranchConfirm = false;
		await claimLead(pendingClaimLeadId, pendingClaimBusinessId, true);
		pendingClaimLeadId = null;
		pendingClaimBusinessId = null;
		branchConfirmDistrict = '';
	}

	function cancelBranchConfirm() {
		showBranchConfirm = false;
		pendingClaimLeadId = null;
		pendingClaimBusinessId = null;
		branchConfirmDistrict = '';
		isClaiming = false;
	}

	function handleProposalOpen(event: CustomEvent) {
		selectedLeadForProposal = event.detail.proposalData;
		showProposalModal = true;
	}

	function handleDeleteRequest(event: CustomEvent) {
		const lead = leads.find((l) => l.id === event.detail.leadId);
		if (lead) {
			leadToDelete = lead;
			showDeleteConfirm = true;
		}
	}

	async function confirmDelete() {
		if (!leadToDelete || isDeleting) return;
		isDeleting = true;

		const result = await deleteLeadAPI(leadToDelete.id);

		if (result.success) {
			const deletedId = leadToDelete.id;
			leads = leads.filter((l) => l.id !== deletedId);
			showDeleteConfirm = false;
			leadToDelete = null;
		} else {
			toast.error(result.error || 'Failed to delete lead');
		}

		isDeleting = false;
	}

	function cancelDelete() {
		if (isDeleting) return;
		showDeleteConfirm = false;
		leadToDelete = null;
	}

	function closeProposalModal() {
		showProposalModal = false;
		selectedLeadForProposal = null;
	}
</script>

<!-- LEAD DATA SECTION -->
<section id="lead-data">
	{#if errorMessage}
		<Alert.Root variant="destructive" class="mb-4">
			<Alert.Title>Error</Alert.Title>
			<Alert.Description>{errorMessage}</Alert.Description>
		</Alert.Root>
	{:else}
		<div class="flex flex-wrap items-center justify-between gap-3 mb-6">
			<!-- Tab toggle -->
			<div class="flex gap-1 p-1 bg-muted rounded-lg w-full sm:w-auto">
				<button
					class={cn(
						'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors',
						activeTab === 'available'
							? 'bg-background shadow-sm text-foreground'
							: 'text-muted-foreground hover:text-foreground'
					)}
					onclick={() => (activeTab = 'available')}
				>
					Available Leads
					{#if availableCount > 0}
						<span
							class={cn(
								'inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-semibold',
								activeTab === 'available'
									? 'bg-primary text-primary-foreground'
									: 'bg-muted-foreground/20 text-muted-foreground'
							)}
						>
							{availableCount}
						</span>
					{/if}
				</button>
				<button
					class={cn(
						'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors',
						activeTab === 'my-leads'
							? 'bg-background shadow-sm text-foreground'
							: 'text-muted-foreground hover:text-foreground'
					)}
					onclick={() => (activeTab = 'my-leads')}
				>
					My Leads
					{#if myLeadsActionableCount > 0}
						<span
							class={cn(
								'inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-semibold',
								activeTab === 'my-leads'
									? 'bg-primary text-primary-foreground'
									: 'bg-muted-foreground/20 text-muted-foreground'
							)}
						>
							{myLeadsActionableCount}
						</span>
					{/if}
				</button>
				<button
					class={cn(
						'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors',
						activeTab === 'won'
							? 'bg-background shadow-sm text-foreground'
							: 'text-muted-foreground hover:text-foreground'
					)}
					onclick={() => (activeTab = 'won')}
				>
					Won Leads
					{#if wonLeads.length > 0}
						<span
							class="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-semibold bg-muted-foreground/20 text-muted-foreground"
						>
							{wonLeads.length}
						</span>
					{/if}
				</button>
			</div>

			{#if activeTab === 'my-leads' && myLeads.length > 0}
				<LeadStageFilter
					bind:selectedStage
					onFilterChange={handleFilterChange}
				/>
			{/if}
		</div>

		<!-- Available Leads tab -->
		{#if activeTab === 'available'}
			<ul class="list-none p-0 m-0 grid gap-4 lg:grid-cols-2 items-start">
				{#if availableLeads.length > 0}
					{#each availableLeads as lead}
						<LeadTile
							{lead}
							{businessInfo}
							{isClaiming}
							{claimBlocked}
							on:update={handleLeadUpdate}
							on:claim={handleLeadClaim}
							on:proposal={handleProposalOpen}
							on:delete={handleDeleteRequest}
						/>
					{/each}
				{:else if leads.length === 0}
					<!-- Dummy test lead for brand new users -->
					<LeadTile
						lead={{
							id: 0,
							name: 'John Doe',
							phone: '+91 0123456789',
							email: 'dummy@email.com',
							stage: 0,
							status: true,
							category: 1,
							business_notes: '',
							received_at: new Date().toISOString(),
							pin_code: '110001',
							type: 'Residential - Independent Home',
							comment: 'I want to install 3kW at my home. Please call me!'
						}}
						businessInfo={{}}
						isDemo={true}
					/>
				{:else}
					<Card.Root class="border-2 border-dashed my-4">
						<Card.Content class="text-center p-8">
							<p class="font-semibold text-lg text-muted-foreground mb-2">
								No available leads right now.
							</p>
							<p class="text-sm text-muted-foreground italic">
								New leads will appear here as they come in.
							</p>
						</Card.Content>
					</Card.Root>
				{/if}
			</ul>
		{/if}

		<!-- My Leads tab -->
		{#if activeTab === 'my-leads'}
			{#if myLeads.length > 0}
				{#if filteredMyLeads.length === 0}
					<Card.Root class="border-2 border-dashed my-4 max-w-xl">
						<Card.Content class="text-center p-8">
							<p class="font-semibold text-lg text-muted-foreground mb-2">
								No leads match the selected filters.
							</p>
							<p class="text-sm text-muted-foreground italic">
								Try adjusting your filters or clearing them to see more results.
							</p>
						</Card.Content>
					</Card.Root>
				{/if}

				<ul class="list-none p-0 m-0 grid gap-4 lg:grid-cols-2 items-start">
					{#each filteredMyLeads as lead (lead.id)}
						<LeadTile
							{lead}
							{businessInfo}
							{isClaiming}
							focused={lead.id === focusLeadId}
							on:update={handleLeadUpdate}
							on:claim={handleLeadClaim}
							on:proposal={handleProposalOpen}
							on:delete={handleDeleteRequest}
						/>
					{/each}
				</ul>
			{:else}
				<Card.Root class="border-2 border-dashed my-4 max-w-xl">
					<Card.Content class="text-center p-8">
						<p class="font-semibold text-lg text-muted-foreground mb-2">No claimed leads yet.</p>
						<p class="text-sm text-muted-foreground italic">
							Claim leads from the Available Leads tab to start managing them.
						</p>
					</Card.Content>
				</Card.Root>
			{/if}
		{/if}

		<!-- Won Leads tab -->
		{#if activeTab === 'won'}
			{#if wonLeads.length > 0}
				<ul class="list-none p-0 m-0 grid gap-4 lg:grid-cols-2 items-start">
					{#each wonLeads as lead (lead.id)}
						<LeadTile
							{lead}
							{businessInfo}
							focused={lead.id === focusLeadId}
							on:update={handleLeadUpdate}
							on:proposal={handleProposalOpen}
							on:delete={handleDeleteRequest}
						/>
					{/each}
				</ul>
			{:else}
				<Card.Root class="border-2 border-dashed my-4 max-w-xl">
					<Card.Content class="text-center p-8">
						<p class="font-semibold text-lg text-muted-foreground mb-2">No won leads yet.</p>
						<p class="text-sm text-muted-foreground italic">
							Leads you mark as Won will appear here.
						</p>
					</Card.Content>
				</Card.Root>
			{/if}
		{/if}
	{/if}
</section>

<ConfirmDeleteDialog
	bind:open={showDeleteConfirm}
	title="Delete lead?"
	loading={isDeleting}
	onConfirm={confirmDelete}
	onCancel={cancelDelete}
>
	Delete the lead for <strong>{leadToDelete?.name}</strong>?
</ConfirmDeleteDialog>

<!-- Branch Confirmation Dialog -->
<Dialog.Root bind:open={showBranchConfirm}>
	<Dialog.Content class="max-w-[400px]">
		<Dialog.Header>
			<Dialog.Title>New Branch Required</Dialog.Title>
		</Dialog.Header>
		<p class="m-0 leading-relaxed text-foreground">
			This lead is from <strong>{branchConfirmDistrict}</strong> where you don't have a branch. Add
			a branch in <strong>{branchConfirmDistrict}</strong>?
		</p>
		<Dialog.Footer class="max-sm:flex-col">
			<Button
				variant="secondary"
				onclick={cancelBranchConfirm}
				disabled={isClaiming}
				class="max-sm:w-full"
			>
				Cancel
			</Button>
			<Button onclick={confirmBranchCreation} disabled={isClaiming} class="max-sm:w-full">
				{isClaiming ? 'Creating...' : 'Add Branch & Claim'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Data-Handling Policy Acceptance Modal -->
<PolicyAcceptanceModal
	bind:open={showComplianceModal}
	summary={policySummary}
	isAccepting={isAcceptingPolicy}
	onAgree={acceptComplianceAndRetry}
/>

<!-- Proposal Modal -->
{#if showProposalModal}
	<ProposalFormModal
		bind:show={showProposalModal}
		business={businessInfo}
		proposal={selectedLeadForProposal}
		onClose={closeProposalModal}
		onGenerated={closeProposalModal}
	/>
{/if}
