<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/in/themeStore';
	import { isSidebarExpanded, isMobileMenuOpen } from '$lib/in/sidebarStore';
	import { createEventDispatcher } from 'svelte';

	export let businessSlug = '';
	export let businessName = '';
	export let businessEmail = '';

	const dispatch = createEventDispatcher();

	$: darkMode = $isDarkMode;
	$: currentPath = $page.url.pathname;
	$: expanded = $isSidebarExpanded;
	$: mobileOpen = $isMobileMenuOpen;

	// Navigation items configuration
	const navSections = [
		{
			title: 'Dashboard',
			items: [
				{
					label: 'Dashboard',
					icon: '📊',
					href: `/in/${businessSlug}`,
					type: 'link'
				}
			]
		},
		{
			title: 'LEADS & CRM',
			items: [
				{
					label: 'Add Lead',
					icon: '➕',
					action: 'addLead',
					type: 'modal'
				},
				{
					label: 'CRM',
					icon: '👥',
					href: `/in/${businessSlug}/crm`,
					type: 'link'
				},
				{
					label: 'Open Inquiries',
					icon: '📬',
					href: `/in/${businessSlug}/open-inquiries`,
					type: 'link'
				}
			]
		},
		{
			title: 'BRANCH MANAGEMENT',
			items: [
				{
					label: 'Manage Branches',
					icon: '🏪',
					href: `/in/${businessSlug}/branch`,
					type: 'link'
				},
				{
					label: 'Referrers',
					icon: '🤝',
					href: `/in/${businessSlug}/referral`,
					type: 'link'
				}
			]
		},
		{
			title: 'PROJECTS',
			items: [
				{
					label: 'Manage Recent Projects',
					icon: '📝',
					href: `/in/${businessSlug}/recent-projects`,
					type: 'link'
				},
				{
					label: 'Project Management',
					icon: '📋',
					href: `/in/${businessSlug}/project-management`,
					type: 'link'
				},
				{
					label: 'Proposals',
					icon: '📄',
					href: `/in/${businessSlug}/proposal`,
					type: 'link'
				}
			]
		},
		{
			title: 'SETTINGS',
			items: [
				{
					label: 'Policy',
					icon: '📜',
					action: 'policy',
					type: 'modal'
				},
				{
					label: 'Support',
					icon: '💬',
					action: 'support',
					type: 'modal'
				}
			]
		}
	];

	function handleItemClick(item) {
		if (item.type === 'modal') {
			dispatch(item.action);
			// Close mobile menu after action
			if (window.innerWidth < 768) {
				isMobileMenuOpen.set(false);
			}
		} else if (item.type === 'link' && window.innerWidth < 768) {
			// Close mobile menu after navigation
			isMobileMenuOpen.set(false);
		}
	}

	function handleLogout() {
		// This will be handled by the form in the template
		if (window.innerWidth < 768) {
			isMobileMenuOpen.set(false);
		}
	}

	function toggleSidebar() {
		isSidebarExpanded.toggle();
	}

	function closeMobileMenu() {
		isMobileMenuOpen.set(false);
	}

	function isActive(href) {
		if (!href) return false;
		return currentPath === href || currentPath.startsWith(href + '/');
	}
</script>

<!-- Mobile Backdrop -->
{#if mobileOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="mobile-backdrop" on:click={closeMobileMenu}></div>
{/if}

<!-- Sidebar -->
<aside class="sidebar {darkMode ? 'dark' : 'light'} {expanded ? 'expanded' : 'collapsed'} {mobileOpen ? 'mobile-open' : ''}">
	<!-- Brand Header -->
	<div class="sidebar-header">
		<div class="brand">
			<img src="/solar-vipani-logo.png" alt="Solar Vipani" class="brand-logo" />
			{#if expanded}
				<div class="business-info">
					<p class="business-name">{businessName || 'Business Portal'}</p>
					{#if businessEmail}
						<p class="business-email">{businessEmail}</p>
					{/if}
				</div>
			{/if}
		</div>
		<button class="toggle-btn desktop-only" on:click={toggleSidebar} aria-label="Toggle sidebar">
			<span class="toggle-icon">{expanded ? '◀' : '▶'}</span>
		</button>
		<button class="close-btn mobile-only" on:click={closeMobileMenu} aria-label="Close menu">
			✕
		</button>
	</div>

	<!-- Navigation -->
	<nav class="sidebar-nav">
		{#each navSections as section}
			<div class="nav-section">
				{#if expanded}
					<div class="section-title">{section.title}</div>
				{/if}
				<ul class="nav-items">
					{#each section.items as item}
						<li>
							{#if item.type === 'link'}
								<a
									href={item.href}
									class="nav-item {isActive(item.href) ? 'active' : ''}"
									title={expanded ? '' : item.label}
								>
									<span class="nav-icon">{item.icon}</span>
									{#if expanded}
										<span class="nav-label">{item.label}</span>
									{/if}
								</a>
							{:else if item.type === 'modal'}
								<button
									class="nav-item"
									on:click={() => handleItemClick(item)}
									title={expanded ? '' : item.label}
								>
									<span class="nav-icon">{item.icon}</span>
									{#if expanded}
										<span class="nav-label">{item.label}</span>
									{/if}
								</button>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</nav>

	<!-- Logout Button -->
	<div class="sidebar-footer">
		<form method="POST" action={`/in/${businessSlug}/logout`} on:submit={handleLogout}>
			<button type="submit" class="nav-item logout-btn" title={expanded ? '' : 'Logout'}>
				<span class="nav-icon">🚪</span>
				{#if expanded}
					<span class="nav-label">Logout</span>
				{/if}
			</button>
		</form>
	</div>
</aside>

<style>
	/* CSS Variables */
	:root {
		--sidebar-width-expanded: 250px;
		--sidebar-width-collapsed: 60px;
		--sidebar-transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Sidebar Container */
	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		width: var(--sidebar-width-expanded);
		display: flex;
		flex-direction: column;
		transition: width var(--sidebar-transition);
		z-index: 1000;
		overflow-x: hidden;
		overflow-y: auto;
		box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
	}

	.sidebar.collapsed {
		width: var(--sidebar-width-collapsed);
	}

	/* Light Mode */
	.sidebar.light {
		background-color: #ffffff;
		color: #333;
		border-right: 1px solid #e5e7eb;
	}

	/* Dark Mode */
	.sidebar.dark {
		background-color: #1a1a1a;
		color: #f0f0f0;
		border-right: 1px solid #333;
	}

	/* Mobile Backdrop */
	.mobile-backdrop {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 999;
	}

	@media (max-width: 767px) {
		.sidebar {
			width: 280px;
			transform: translateX(-100%);
			transition: transform var(--sidebar-transition);
		}

		.sidebar.mobile-open {
			transform: translateX(0);
		}

		.mobile-backdrop {
			display: block;
		}
	}

	/* Sidebar Header */
	.sidebar-header {
		padding: 1.25rem 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid;
		min-height: 70px;
	}

	.light .sidebar-header {
		border-bottom-color: #e5e7eb;
	}

	.dark .sidebar-header {
		border-bottom-color: #333;
	}

	.brand {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		overflow: hidden;
		flex: 1;
	}

	.brand-logo {
		height: 45px;
		width: auto;
		flex-shrink: 0;
		object-fit: contain;
	}

	.collapsed .brand-logo {
		height: 36px;
	}

	.business-info {
		width: 100%;
		text-align: center;
		padding: 0 0.5rem;
	}

	.business-name {
		margin: 0;
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
	}

	.business-email {
		margin: 0.25rem 0 0 0;
		font-size: 0.65rem;
		opacity: 0.7;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		font-weight: 400;
	}

	.collapsed .business-info {
		display: none;
	}

	/* Toggle Button */
	.toggle-btn,
	.close-btn {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 4px;
		transition: background-color 0.2s;
		flex-shrink: 0;
	}

	.light .toggle-btn:hover,
	.light .close-btn:hover {
		background-color: #f3f4f6;
	}

	.dark .toggle-btn:hover,
	.dark .close-btn:hover {
		background-color: #333;
	}

	.toggle-icon {
		font-size: 0.875rem;
	}

	.close-btn {
		font-size: 1.5rem;
		display: none;
	}

	.desktop-only {
		display: block;
	}

	.mobile-only {
		display: none;
	}

	@media (max-width: 767px) {
		.desktop-only {
			display: none;
		}
		.mobile-only {
			display: block;
		}
	}

	/* Navigation */
	.sidebar-nav {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 0.5rem 0;
	}

	.nav-section {
		margin-bottom: 1.5rem;
	}

	.section-title {
		padding: 0.5rem 1rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		opacity: 0.6;
	}

	.nav-items {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-items li {
		margin: 0;
	}

	/* Nav Item (both links and buttons) */
	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		margin: 0.125rem 0.5rem;
		border-radius: 6px;
		text-decoration: none;
		color: inherit;
		border: none;
		background: none;
		cursor: pointer;
		transition: background-color 0.2s;
		width: calc(100% - 1rem);
		text-align: left;
		font-size: 0.9375rem;
	}

	.collapsed .nav-item {
		justify-content: center;
		padding: 0.75rem;
	}

	.light .nav-item:hover {
		background-color: #f3f4f6;
	}

	.dark .nav-item:hover {
		background-color: #2a2a2a;
	}

	.light .nav-item.active {
		background-color: #dbeafe;
		color: #1e40af;
	}

	.dark .nav-item.active {
		background-color: #1e3a8a;
		color: #bfdbfe;
	}

	.nav-icon {
		font-size: 1.25rem;
		flex-shrink: 0;
		width: 1.5rem;
		text-align: center;
	}

	.nav-label {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.collapsed .nav-label {
		display: none;
	}

	/* Sidebar Footer */
	.sidebar-footer {
		padding: 1rem;
		border-top: 1px solid;
	}

	.light .sidebar-footer {
		border-top-color: #e5e7eb;
	}

	.dark .sidebar-footer {
		border-top-color: #333;
	}

	.sidebar-footer form {
		margin: 0;
	}

	.logout-btn {
		width: 100%;
		margin: 0;
	}

	.light .logout-btn:hover {
		background-color: #fee2e2;
		color: #b91c1c;
	}

	.dark .logout-btn:hover {
		background-color: #7f1d1d;
		color: #fecaca;
	}

	/* Scrollbar Styling */
	.sidebar::-webkit-scrollbar {
		width: 6px;
	}

	.sidebar.light::-webkit-scrollbar-track {
		background: #f9fafb;
	}

	.sidebar.dark::-webkit-scrollbar-track {
		background: #1a1a1a;
	}

	.sidebar.light::-webkit-scrollbar-thumb {
		background: #d1d5db;
		border-radius: 3px;
	}

	.sidebar.dark::-webkit-scrollbar-thumb {
		background: #4b5563;
		border-radius: 3px;
	}
</style>
