<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/in/themeStore';
	import CustomerInquiryDashboardHome from '$lib/in/CustomerInquiryDashboardHome.svelte';
	import SetupProgressCard from '$lib/in/SetupProgressCard.svelte';
	import ShowEditProfile from '$lib/in/ShowEditProfile.svelte';

	// Destructure page data
	const businessSlug = $page.params.business_slug;
	$: ({ business, branches = [], leads = [], leadClaims = [], projectsCount = 0, referrersCount = 0, proposalsCount = 0, errorMessage } = $page.data);
	$: darkMode = $isDarkMode;
	$: claimedLeadsCount = leadClaims?.length || 0;

	// Local state
	let isClaiming = false;
	let showEditProfile = false;

	// Computed business info
	$: businessInfo = business
		? {
				id: business.id,
				businessname: business.businessname,
				description: business.description,
				phonenumber: business.phonenumber,
				email: business.email,
				address: business.address,
				website: business.website
			}
		: {};

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
				alert('Lead claimed and allocated successfully! Check your allocated leads section.');
				window.location.reload();
			} else {
				alert(`Error: ${result.error}`);
			}
		} catch (error) {
			console.error('Claim Lead Error:', error);
			alert('An error occurred while claiming the lead.');
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
<div class="page-content {darkMode ? 'dark' : 'light'}">
	<div class="container">
		<!-- Setup Progress Card -->
		<SetupProgressCard
			{business}
			{businessSlug}
			{projectsCount}
			{referrersCount}
			{proposalsCount}
			{claimedLeadsCount}
			on:openEditProfile={openEditProfile}
		/>

		<!-- Customer Inquiry Dashboard -->
		<CustomerInquiryDashboardHome
			{leads}
			{businessInfo}
			{businessSlug}
			{errorMessage}
			{isClaiming}
			on:claimLead={(event) => claimLead(event.detail.leadId, event.detail.businessId)}
		/>
	</div>
</div>

<!-- Edit Profile Modal -->
{#if showEditProfile && business}
	<ShowEditProfile
		show={showEditProfile}
		businessInfo={business}
		{businessSlug}
		on:close={() => (showEditProfile = false)}
		on:updated={handleProfileUpdated}
	/>
{/if}

<style>
	/* Root variables */
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
		--accent-color: #0056b3;
		--accent-hover: #00449e;
		--border-color-light: #dee2e6;
		--border-color-dark: #444;
		--success-color: #28a745;
		--success-hover: #218838;
	}

	/* Page Content */
	.page-content {
		min-height: 100vh;
		font-family: var(--font-family);
		padding: 2rem 0;
		transition: background-color 0.3s ease, color 0.3s ease;
	}

	.page-content.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	.page-content.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	.container {
		width: 100%;
		max-width: 1200px;
		padding: 0 1rem;
		margin: 0 auto;
	}

	@media (max-width: 768px) {
		.page-content {
			padding: 1rem 0;
		}

		.container {
			padding: 0 0.75rem;
		}
	}

	@media (max-width: 480px) {
		.container {
			padding: 0 0.5rem;
		}
	}
</style>
