<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import CustomerInquiryDashboardHome from '$lib/us-new-rewrites/CustomerInquiryDashboardHome.svelte';

	const businessSlug = $page.params.business_slug;
	let business = $derived($page.data.business);
	let leads = $state($page.data.leads || []);
	let errorMessage = $derived($page.data.errorMessage);
	let isClaiming = $state(false);

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
