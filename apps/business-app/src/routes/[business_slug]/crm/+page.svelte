<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';
	import CustomerInquiry from '$lib/CustomerInquiry.svelte';

	// Destructure page data for cleaner access
	const businessSlug = $page.params.business_slug;
	$: ({ business, branches = [], leads = [], leadClaims = [], errorMessage } = $page.data);
	$: darkMode = $isDarkMode;

	// Initialize state variables
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

	async function claimLead(leadId, businessId) {
		if (isClaiming) return;
		isClaiming = true;

		try {
			const response = await fetch('/api/claimLead', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ lead_id: leadId, business_id: businessId })
			});

			const result = await response.json();

			if (result.success) {
				// Remove the claimed lead from the non-exclusive list since it's now allocated
				leads = leads.filter((lead) => lead.id !== leadId);
				alert('Lead claimed and allocated successfully! Check your allocated leads section.');
				// Optionally refresh the page to show the new allocated lead
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
	<meta name="description" content="Customer Relationship Management for {business?.businessname || 'your business'}" />
</svelte:head>

<!-- MAIN CONTENT -->
<main class={darkMode ? 'dark' : 'light'}>
	<div class="container">
		<!-- Header -->
		<header>
			<h1>Customer Relationship Management</h1>
			<p class="subtitle">
				Manage your customer inquiries and leads for {business?.businessname || 'your business'}
			</p>
		</header>

		<!-- Customer Inquiry Section -->
		<CustomerInquiry
			{leads}
			{businessInfo}
			{errorMessage}
			{isClaiming}
			on:claimLead={(event) => claimLead(event.detail.leadId, event.detail.businessId)}
		/>
	</div>
</main>

<style>
	/* Root variables for light and dark modes */
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--light-secondary-text-color: #666;
		--dark-secondary-text-color: #ccc;
		--accent-color: #0056b3;
		--accent-hover: #00449e;
		--border-color-light: #ddd;
		--border-color-dark: #444;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
		--success-color: #28a745;
		--success-hover: #218838;
	}

	/* Main layout styling */
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		font-family: var(--font-family);
		min-height: 100vh;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
		padding: 0;
		margin: 0;
		width: 100%;
	}

	.container {
		width: 100%;
		max-width: 800px;
		padding: 0 1rem;
		margin: 0 auto;
		overflow-x: hidden;
	}

	/* Light/Dark mode */
	.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	/* Header */
	header h1 {
		font-size: 2rem;
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
		font-weight: 600;
		text-align: center;
		color: var(--accent-color);
	}

	.subtitle {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 1.1rem;
		color: var(--light-secondary-text-color);
	}

	.dark .subtitle {
		color: var(--dark-secondary-text-color);
	}

	/* Media queries for mobile responsiveness */
	@media (max-width: 768px) {
		.container {
			padding: 0 0.75rem;
		}

		header h1 {
			font-size: 1.5rem;
		}

		.subtitle {
			font-size: 1rem;
		}
	}

	@media (max-width: 480px) {
		header h1 {
			font-size: 1.3rem;
		}

		.subtitle {
			font-size: 0.9rem;
		}
	}
</style>