<script lang="ts">
	import { page } from '$app/stores';
	import { isSidebarExpanded, isMobileMenuOpen } from '$lib/in/sidebarStore.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import NotificationsCard from '$lib/components/NotificationsCard.svelte';
	import ClaimGateCard from '$lib/components/ClaimGateCard.svelte';
	import ShowEditProfile from '$lib/components/ShowEditProfile.svelte';
	import ShowSupport from '$lib/components/ShowSupport.svelte';
	import ShowDeleteAccount from '$lib/components/ShowDeleteAccount.svelte';
	import ShowRankingPolicy from '$lib/components/ShowRankingPolicy.svelte';
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

	let businessEmail = $derived(business?.email || '');

	// Setup progress & claim gate from layout server
	let setupProgress = $derived(data.setupProgress);
	let claimGate = $derived(data.claimGate);

	// Notifications card is hidden on the paid services page
	let isPaidServicesPage = $derived($page.route.id?.endsWith('/paid-services') ?? false);

	// Edit profile modal (needed by NotificationsCard and ClaimGateCard)
	let showEditProfile = $state(false);

	function openEditProfile() {
		showEditProfile = true;
	}

	function handleProfileUpdated() {
		showEditProfile = false;
		window.location.reload();
	}

	// Sidebar action handlers
	function handlePolicy() {
		showRankingPolicy = true;
	}

	function handleSupport() {
		showSupport = true;
	}

	function handleDeleteAccount() {
		showDeleteAccount = true;
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
	businessName={business?.businessname || ''}
	{businessEmail}
	onPolicy={handlePolicy}
	onSupport={handleSupport}
	onDeleteAccount={handleDeleteAccount}
/>

<!-- Main Content Area -->
<div class="layout-container {expanded ? 'sidebar-expanded' : 'sidebar-collapsed'}">
	<main class="min-h-screen bg-background text-foreground transition-colors duration-300">
		<div class="w-full max-w-5xl mx-auto px-4 py-6 md:px-6 md:py-8 max-[480px]:px-3">
			{#if business && setupProgress}
				<div class="*:mb-6">
					{#if !isPaidServicesPage}
						<NotificationsCard
							{business}
							{businessSlug}
							projectsCount={setupProgress.projectsCount}
							claimedLeadsCount={setupProgress.claimedLeadsCount}
							notifications={[
								{
									id: 'service-plant-design',
									kind: 'service',
									title: 'Complete Solar Plant Design for ₹500',
									description: 'Get a professional design for up to 3 projects',
									action: `/${businessSlug}/paid-services`,
									actionLabel: 'View Offer',
									priority: 4
								}
							]}
							onOpenEditProfile={openEditProfile}
						/>
					{/if}
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
</style>
