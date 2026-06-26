<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import CustomerInquiryDashboardHome from '$lib/us-new-rewrites/CustomerInquiryDashboardHome.svelte';
	import { PolicyAcceptanceModal } from '$lib/compliance';

	const businessSlug = $page.params.business_slug;
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

	async function claimLead({ leadId, businessId }: { leadId: number; businessId: number }) {
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
				toast.success('Lead claimed! Opening CRM...');
				goto(`/us/${businessSlug}/crm`);
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
			await claimLead(claim);
		} catch (error) {
			console.error('Accept policy error:', error);
			toast.error('An error occurred while accepting the policy');
		} finally {
			isAcceptingPolicy = false;
		}
	}
</script>

<div class="min-h-screen py-8 md:py-4 transition-colors duration-300 bg-background text-foreground">
	<div class="w-full max-w-[1200px] px-4 md:px-3 max-[480px]:px-2 mx-auto">
		<CustomerInquiryDashboardHome
			bind:leads
			{businessInfo}
			{businessSlug}
			{errorMessage}
			{isClaiming}
			onClaimLead={claimLead}
		/>
	</div>
</div>

<PolicyAcceptanceModal
	bind:open={showComplianceModal}
	summary={policySummary}
	isAccepting={isAcceptingPolicy}
	onAgree={acceptComplianceAndRetry}
/>
