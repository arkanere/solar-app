<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import CustomerInquiry from '$lib/in-new-rewrites/CustomerInquiry.svelte';

	let businessSlug = $derived($page.params.business_slug);
	let business = $derived($page.data.business);
	let leads = $state($page.data.leads || []);
	let errorMessage = $derived($page.data.errorMessage);
	let claimGate = $derived($page.data.claimGate);

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

	function handleClaimSuccess({ leadId, result }: { leadId: number; result: any }) {
		leads = leads.filter((lead) => lead.id !== leadId);
		toast.success('Lead claimed! Opening CRM...');
		goto(`/in/${businessSlug}/crm`);
	}
</script>

<div class="min-h-screen py-8 md:py-4 transition-colors duration-300 bg-background text-foreground">
	<div class="w-full max-w-[1200px] px-4 md:px-3 max-[480px]:px-2 mx-auto">
		<CustomerInquiry
			bind:leads
			{businessInfo}
			{businessSlug}
			{errorMessage}
			mode="dashboard"
			claimBlocked={claimGate?.isBlocked ?? false}
			onClaimSuccess={handleClaimSuccess}
		/>
	</div>
</div>
