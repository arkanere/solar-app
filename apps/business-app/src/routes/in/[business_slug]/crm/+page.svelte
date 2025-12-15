<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/in/themeStore';
	import CustomerInquiry from '$lib/in/CustomerInquiry.svelte';

	// Destructure page data
	const businessSlug = $page.params.business_slug;
	$: ({ business, branches = [], leads = [], leadClaims = [], errorMessage } = $page.data);
	$: darkMode = $isDarkMode;

	// Local state
	let isClaiming = false;

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

	// Lead claiming function
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
				alert('Lead claimed and allocated successfully!');
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
</script>

<svelte:head>
	<title>CRM - {business?.businessname || 'Business'} | Solar Vipani</title>
	<meta
		name="description"
		content="Customer Relationship Management for {business?.businessname || 'your business'}"
	/>
</svelte:head>

<div class="page-content {darkMode ? 'dark' : 'light'}">
	<div class="container">
		<header>
			<h1>Customer Relationship Management</h1>
			<p class="subtitle">
				Manage your customer inquiries and leads for {business?.businessname || 'your business'}
			</p>
		</header>

		<CustomerInquiry
			{leads}
			{businessInfo}
			{businessSlug}
			{errorMessage}
			{isClaiming}
			on:claimLead={(event) => claimLead(event.detail.leadId, event.detail.businessId)}
		/>
	</div>
</div>

<style>
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--accent-color: #0056b3;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
	}

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

	header {
		text-align: center;
		margin-bottom: 2rem;
	}

	header h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
		color: var(--accent-color);
	}

	.dark header h1 {
		color: #66b2ff;
	}

	.subtitle {
		font-size: 1rem;
		opacity: 0.8;
	}

	@media (max-width: 768px) {
		.page-content {
			padding: 1rem 0;
		}

		.container {
			padding: 0 0.75rem;
		}

		header h1 {
			font-size: 1.5rem;
		}
	}
</style>
