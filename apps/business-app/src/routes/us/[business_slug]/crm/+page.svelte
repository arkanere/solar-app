<script lang="ts">
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import CustomerInquiry from '$lib/us-new-rewrites/CustomerInquiry.svelte';
	import { PolicyAcceptanceModal } from '$lib/compliance';

	let business = $derived($page.data.business);
	let leads = $state($page.data.leads || []);
	let errorMessage = $derived($page.data.errorMessage);
	let isClaiming = $state(false);

	// Compliance (data-handling policy) gate state
	let showComplianceModal = $state(false);
	let policySummary = $state('');
	let isAcceptingPolicy = $state(false);
	let pendingComplianceClaim: { leadId: number; businessId: number } | null = null;

	let businessInfo = $derived(
		business
			? {
					id: business.id,
					businessname: business.businessname,
					description: business.description,
					phonenumber: business.phonenumber,
					email: business.email,
					address: business.address,
					website: business.website
				}
			: {}
	);

	async function claimLead(leadId: number, businessId: number) {
		if (isClaiming) return;
		isClaiming = true;

		try {
			const response = await fetch('/us/api/claimLead', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ lead_id: leadId, business_id: businessId })
			});

			const result = await response.json();

			if (!result.success && result.error === 'compliance_required') {
				pendingComplianceClaim = { leadId, businessId };
				await openComplianceModal();
				return;
			}

			if (result.success) {
				leads = leads.filter((lead: any) => lead.id !== leadId);
				if (result.newLead) {
					leads = [result.newLead, ...leads];
				}
				toast.success('Lead claimed successfully!');
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
			const res = await fetch('/us/api/compliance/status');
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
			const res = await fetch('/us/api/compliance/acceptPolicy', { method: 'POST' });
			const data = await res.json();
			if (!data.success) {
				toast.error(data.error || 'Failed to record acceptance');
				return;
			}
			showComplianceModal = false;
			const claim = pendingComplianceClaim;
			pendingComplianceClaim = null;
			await claimLead(claim.leadId, claim.businessId);
		} catch (error) {
			console.error('Accept policy error:', error);
			toast.error('An error occurred while accepting the policy');
		} finally {
			isAcceptingPolicy = false;
		}
	}
</script>

<svelte:head>
	<title>CRM - {business?.businessname || 'Business'} | Solar Vipani</title>
	<meta
		name="description"
		content="Customer Relationship Management for {business?.businessname || 'your business'}"
	/>
</svelte:head>

<div>
	<header class="text-center mb-8">
		<h1 class="text-2xl md:text-3xl font-semibold mb-2 text-accent">
			Customer Relationship Management
		</h1>
		<p class="text-base text-foreground-secondary">
			Manage your customer inquiries and leads for {business?.businessname || 'your business'}
		</p>
	</header>

	<CustomerInquiry
		{leads}
		{businessInfo}
		{errorMessage}
		{isClaiming}
		onclaimLead={(event) => claimLead(event.detail.leadId, event.detail.businessId)}
	/>
</div>

<PolicyAcceptanceModal
	bind:open={showComplianceModal}
	summary={policySummary}
	isAccepting={isAcceptingPolicy}
	onAgree={acceptComplianceAndRetry}
/>
