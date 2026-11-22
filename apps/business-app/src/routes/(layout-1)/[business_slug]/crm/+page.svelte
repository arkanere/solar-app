<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import CustomerInquiry from '$lib/components/CustomerInquiry.svelte';

	// Destructure page data
	let business = $derived($page.data.business);
	let leads = $state($page.data.leads || []);
	let errorMessage = $derived($page.data.errorMessage);
	let claimGate = $derived($page.data.claimGate);

	// `claimed` is set by a dashboard claim; `lead` by a sign-in link sent about
	// a lead. A link about a lead this business has since claimed names the
	// original, so it resolves to the claimed copy.
	function initialFocus(): number | null {
		const params = $page.url.searchParams;
		const claimed = Number(params.get('claimed'));
		if (claimed) return claimed;
		const linked = Number(params.get('lead'));
		if (!linked) return null;
		const lead =
			leads.find((l: any) => l.id === linked) ?? leads.find((l: any) => l.original_id === linked);
		return lead?.id ?? null;
	}
	let focusLeadId = $state<number | null>(initialFocus());

	onMount(() => {
		// Drop the params so a reload does not jump to the lead again
		const params = $page.url.searchParams;
		if (params.has('claimed') || params.has('lead')) {
			const url = new URL($page.url);
			url.searchParams.delete('claimed');
			url.searchParams.delete('lead');
			replaceState(url, $page.state);
		}
	});

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
	<h1 class="text-2xl font-semibold text-foreground mb-4">Leads</h1>

	<CustomerInquiry
		bind:leads
		{businessInfo}
		{errorMessage}
		claimBlocked={claimGate?.isBlocked ?? false}
		bind:focusLeadId
		onClaimSuccess={handleClaimSuccess}
	/>
</div>
