<script module lang="ts">
	export type CustomerInquiryDashboardHomeProps = {
		leads?: any[];
		businessInfo?: Record<string, any>;
		businessSlug?: string;
		errorMessage?: string | null;
		isClaiming?: boolean;
		onClaimLead?: (lead: any) => void;
	};
</script>

<script lang="ts">
	import { toast } from 'svelte-sonner';
	import LeadTile from './LeadTile.svelte';
	import ProposalFormModal from './ProposalFormModal.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card';

	let {
		leads = $bindable([]),
		businessInfo = {},
		businessSlug = '',
		errorMessage = null,
		isClaiming = false,
		onClaimLead = () => {}
	}: CustomerInquiryDashboardHomeProps = $props();

	let showDeleteConfirm = $state(false);
	let leadToDelete = $state<any>(null);
	let isDeleting = $state(false);
	let showProposalModal = $state(false);
	let selectedLeadForProposal = $state<{ customer_name: string; phone_number: string; email: string; address: string; lead_id: number } | null>(null);

	function makeCall(phoneNumber: string, _leadName: string, leadId: number) {
		if (typeof window !== 'undefined' && (window as any).umami) {
			(window as any).umami.track(`dashboard-home-call-now-button-${leadId}`);
		}
		window.location.href = `tel:${phoneNumber}`;
	}

	const STAGES = {
		0: 'New Inquiry',
		1: 'Contacted',
		2: 'Proposal/Quotation Sent',
		3: 'Won'
	};

	const NON_EXCLUSIVE_CLAIMED_STAGES = {
		0: 'Claimed',
		1: 'Contacted',
		2: 'Proposal/Quotation Sent',
		3: 'Won'
	};

	const dummyLead = {
		name: 'John Doe',
		received_at: new Date().toISOString(),
		phone: '+91 0123456789',
		email: 'dummy@email.com',
		pin_code: '110001',
		type: 'Residential - Independent Home',
		comment: 'I want to install 3kW at my home. Please call me!'
	};

	let limitedLeads = $derived(leads.slice(0, 5));
	let savingNotes = $state<Set<number>>(new Set());
	let savedNotes = $state<Set<number>>(new Set());
	let expandedLeads = $state<Set<number>>(new Set());

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
				leads = leads.map((l) => (l.id === lead.id ? { ...l, ...result.lead } : l));
			} else {
				toast.error(result.error);
			}
		} catch (error) {
			console.error('Update Lead Error:', error);
			toast.error('An error occurred while updating the lead');
		}
	}

	async function saveBusinessNotes(lead: any) {
		const newSavingSet = new Set(savingNotes);
		newSavingSet.add(lead.id);
		savingNotes = newSavingSet;

		await updateLead(lead, { business_notes: lead.business_notes });

		const updatedSavingSet = new Set(savingNotes);
		updatedSavingSet.delete(lead.id);
		savingNotes = updatedSavingSet;

		const newSavedSet = new Set(savedNotes);
		newSavedSet.add(lead.id);
		savedNotes = newSavedSet;

		setTimeout(() => {
			const updatedSavedSet = new Set(savedNotes);
			updatedSavedSet.delete(lead.id);
			savedNotes = updatedSavedSet;
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

	function getNextAction(stage: number, category: number | null, status: any) {
		if (!status || stage === 3) {
			return null;
		}

		if (category === 2) {
			switch (stage) {
				case 0:
					return 'Call the customer';
				case 1:
					return 'Send proposal/quotation if customer is interested, else make the inquiry inactive';
				case 2:
					return 'Win the sale';
				default:
					return null;
			}
		}

		if (category === 3 || category === null) {
			switch (stage) {
				case 0:
					return 'Call the customer';
				case 1:
					return 'Send proposal/quotation if customer is interested, else make the inquiry inactive';
				case 2:
					return 'Win the sale';
				default:
					return null;
			}
		}

		return null;
	}

	async function deleteLead(lead: any) {
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

	function showDeleteConfirmation(lead: any) {
		leadToDelete = lead;
		showDeleteConfirm = true;
	}

	function cancelDelete() {
		if (isDeleting) return;
		showDeleteConfirm = false;
		leadToDelete = null;
	}

	function confirmDelete() {
		if (leadToDelete) {
			deleteLead(leadToDelete);
		}
	}

	function openProposalModal(lead: any) {
		selectedLeadForProposal = {
			customer_name: lead.name,
			phone_number: lead.phone,
			email: lead.email,
			address: lead.address || '',
			lead_id: lead.id
		};
		showProposalModal = true;
	}

	function closeProposalModal() {
		showProposalModal = false;
		selectedLeadForProposal = null;
	}

	function handleProposalGenerated() {
		closeProposalModal();
	}

	function toggleLeadDetails(leadId: number) {
		const newSet = new Set(expandedLeads);
		if (newSet.has(leadId)) {
			newSet.delete(leadId);
		} else {
			newSet.add(leadId);
		}
		expandedLeads = newSet;
	}
</script>

<section id="lead-data" class="space-y-4">
	<h2 class="text-2xl font-semibold text-accent">Customer Inquiry</h2>
	{#if errorMessage}
		<p class="text-destructive font-semibold p-4">{errorMessage}</p>
	{:else}
		<div class="w-full max-w-[900px] mx-auto space-y-6">
			{#if leads.length > 0}
				{#each limitedLeads as lead}
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
				{#if leads.length > 5}
					<Card.Root class="border-accent/20 bg-accent-muted">
						<Card.Content class="pt-6 text-center">
							<p class="text-sm text-accent">
								<strong>Showing 5 of {leads.length} leads.</strong>
								<a
									href="/in/{businessSlug}/crm"
									class="text-accent underline font-semibold hover:opacity-80 ml-1"
								>
									View all leads in CRM
								</a>
							</p>
						</Card.Content>
					</Card.Root>
				{/if}
			{:else}
				<Card.Root class="border-2 border-dashed opacity-70">
					<Card.Header class="border-b">
						<Card.Title class="flex items-center gap-2">
							{dummyLead.name}
							<Badge variant="outline">Test Lead</Badge>
						</Card.Title>
					</Card.Header>
					<Card.Content class="pt-6 space-y-3">
						<p class="text-sm">
							<strong>Received:</strong>
							<span class="text-success font-medium ml-1"
								>{getRelativeTime(dummyLead.received_at).text}</span
							>
						</p>
						<div class="flex flex-wrap items-center gap-4 max-sm:flex-col max-sm:items-start">
							<p class="text-sm"><strong>Phone:</strong> {dummyLead.phone}</p>
							<Button variant="secondary" disabled size="sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="mr-2"
								>
									<path
										d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
									></path>
								</svg>
								CALL NOW
							</Button>
						</div>
						<p class="text-sm"><strong>Email:</strong> {dummyLead.email}</p>
						<p class="text-sm"><strong>Pin Code:</strong> {dummyLead.pin_code}</p>
						<p class="text-sm"><strong>Type:</strong> {dummyLead.type}</p>
						<p class="text-sm"><strong>Customer Comment:</strong> {dummyLead.comment}</p>
					</Card.Content>
				</Card.Root>
			{/if}
		</div>

		<div class="flex justify-center pt-6 border-t-2 border-border">
			<Button size="lg" onclick={() => (window.location.href = `/in/${businessSlug}/crm`)}>
				Open CRM
			</Button>
		</div>
	{/if}
</section>

<Dialog.Root bind:open={showDeleteConfirm}>
	<Dialog.Content class="max-w-[400px]">
		<Dialog.Header>
			<Dialog.Title>Confirm Delete</Dialog.Title>
		</Dialog.Header>
		{#if leadToDelete}
			<p class="leading-relaxed">
				Are you sure you want to delete the lead for <strong>{leadToDelete.name}</strong>?
			</p>
		{/if}
		<Dialog.Footer class="max-[480px]:flex-col">
			<Button variant="secondary" onclick={cancelDelete} disabled={isDeleting} class="max-[480px]:w-full">
				Cancel
			</Button>
			<Button variant="destructive" onclick={confirmDelete} disabled={isDeleting} class="max-[480px]:w-full">
				{isDeleting ? 'Deleting...' : 'Delete Lead'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

{#if showProposalModal}
	<ProposalFormModal
		bind:show={showProposalModal}
		business={businessInfo}
		proposal={selectedLeadForProposal}
		onClose={closeProposalModal}
		onGenerated={handleProposalGenerated}
	/>
{/if}
