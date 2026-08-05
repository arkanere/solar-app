<script lang="ts">
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import CustomerInquiry from '$lib/in-new-rewrites/CustomerInquiry.svelte';

	// Destructure page data
	let business = $derived($page.data.business);
	let leads = $state($page.data.leads || []);
	let errorMessage = $derived($page.data.errorMessage);
	let claimGate = $derived($page.data.claimGate);

	// Computed business info
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
		leads = leads.filter((lead: any) => lead.id !== leadId);
		if (result.newLead) {
			leads = [result.newLead, ...leads];
		}
		toast.success('Lead claimed and allocated successfully!');
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
	<header class="mb-6">
			<h1 class="text-2xl font-semibold text-foreground">
				Customer Relationship Management
			</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Manage your customer inquiries and leads for {business?.businessname || 'your business'}
			</p>
		</header>

	<CustomerInquiry
		bind:leads
		{businessInfo}
		{errorMessage}
		claimBlocked={claimGate?.isBlocked ?? false}
		onClaimSuccess={handleClaimSuccess}
	/>
</div>
