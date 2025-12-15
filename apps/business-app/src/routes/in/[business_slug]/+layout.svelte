<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/in/themeStore';
	import { isSidebarExpanded, isMobileMenuOpen } from '$lib/in/sidebarStore';
	import Sidebar from '$lib/in/Sidebar.svelte';
	import PostRecentProject from '$lib/in/PostRecentProject.svelte';
	import AddBranch from '$lib/in/AddBranch.svelte';
	import ShowSupport from '$lib/in/ShowSupport.svelte';
	import ShowRankingPolicy from '$lib/in/ShowRankingPolicy.svelte';
	import LeadFormModalBusiness from '$lib/in/LeadFormModalBusiness.svelte';

	// Get data from layout load
	export let data;
	$: ({ business } = data);

	// Destructure page params
	const businessSlug = $page.params.business_slug;

	// Theme
	$: darkMode = $isDarkMode;
	$: expanded = $isSidebarExpanded;

	// Modal states (lifted from individual pages)
	let showSupport = false;
	let showRankingPolicy = false;
	let showPostRecentProject = false;
	let showAddBranch = false;
	let showAddLead = false;

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

	// Handle sidebar events
	function handleSidebarAction(event) {
		const action = event.type;
		switch (action) {
			case 'addLead':
				showAddLead = true;
				break;
			case 'addBranch':
				showAddBranch = true;
				break;
			case 'postProject':
				showPostRecentProject = true;
				break;
			case 'policy':
				showRankingPolicy = true;
				break;
			case 'support':
				showSupport = true;
				break;
		}
	}

	// Handle events from modals
	function handleBranchAdded(event) {
		window.location.reload();
	}

	function handleProjectPosted(event) {
		window.location.reload();
	}

	function handleLeadAdded(event) {
		showAddLead = false;
		window.location.reload();
	}

	// Toggle mobile menu
	function toggleMobileMenu() {
		isMobileMenuOpen.update((open) => !open);
	}
</script>

<!-- Hamburger Menu Button (Mobile Only) -->
<button
	class="mobile-menu-toggle {darkMode ? 'dark' : 'light'}"
	on:click={toggleMobileMenu}
	aria-label="Toggle menu"
>
	<span></span>
	<span></span>
	<span></span>
</button>

<!-- Sidebar -->
<Sidebar
	{businessSlug}
	businessName={businessInfo.businessname || ''}
	on:addLead={handleSidebarAction}
	on:addBranch={handleSidebarAction}
	on:postProject={handleSidebarAction}
	on:policy={handleSidebarAction}
	on:support={handleSidebarAction}
/>

<!-- Main Content Area -->
<div class="layout-container {expanded ? 'sidebar-expanded' : 'sidebar-collapsed'}">
	<main class={darkMode ? 'dark' : 'light'}>
		<slot />
	</main>
</div>

<!-- Modals -->
{#if showAddLead}
	<div class="modal-overlay" on:click={() => (showAddLead = false)} on:keydown={(e) => e.key === 'Escape' && (showAddLead = false)} role="button" tabindex="0">
		<div class="modal-content" on:click={(e) => e.stopPropagation()} on:keydown={(e) => e.stopPropagation()} role="dialog" tabindex="0">
			<button class="close-btn" on:click={() => (showAddLead = false)}>&times;</button>
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
	/* Mobile Menu Toggle Button */
	.mobile-menu-toggle {
		position: fixed;
		top: 1rem;
		left: 1rem;
		z-index: 1001;
		display: none;
		flex-direction: column;
		justify-content: space-between;
		width: 30px;
		height: 21px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
	}

	.mobile-menu-toggle span {
		display: block;
		height: 3px;
		width: 100%;
		background-color: #0056b3;
		border-radius: 3px;
		transition: all 0.3s;
	}

	.mobile-menu-toggle.dark span {
		background-color: #66b2ff;
	}

	@media (max-width: 767px) {
		.mobile-menu-toggle {
			display: flex;
		}
	}

	/* Layout Container */
	.layout-container {
		margin-left: 250px;
		transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		min-height: 100vh;
	}

	.layout-container.sidebar-collapsed {
		margin-left: 60px;
	}

	@media (max-width: 767px) {
		.layout-container,
		.layout-container.sidebar-collapsed {
			margin-left: 0;
		}
	}

	/* Main Content */
	main {
		min-height: 100vh;
		transition: background-color 0.3s ease, color 0.3s ease;
		padding: 0;
		margin: 0;
		width: 100%;
	}

	main.light {
		background-color: #f8f9fa;
		color: #333;
	}

	main.dark {
		background-color: #1a1a1a;
		color: #f0f0f0;
	}

	/* Modal Styles */
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

	h2 {
		margin-top: 0;
		margin-bottom: 1rem;
		color: #0056b3;
	}
</style>
