<script lang="ts">
	import { page } from '$app/stores';
	import { isSidebarExpanded, isMobileMenuOpen } from '$lib/in/sidebarStore.svelte';
	import Sidebar from '$lib/in-new-rewrites/Sidebar.svelte';
	import SetupProgressCard from '$lib/in-new-rewrites/SetupProgressCard.svelte';
	import ClaimGateCard from '$lib/in-new-rewrites/ClaimGateCard.svelte';
	import ShowEditProfile from '$lib/in-new-rewrites/ShowEditProfile.svelte';
	import PostRecentProject from '$lib/in-new-rewrites/PostRecentProject.svelte';
	import AddBranch from '$lib/in-new-rewrites/AddBranch.svelte';
	import ShowSupport from '$lib/in-new-rewrites/ShowSupport.svelte';
	import ShowDeleteAccount from '$lib/in-new-rewrites/ShowDeleteAccount.svelte';
	import ShowRankingPolicy from '$lib/in-new-rewrites/ShowRankingPolicy.svelte';
	import LeadFormModalBusiness from '$lib/in-new-rewrites/LeadFormModalBusiness.svelte';
	import type { Snippet } from 'svelte';

	export type LayoutProps = {
		data: any;
		children: Snippet;
	};

	// Get data from layout load
	let { data, children }: LayoutProps = $props();
	let business = $derived(data.business);

	// Destructure page params
	let businessSlug = $derived($page.params.business_slug ?? '');

	// Sidebar state
	let expanded = $derived(isSidebarExpanded.isExpanded);

	// Modal states (lifted from individual pages)
	let showSupport = $state(false);
	let showDeleteAccount = $state(false);
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

	// Setup progress & claim gate from layout server
	let setupProgress = $derived(data.setupProgress);
	let claimGate = $derived(data.claimGate);

	// Edit profile modal (needed by SetupProgressCard and ClaimGateCard)
	let showEditProfile = $state(false);

	function openEditProfile() {
		showEditProfile = true;
	}

	function handleProfileUpdated() {
		showEditProfile = false;
		window.location.reload();
	}

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

	function handleDeleteAccount() {
		showDeleteAccount = true;
	}

	// Handle events from modals
	function handleBranchAdded() {
		window.location.reload();
	}

	function handleProjectPosted() {
		window.location.reload();
	}

	function handleLeadAdded() {
		showAddLead = false;
		window.location.reload();
	}

	// Toggle mobile menu
	function toggleMobileMenu() {
		isMobileMenuOpen.toggle();
	}
</script>

<!-- Mobile Top Bar (hidden when sidebar sheet is open) -->
{#if !isMobileMenuOpen.isOpen}
	<div class="mobile-topbar bg-card border-b border-border">
		<button
			class="mobile-menu-toggle"
			onclick={toggleMobileMenu}
			aria-label="Toggle menu"
		>
			<span class="bg-accent"></span>
			<span class="bg-accent"></span>
			<span class="bg-accent"></span>
		</button>
		{#if businessEmail}
			<span class="mobile-topbar-email text-foreground-muted">{businessEmail}</span>
		{/if}
	</div>
{/if}

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
	onDeleteAccount={handleDeleteAccount}
/>

<!-- Main Content Area -->
<div class="layout-container {expanded ? 'sidebar-expanded' : 'sidebar-collapsed'}">
	<main class="min-h-screen bg-background text-foreground transition-colors duration-300">
		<div class="w-full max-w-5xl mx-auto px-4 py-6 md:px-6 md:py-8 max-[480px]:px-3">
			{#if business && setupProgress}
				<div class="mb-6">
					<SetupProgressCard
						{business}
						{businessSlug}
						projectsCount={setupProgress.projectsCount}
						claimedLeadsCount={setupProgress.claimedLeadsCount}
						onOpenEditProfile={openEditProfile}
					/>
					{#if claimGate}
						<ClaimGateCard
							{claimGate}
							{businessSlug}
							onOpenEditProfile={openEditProfile}
						/>
					{/if}
				</div>
			{/if}
			{@render children?.()}
		</div>
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
			<h2 class="text-lg font-semibold text-foreground">Add Lead</h2>
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

{#if showDeleteAccount}
	<ShowDeleteAccount
		bind:show={showDeleteAccount}
		onClose={() => (showDeleteAccount = false)}
	/>
{/if}

{#if showSupport}
	<ShowSupport bind:show={showSupport} onClose={() => (showSupport = false)} />
{/if}

{#if showRankingPolicy}
	<ShowRankingPolicy bind:show={showRankingPolicy} onClose={() => (showRankingPolicy = false)} />
{/if}

{#if showEditProfile && business}
	<ShowEditProfile
		bind:show={showEditProfile}
		businessInfo={business}
		{businessSlug}
		onClose={() => (showEditProfile = false)}
		onUpdated={handleProfileUpdated}
	/>
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
	/* Mobile Top Bar */
	.mobile-topbar {
		display: none;
		align-items: center;
		gap: 0.75rem;
		padding: 0.625rem 1rem;
	}

	.mobile-menu-toggle {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 24px;
		height: 18px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		flex-shrink: 0;
	}

	.mobile-menu-toggle span {
		display: block;
		height: 2.5px;
		width: 100%;
		border-radius: 2px;
	}

	.mobile-topbar-email {
		font-size: 0.75rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		min-width: 0;
	}

	@media (max-width: 767px) {
		.mobile-topbar {
			display: flex;
		}
	}

	/* Layout Container */
	.layout-container {
		margin-left: 250px;
		transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		min-height: 100vh;
		overflow-x: hidden; /* Prevents horizontal scroll without breaking fixed-position modals */
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
		background: color-mix(in oklch, var(--color-modal-backdrop) 50%, transparent);
		display: flex;
		justify-content: center;
		align-items: flex-start;
		z-index: var(--z-modal-backdrop);
		overflow-y: auto;
		padding: 20px 0;
		pointer-events: none;
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
		border: 1px solid var(--color-border);
		box-shadow: var(--shadow-lg);
		pointer-events: auto;
	}

	.close-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		z-index: var(--z-modal);
		transition: color 0.15s ease;
	}

	h2 {
		margin-top: 0;
		margin-bottom: 1rem;
	}
</style>
