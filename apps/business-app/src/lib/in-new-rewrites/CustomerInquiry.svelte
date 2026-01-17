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
	};

	export type CustomerInquiryProps = {
		leads?: Lead[];
		businessInfo?: Record<string, any>;
		errorMessage?: string | null;
		isClaiming?: boolean;
		onClaimLead?: (lead: any) => void;
	};
</script>

<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Clock, Phone } from '@lucide/svelte';
	import LeadStageFilter from './LeadStageFilter.svelte';
	import ProposalFormModal from './ProposalFormModal.svelte';
	import LeadTile from './LeadTile.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';

	let {
		leads = $bindable([]),
		businessInfo = {},
		errorMessage = null,
		isClaiming = false,
		onClaimLead = () => {}
	}: CustomerInquiryProps = $props();

	// Proposal modal state
	let showProposalModal = $state(false);
	let selectedLeadForProposal: {
		customer_name: string;
		phone_number: string;
		email: string;
		address: string;
		lead_id: number;
	} | null = $state(null);

	// Filter state
	let selectedCategory = $state('all');
	let selectedStage = $state('all');
	let selectedStatus = $state('all');
	let filteredLeads: Lead[] = $state([]);

	// Function to make call
	function makeCall(phoneNumber: string, _leadName: string, leadId: number) {
		// Track Umami event after hydration
		if (typeof window !== 'undefined' && (window as any).umami) {
			(window as any).umami.track(`crm-call-now-button-${leadId}`);
		}
		window.location.href = `tel:${phoneNumber}`;
	}

	// Delete confirmation state
	let showDeleteConfirm = $state(false);
	let leadToDelete: Lead | null = $state(null);
	let isDeleting = $state(false);

	// Lead stage mapping
	const STAGES = {
		0: 'New Inquiry',
		1: 'Contacted',
		2: 'Proposal/Quotation Sent',
		3: 'Won'
	};

	// Stage mapping for Non-Exclusive-Claimed leads (category 2)
	const NON_EXCLUSIVE_CLAIMED_STAGES = {
		0: 'Claimed',
		1: 'Contacted',
		2: 'Proposal/Quotation Sent',
		3: 'Won'
	};

	// Dummy test lead for new users
	const dummyLead = {
		name: 'John Doe',
		received_at: new Date().toISOString(),
		phone: '+91 0123456789',
		email: 'dummy@email.com',
		pin_code: '110001',
		type: 'Residential - Independent Home',
		comment: 'I want to install 3kW at my home. Please call me!'
	};

	async function updateLead(lead: any, updateFields: Record<string, any> = {}) {
		try {
			const response = await fetch('/in/api/updateLeadByBusiness', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: lead.id,
					stage: updateFields.stage !== undefined ? Number(updateFields.stage) : Number(lead.stage),
					status: updateFields.status !== undefined ? updateFields.status : lead.status,
					business_notes:
						updateFields.business_notes !== undefined
							? updateFields.business_notes
							: lead.business_notes
				})
			});

			if (!response.ok) {
				throw new Error('Failed to update lead');
			}

			const result = await response.json();

			if (result.success) {
				// Update the lead in the local array
				leads = leads.map((l) => (l.id === lead.id ? { ...l, ...result.lead } : l));
			} else {
				toast.error(result.error);
			}
		} catch (error) {
			console.error('Update Lead Error:', error);
			toast.error('An error occurred while updating the lead');
		}
	}

	// State for tracking save status per lead
	let savingNotes = $state<Set<number>>(new Set());
	let savedNotes = $state<Set<number>>(new Set());

	// State for tracking expanded/collapsed leads (compact view)
	let expandedLeads = $state<Set<number>>(new Set());

	// Function to save business notes
	async function saveBusinessNotes(lead: any) {
		const newSavingSet = new Set(savingNotes);
		newSavingSet.add(lead.id);
		savingNotes = newSavingSet; // Create new Set instance for Svelte 5 reactivity

		await updateLead(lead, { business_notes: lead.business_notes });

		const updatedSavingSet = new Set(savingNotes);
		updatedSavingSet.delete(lead.id);
		savingNotes = updatedSavingSet; // Create new Set instance for Svelte 5 reactivity

		// Show saved status
		const newSavedSet = new Set(savedNotes);
		newSavedSet.add(lead.id);
		savedNotes = newSavedSet; // Create new Set instance for Svelte 5 reactivity

		// Hide saved status after 3 seconds
		setTimeout(() => {
			const updatedSavedSet = new Set(savedNotes);
			updatedSavedSet.delete(lead.id);
			savedNotes = updatedSavedSet; // Create new Set instance for Svelte 5 reactivity
		}, 3000);
	}

	async function claimLead(leadId: number, businessId: number) {
		if (isClaiming) return;

		onClaimLead({ leadId, businessId });
	}

	function getRelativeTime(dateString: string) {
		const now = new Date();
		const date = new Date(dateString);
		const diffInMs = now.getTime() - date.getTime();
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
		const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
		const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

		if (diffInDays > 0) {
			return {
				text: `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`,
				variant: diffInDays <= 1 ? 'time-fresh' : diffInDays <= 3 ? 'time-recent' : 'time-old'
			};
		} else if (diffInHours > 0) {
			return {
				text: `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`,
				variant: 'time-fresh'
			};
		} else if (diffInMinutes > 0) {
			return {
				text: `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`,
				variant: 'time-fresh'
			};
		} else {
			return {
				text: 'Just now',
				variant: 'time-fresh'
			};
		}
	}

	function getNextAction(stage: number, category: number, status: string) {
		// No next action if lead is inactive or won
		if (status === 'false' || stage === 3) {
			return null;
		}

		// For Non-Exclusive-Claimed leads (category 2)
		if (category === 2) {
			switch (stage) {
				case 0: // Claimed
					return 'Call the customer';
				case 1: // Contacted
					return 'Send proposal/quotation if customer is interested, else make the inquiry inactive';
				case 2: // Proposal/Quotation Sent
					return 'Win the sale';
				default:
					return null;
			}
		}

		// For Exclusive leads (category 3 or null)
		if (category === 3 || category === null) {
			switch (stage) {
				case 0: // New Inquiry
					return 'Call the customer';
				case 1: // Contacted
					return 'Send proposal/quotation if customer is interested, else make the inquiry inactive';
				case 2: // Proposal/Quotation Sent
					return 'Win the sale';
				default:
					return null;
			}
		}

		return null;
	}

	// Filter function
	function filterLeads() {
		filteredLeads = leads.filter((lead) => {
			// Category filter
			if (selectedCategory !== 'all') {
				const categoryValue = parseInt(selectedCategory);
				// Handle exclusive leads (category 3 or null/undefined)
				if (categoryValue === 3) {
					if (lead.category !== 3 && lead.category !== null && lead.category !== undefined) {
						return false;
					}
				} else {
					if (lead.category !== categoryValue) {
						return false;
					}
				}
			}

			// Stage filter
			if (selectedStage !== 'all') {
				const stageValue = parseInt(selectedStage);
				if (lead.stage !== stageValue) {
					return false;
				}
			}

			// Status filter
			if (selectedStatus !== 'all') {
				const statusValue = selectedStatus === 'true';
				if (lead.status !== statusValue) {
					return false;
				}
			}

			return true;
		});
	}

	// Handle filter changes
	function handleFilterChange(filters: {
		selectedCategory: string;
		selectedStage: string;
		selectedStatus: string;
	}) {
		selectedCategory = filters.selectedCategory;
		selectedStage = filters.selectedStage;
		selectedStatus = filters.selectedStatus;
		filterLeads();
	}

	// Update filtered leads when leads change
	$effect(() => {
		leads;
		filterLeads();
	});

	// Delete lead function
	async function deleteLead(lead: Lead) {
		if (isDeleting) return;
		isDeleting = true;

		try {
			const response = await fetch('/in/api/deleteLeadByBusiness', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: lead.id
				})
			});

			if (!response.ok) {
				throw new Error('Failed to delete lead');
			}

			const result = await response.json();

			if (result.success) {
				// Remove the lead from the local array
				leads = leads.filter((l) => l.id !== lead.id);
				showDeleteConfirm = false;
				leadToDelete = null;
			} else {
				toast.error(result.error);
			}
		} catch (error) {
			console.error('Delete Lead Error:', error);
			toast.error('An error occurred while deleting the lead');
		} finally {
			isDeleting = false;
		}
	}

	// Show delete confirmation
	function showDeleteConfirmation(lead: Lead) {
		leadToDelete = lead;
		showDeleteConfirm = true;
	}

	// Cancel delete
	function cancelDelete() {
		if (isDeleting) return; // Prevent canceling while deleting
		showDeleteConfirm = false;
		leadToDelete = null;
	}

	// Confirm delete
	function confirmDelete() {
		if (leadToDelete) {
			deleteLead(leadToDelete);
		}
	}

	// Open proposal modal
	function openProposalModal(lead: Lead) {
		selectedLeadForProposal = {
			customer_name: lead.name,
			phone_number: lead.phone,
			email: lead.email,
			address: lead.address || '',
			lead_id: lead.id
		};
		showProposalModal = true;
	}

	// Close proposal modal
	function closeProposalModal() {
		showProposalModal = false;
		selectedLeadForProposal = null;
	}

	// Handle proposal generated/updated
	function handleProposalGenerated() {
		// Optionally refresh leads or show success message
		closeProposalModal();
	}

	// Toggle lead details expand/collapse
	function toggleLeadDetails(leadId: number) {
		const newSet = new Set(expandedLeads);
		if (newSet.has(leadId)) {
			newSet.delete(leadId);
		} else {
			newSet.add(leadId);
		}
		expandedLeads = newSet; // Create new Set instance for Svelte 5 reactivity
	}
</script>

<!-- LEAD DATA SECTION -->
<section id="lead-data">
	<h2 class="text-2xl font-semibold text-left text-accent mb-4">Customer Inquiry</h2>
	{#if errorMessage}
		<Alert.Root variant="destructive" class="mb-4">
			<Alert.Title>Error</Alert.Title>
			<Alert.Description>{errorMessage}</Alert.Description>
		</Alert.Root>
	{:else}
		{#if leads.length > 0}
			<LeadStageFilter
				bind:selectedCategory
				bind:selectedStage
				bind:selectedStatus
				onFilterChange={handleFilterChange}
			/>

			{#if filteredLeads.length === 0}
				<Card.Root class="border-2 border-dashed my-4">
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
		{/if}

		<ul class="list-none p-0 w-full max-w-[900px] mx-auto">
			{#if leads.length > 0}
				{#each filteredLeads as lead}
					<LeadTile
						{lead}
						{businessInfo}
						{isClaiming}
						{savingNotes}
						{savedNotes}
						{expandedLeads}
						{STAGES}
						{NON_EXCLUSIVE_CLAIMED_STAGES}
						{makeCall}
						{saveBusinessNotes}
						{updateLead}
						{getRelativeTime}
						{getNextAction}
						{openProposalModal}
						{showDeleteConfirmation}
						{claimLead}
						onToggleDetails={(e) => toggleLeadDetails(e.leadId)}
					/>
				{/each}
			{:else}
				<!-- Display dummy test lead when no leads exist -->
				<li class="mb-8">
					<Card.Root class="border-2 border-dashed opacity-70">
						<Card.Header class="border-b">
							<Card.Title class="flex items-center gap-2">
								{dummyLead.name}
								<Badge variant="outline" class="bg-warning-muted text-warning">Test Lead</Badge>
							</Card.Title>
						</Card.Header>
						<Card.Content class="p-5">
							<p class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
								<Clock class="h-3.5 w-3.5 shrink-0" />
								<span class="font-medium">Received:</span>
								<span
									class={cn(
										'font-medium',
										getRelativeTime(dummyLead.received_at).variant === 'time-fresh' && 'text-success',
										getRelativeTime(dummyLead.received_at).variant === 'time-recent' && 'text-warning',
										getRelativeTime(dummyLead.received_at).variant === 'time-old' &&
											'text-muted-foreground'
									)}>{getRelativeTime(dummyLead.received_at).text}</span
								>
							</p>
							<div class="flex items-center justify-between gap-4 mb-4 flex-wrap">
								<p class="text-foreground m-0"><strong>Phone:</strong> {dummyLead.phone}</p>
								<Button variant="default" disabled class="opacity-50">
									<Phone class="h-4 w-4 mr-2" />
									CALL NOW
								</Button>
							</div>
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<p class="text-foreground m-0">
									<strong class="text-foreground-secondary">Email:</strong>
									{dummyLead.email}
								</p>
								<p class="text-foreground m-0">
									<strong class="text-foreground-secondary">Pin Code:</strong>
									{dummyLead.pin_code}
								</p>
								<p class="text-foreground m-0">
									<strong class="text-foreground-secondary">Type:</strong>
									{dummyLead.type}
								</p>
								<p class="text-foreground m-0 sm:col-span-2">
									<strong class="text-foreground-secondary">Customer Comment:</strong>
									{dummyLead.comment}
								</p>
							</div>
						</Card.Content>
					</Card.Root>
				</li>
			{/if}
		</ul>
	{/if}
</section>

<!-- Delete Confirmation Modal -->
<Dialog.Root bind:open={showDeleteConfirm}>
	<Dialog.Content class="max-w-[400px]">
		<Dialog.Header>
			<Dialog.Title>Confirm Delete</Dialog.Title>
		</Dialog.Header>
		{#if leadToDelete}
			<p class="m-0 leading-relaxed text-foreground">
				Are you sure you want to delete the lead for <strong>{leadToDelete.name}</strong>?
			</p>
		{/if}
		<Dialog.Footer class="max-sm:flex-col">
			<Button
				variant="secondary"
				onclick={cancelDelete}
				disabled={isDeleting}
				class="max-sm:w-full"
			>
				Cancel
			</Button>
			<Button
				variant="destructive"
				onclick={confirmDelete}
				disabled={isDeleting}
				class="max-sm:w-full"
			>
				{isDeleting ? 'Deleting...' : 'Delete Lead'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Proposal Modal -->
{#if showProposalModal}
	<ProposalFormModal
		bind:show={showProposalModal}
		business={businessInfo}
		proposal={selectedLeadForProposal}
		onClose={closeProposalModal}
		onGenerated={handleProposalGenerated}
	/>
{/if}
