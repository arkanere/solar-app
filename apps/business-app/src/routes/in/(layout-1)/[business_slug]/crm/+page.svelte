<script lang="ts">
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import CustomerInquiry from '$lib/in-new-rewrites/CustomerInquiry.svelte';

	// Destructure page data
	let businessSlug = $derived($page.params.business_slug);
	let business = $derived($page.data.business);
	let branches = $derived($page.data.branches || []);
	let leads = $state($page.data.leads || []);
	let leadClaims = $derived($page.data.leadClaims || []);
	let errorMessage = $derived($page.data.errorMessage);

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
		leads = leads.filter((lead) => lead.id !== leadId);
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

<div class="min-h-screen py-8 md:py-4 transition-colors duration-300 bg-background text-foreground">
	<div class="w-full max-w-[1200px] px-4 md:px-3 mx-auto">
		<header class="text-center mb-8">
			<h1 class="text-2xl md:text-3xl font-semibold mb-2 text-accent">
				Customer Relationship Management
			</h1>
			<p class="text-base text-foreground-secondary">
				Manage your customer inquiries and leads for {business?.businessname || 'your business'}
			</p>
		</header>

		<CustomerInquiry
			bind:leads
			{businessInfo}
			{errorMessage}
			onClaimSuccess={handleClaimSuccess}
		/>
	</div>
</div>
