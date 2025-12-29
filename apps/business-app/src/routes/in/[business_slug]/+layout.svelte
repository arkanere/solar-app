<script>
	import { page } from '$app/stores';
	import { isSidebarExpanded, isMobileMenuOpen } from '$lib/in/sidebarStore';
	import Sidebar from '$lib/in/Sidebar.svelte';
	import PostRecentProject from '$lib/in/PostRecentProject.svelte';
	import AddBranch from '$lib/in/AddBranch.svelte';
	import ShowSupport from '$lib/in/ShowSupport.svelte';
	import ShowRankingPolicy from '$lib/in/ShowRankingPolicy.svelte';
	import LeadFormModalBusiness from '$lib/in/LeadFormModalBusiness.svelte';

	// Get data from layout load
	let { data, children } = $props();
	let business = $derived(data.business);

	// Destructure page params
	let businessSlug = $derived($page.params.business_slug);

	// Sidebar state
	let expanded = $derived($isSidebarExpanded);

	// Modal states (lifted from individual pages)
	let showSupport = $state(false);
	let showRankingPolicy = $state(false);
	let showPostRecentProject = $state(false);
	let showAddBranch = $state(false);
	let showAddLead = $state(false);

	// Computed business info
	let businessInfo = $derived(business
		? {
				id: business.id,
				businessname: business.businessname,
				description: business.description,
				phonenumber: business.phonenumber,
				email: business.email,
				address: business.address,
				website: business.website
			}
		: {});

	let businessEmail = $derived(business?.email || '');

	// Sidebar action handlers
	function handleAddLead() {
		showAddLead = true;
	}

	function handleAddBranch() {
		showAddBranch = true;
	}

	function handlePostProject() {
		showPostRecentProject = true;
	}

	function handlePolicy() {
		showRankingPolicy = true;
	}

	function handleSupport() {
		showSupport = true;
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
	class="mobile-menu-toggle"
	onclick={toggleMobileMenu}
	aria-label="Toggle menu"
>
	<span class="bg-accent"></span>
	<span class="bg-accent"></span>
	<span class="bg-accent"></span>
</button>

<!-- Sidebar -->
<Sidebar
	{businessSlug}
	businessName={businessInfo.businessname || ''}
	{businessEmail}
	onAddLead={handleAddLead}
	onAddBranch={handleAddBranch}
	onPostProject={handlePostProject}
	onPolicy={handlePolicy}
	onSupport={handleSupport}
/>

<!-- Main Content Area -->
<div class="layout-container {expanded ? 'sidebar-expanded' : 'sidebar-collapsed'}">
	<main class="min-h-screen bg-background text-foreground transition-colors duration-300">
		{@render children?.()}
	</main>
</div>

<!-- Modals -->
{#if showAddLead}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="modal-overlay"
		onclick={(e) => {
			if (e.target === e.currentTarget) {
				showAddLead = false;
			}
		}}
	>
		<div class="modal-content bg-card text-card-foreground" role="dialog" aria-modal="true">
			<button class="close-btn text-foreground-muted hover:text-foreground" onclick={() => (showAddLead = false)}>&times;</button>
			<h2 class="text-accent">Add Lead</h2>
			<LeadFormModalBusiness
				businessName={business?.businessname || ''}
				{businessSlug}
				onLeadAdded={handleLeadAdded}
			/>
		</div>
	</div>
{/if}

{#if showPostRecentProject}
	<PostRecentProject
		bind:show={showPostRecentProject}
		{businessSlug}
		onClose={() => (showPostRecentProject = false)}
		onPosted={handleProjectPosted}
	/>
{/if}

{#if showSupport}
	<ShowSupport bind:show={showSupport} onClose={() => (showSupport = false)} />
{/if}

{#if showRankingPolicy}
	<ShowRankingPolicy bind:show={showRankingPolicy} onClose={() => (showRankingPolicy = false)} />
{/if}

{#if showAddBranch}
	<AddBranch
		bind:show={showAddBranch}
		businessId={businessInfo.id}
		{businessSlug}
		onClose={() => (showAddBranch = false)}
		onBranchAdded={handleBranchAdded}
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
		border-radius: 3px;
		transition: all 0.3s;
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

	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: hsl(var(--foreground) / 0.5);
		display: flex;
		justify-content: center;
		align-items: flex-start;
		z-index: 1000;
		overflow-y: auto;
		padding: 20px 0;
	}

	.modal-content {
		position: relative;
		padding: 20px;
		border-radius: var(--radius-lg);
		max-width: 500px;
		width: 100%;
		margin: auto 20px;
		max-height: calc(100vh - 40px);
		overflow-y: auto;
		border: 1px solid hsl(var(--border));
		box-shadow: var(--shadow-lg);
	}

	.close-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		z-index: 1001;
		transition: color 0.15s ease;
	}

	h2 {
		margin-top: 0;
		margin-bottom: 1rem;
	}
</style>
