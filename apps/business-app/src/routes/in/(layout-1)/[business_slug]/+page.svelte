<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import CustomerInquiry from '$lib/in-new-rewrites/CustomerInquiry.svelte';
	import SetupProgressCard from '$lib/in-new-rewrites/SetupProgressCard.svelte';
	import ShowEditProfile from '$lib/in-new-rewrites/ShowEditProfile.svelte';

	// Destructure page data
	let businessSlug = $derived($page.params.business_slug);
	let business = $derived($page.data.business);
	let branches = $derived($page.data.branches || []);
	let leads = $state($page.data.leads || []);
	let leadClaims = $derived($page.data.leadClaims || []);
	let projectsCount = $derived($page.data.projectsCount || 0);
	let referrersCount = $derived($page.data.referrersCount || 0);
	let proposalsCount = $derived($page.data.proposalsCount || 0);
	let errorMessage = $derived($page.data.errorMessage);
	let claimedLeadsCount = $derived(leadClaims?.length || 0);

	// Local state
	let isClaiming = $state(false);
	let showEditProfile = $state(false);

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

	// Lead claiming function (specific to this page)
	async function claimLead(leadId, businessId) {
		if (isClaiming) return;
		isClaiming = true;

		try {
			const response = await fetch('/in/api/claimLead', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ lead_id: leadId, business_id: businessId })
			});

			const result = await response.json();

			if (result.success) {
				leads = leads.filter((lead) => lead.id !== leadId);
				toast.success('Lead claimed! Opening CRM...');
				goto(`/in/${businessSlug}/crm`);
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

	// Function to open edit profile modal
	function openEditProfile() {
		console.log('Opening edit profile with business data:', business);
		console.log('Phone number:', business?.phonenumber);
		showEditProfile = true;
	}

	// Handle profile updated event
	function handleProfileUpdated() {
		showEditProfile = false;
		window.location.reload();
	}
</script>

<!-- Main Content -->
<div class="min-h-screen py-8 md:py-4 transition-colors duration-300 bg-background text-foreground">
	<div class="w-full max-w-[1200px] px-4 md:px-3 max-[480px]:px-2 mx-auto">
		<!-- Setup Progress Card -->
		<SetupProgressCard
			{business}
			{businessSlug}
			{projectsCount}
			{referrersCount}
			{proposalsCount}
			{claimedLeadsCount}
			onOpenEditProfile={openEditProfile}
		/>

		<!-- Customer Inquiry Dashboard -->
		<CustomerInquiry
			bind:leads
			{businessInfo}
			{businessSlug}
			{errorMessage}
			{isClaiming}
			mode="dashboard"
			onClaimLead={({ leadId, businessId }) => claimLead(leadId, businessId)}
		/>
	</div>
</div>

<!-- Edit Profile Modal -->
{#if showEditProfile && business}
	<ShowEditProfile
		bind:show={showEditProfile}
		businessInfo={business}
		{businessSlug}
		onClose={() => (showEditProfile = false)}
		onUpdated={handleProfileUpdated}
	/>
{/if}
