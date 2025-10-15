<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';
	import ShowSupport from '$lib/ShowSupport.svelte';
	import ShowRankingPolicy from '$lib/ShowRankingPolicy.svelte';
	import PostRecentProject from '$lib/PostRecentProject.svelte';
	import AddBranch from '$lib/AddBranch.svelte';
	import CustomerInquiryDashboardHome from '$lib/CustomerInquiryDashboardHome.svelte';
	import LeadFormModalBusiness from '$lib/LeadFormModalBusiness.svelte';

	// Destructure page data for cleaner access
	const businessSlug = $page.params.business_slug;
	$: ({ business, branches = [], leads = [], leadClaims = [], errorMessage } = $page.data);
	$: darkMode = $isDarkMode;

	// Initialize state variables
	let recentProjects = [];
	let showSupport = false;
	let showRankingPolicy = false;
	let showPostRecentProject = false;
	let showAddBranch = false;
	let showAddLead = false;
	let isClaiming = false;
	let mobileMenuOpen = false;

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


	// UI toggle functions
	const toggleSupport = () => (showSupport = !showSupport);
	const toggleRankingPolicy = () => (showRankingPolicy = !showRankingPolicy);
	const togglePostRecentProject = () => (showPostRecentProject = !showPostRecentProject);
	const toggleAddBranch = () => (showAddBranch = !showAddBranch);
	const toggleAddLead = () => (showAddLead = !showAddLead);
	const toggleMobileMenu = () => (mobileMenuOpen = !mobileMenuOpen);

	function handleProfileUpdate(event) {
		business = { ...business, ...event.detail };
	}

	function handleProjectPosted(event) {
		try {
			const newProject = event.detail;
			recentProjects = [newProject, ...recentProjects];
		} catch (error) {
			console.error('Error handling project posted:', error);
		}
	}

	function handleBranchAdded(event) {
		try {
			const newBranch = event.detail;
			// You could add branch to the business if needed
			console.log('New branch added:', newBranch);
			// Optionally update UI or notify user
		} catch (error) {
			console.error('Error handling branch added:', error);
		}
	}

	function handleLeadAdded(event) {
		try {
			const newLead = event.detail;
			console.log('New lead added:', newLead);
			// Close the modal after successful submission
			showAddLead = false;
			// Refresh the page to show the new lead
			window.location.reload();
		} catch (error) {
			console.error('Error handling lead added:', error);
		}
	}

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

<!-- TOP NAVIGATION -->
<nav class="top-nav {darkMode ? 'dark' : 'light'}">
	<div class="nav-brand">
		<a href="/{businessSlug}">
			<span class="brand-full">Solar Vipani Business Dashboard - {businessInfo.businessname || ''}</span>
			<span class="brand-mobile">{businessInfo.businessname || 'Business Dashboard'}</span>
		</a>
	</div>
	
	<div class="hamburger" on:click={toggleMobileMenu}>
		<span></span>
		<span></span>
		<span></span>
	</div>
	
	<ul class="nav-list {mobileMenuOpen ? 'open' : ''}">
				<li><button on:click={toggleAddLead}>Add Lead</button></li>
				<li>
					<a href="/{businessSlug}/crm">CRM</a>
				</li>
				<li>
					<a href="/{businessSlug}/open-inquiries">Open Inquiries</a>
				</li>
				<li><button on:click={togglePostRecentProject}>Post Recent Project</button></li>
				<li>
					<a href="/{businessSlug}/project">Manage Project</a>
				</li>
				<li><button on:click={toggleAddBranch}>Add Branch</button></li>
				<li>
					<a href="/{businessSlug}/branch">Manage Branch</a>
				</li>
				<li><button on:click={toggleRankingPolicy}>Policy</button></li>
				<li><button on:click={toggleSupport}>Support</button></li>
				<li>
					<form method="POST" action={`/us/${businessSlug}/logout`}>
						<button type="submit">Logout</button>
					</form>
				</li>
			</ul>
			
		</nav>

<!-- MAIN CONTENT -->
<main class={darkMode ? 'dark' : 'light'}>
	<div class="container">
		<CustomerInquiryDashboardHome
			{leads}
			{businessInfo}
			{businessSlug}
			{errorMessage}
			{isClaiming}
			on:claimLead={(event) => claimLead(event.detail.leadId, event.detail.businessId)}
		/>
	</div>
</main>

<!-- Component Modals -->
{#if showAddLead}
	<div class="modal-overlay">
		<div class="modal-content">
			<button class="close-btn" on:click={toggleAddLead}>&times;</button>
			<h2>Add Lead</h2>
			<LeadFormModalBusiness 
				businessName={business?.businessname || ''} 
				{businessSlug} 
				on:leadAdded={handleLeadAdded}
			/>
		</div>
	</div>
{/if}
{#if showPostRecentProject}
	<PostRecentProject
		show={showPostRecentProject}
		{businessSlug}
		on:close={() => (showPostRecentProject = false)}
		on:posted={handleProjectPosted}
	/>
{/if}

{#if showSupport}
	<ShowSupport show={showSupport} on:close={() => (showSupport = false)} />
{/if}

{#if showRankingPolicy}
	<ShowRankingPolicy show={showRankingPolicy} on:close={() => (showRankingPolicy = false)} />
{/if}


{#if showAddBranch}
	<AddBranch
		show={showAddBranch}
		businessId={businessInfo.id}
		{businessSlug}
		on:close={() => (showAddBranch = false)}
		on:branchAdded={handleBranchAdded}
	/>
{/if}

<style>
	/* Reset margins and ensure full width */
	:global(body) {
		margin: 0;
		padding: 0;
	}
	
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
		min-height: calc(100vh - 70px); /* Subtract approximate nav height */
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


	.hamburger {
		display: none;
		flex-direction: column;
		justify-content: space-between;
		width: 30px;
		height: 21px;
		cursor: pointer;
		margin: 1rem 0;
	}

	.hamburger span {
		display: block;
		height: 3px;
		width: 100%;
		background-color: var(--accent-color);
		border-radius: 3px;
	}

	.nav-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		list-style: none;
		padding: 0;
		margin: 0;
		justify-content: center;
	}

	/* Header */
	header h1 {
		font-size: 2rem;
		margin-top: 0;
		margin-bottom: 1.5rem;
		font-weight: 600;
		text-align: center;
		color: var(--accent-color);
	}

	/* Button styles */
	button {
		background-color: var(--accent-color);
		color: #fff;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
		text-decoration: none;
		display: inline-block;
		font-size: 1rem;
		font-family: var(--font-family);
		white-space: nowrap;
	}

	button:hover {
		background-color: var(--accent-hover);
	}

	button:disabled {
		background-color: #9ca3af;
		cursor: not-allowed;
	}

	/* Navigation link styles - styled to match buttons */
	.nav-list a {
		background-color: var(--accent-color);
		color: #fff;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
		text-decoration: none;
		display: inline-block;
		font-size: 1rem;
		font-family: var(--font-family);
		white-space: nowrap;
	}

	.nav-list a:hover {
		background-color: var(--accent-hover);
	}

	/* Combined Navigation Styles */
	.top-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		flex-wrap: wrap;
		transition: background-color 0.3s ease;
		margin: 0;
		position: relative;
		width: 100%;
	}

	.nav-brand {
		flex: 1;
	}

	.nav-brand a {
		text-decoration: none;
		font-size: 1.1rem;
		font-weight: 500;
		transition: color 0.3s ease;
	}

	.brand-mobile {
		display: none;
	}

	.brand-full {
		display: inline;
	}

	.nav-list {
		list-style-type: none;
		display: flex;
		justify-content: center;
		padding: 0;
		margin: 0 1rem;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.nav-list li {
		margin: 0;
	}

	.theme-toggle {
		background: none;
		border: 1px solid;
		padding: 0.25rem 0.5rem;
		font-size: 0.9rem;
		cursor: pointer;
		transition: background-color 0.3s ease, color 0.3s ease;
	}

	/* Light Mode Combined Nav */
	.top-nav.light {
		background-color: #fafafa;
		color: #333;
	}

	.top-nav.light .nav-brand a {
		color: #333;
	}

	.top-nav.light .nav-brand a:hover {
		color: #0077cc;
	}

	.top-nav.light .theme-toggle {
		border-color: #333;
		color: #333;
	}

	.top-nav.light .theme-toggle:hover {
		background-color: #333;
		color: white;
	}

	/* Dark Mode Combined Nav */
	.top-nav.dark {
		background-color: #1a1a1a;
		color: #fff;
	}

	.top-nav.dark .nav-brand a {
		color: #fff;
	}

	.top-nav.dark .nav-brand a:hover {
		color: #66b2ff;
	}

	.top-nav.dark .theme-toggle {
		border-color: #fff;
		color: #fff;
	}

	.top-nav.dark .theme-toggle:hover {
		background-color: #fff;
		color: #333;
	}

	/* Media queries for mobile responsiveness */
	@media (max-width: 768px) {
		.top-nav {
			flex-wrap: wrap;
			padding: 0.75rem;
		}

		.nav-brand {
			flex: 1;
			order: 1;
		}

		.nav-brand a {
			font-size: 0.85rem;
		}

		.brand-full {
			display: none;
		}

		.brand-mobile {
			display: inline;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 200px;
		}

		.hamburger {
			order: 2;
		}

		.theme-toggle {
			order: 3;
			margin: 0;
			padding: 0.25rem 0.5rem;
			font-size: 0.8rem;
		}

		.nav-list {
			order: 4;
			width: 100%;
			margin: 0.5rem 0 0 0;
			display: none;
		}

		.nav-list.open {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}
		
		.container {
			padding: 0 0.75rem;
		}

		.hamburger {
			display: flex;
		}

		.nav-list {
			flex-direction: column;
			width: 100%;
			gap: 0.5rem;
			display: none;
		}

		.nav-list.open {
			display: flex;
		}

		.nav-list li {
			width: 100%;
		}

		.nav-list button,
		.nav-list a,
		.nav-list form,
		.nav-list form button {
			width: 100%;
			text-align: center;
			white-space: normal; /* Allow text wrapping */
		}
	}

	@media (max-width: 480px) {
		.container {
			padding: 0 0.5rem;
		}

		.brand-mobile {
			max-width: 140px;
			font-size: 0.8rem;
		}

		header h1 {
			font-size: 1.5rem;
			word-break: break-word;
		}

		button {
			white-space: normal; /* Allow button text to wrap */
			word-break: break-word;
		}
	}

	/* Modal styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: flex-start;
		z-index: 1000;
		overflow-y: auto;
		padding: 20px 0;
	}

	.modal-content {
		position: relative;
		background: white;
		padding: 20px;
		border-radius: 8px;
		max-width: 500px;
		width: 100%;
		margin: auto 20px;
		max-height: calc(100vh - 40px);
		overflow-y: auto;
	}

	.close-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: #666;
		z-index: 1001;
	}

	.close-btn:hover {
		color: #333;
	}

	.dark .modal-content {
		background: var(--dark-card-bg);
		color: var(--dark-text-color);
	}

	.dark .close-btn {
		color: #ccc;
	}

	.dark .close-btn:hover {
		color: #fff;
	}
</style>
