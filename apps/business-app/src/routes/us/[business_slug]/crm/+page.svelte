<script lang="ts">
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import CustomerInquiry from '$lib/us-new-rewrites/CustomerInquiry.svelte';

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
			{leads}
			{businessInfo}
			{errorMessage}
			{isClaiming}
			onclaimLead={(event) => claimLead(event.detail.leadId, event.detail.businessId)}
		/>
	</div>
</div>
