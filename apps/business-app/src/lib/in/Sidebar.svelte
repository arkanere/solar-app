<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/stores/theme.svelte.js';
	import { isSidebarExpanded, isMobileMenuOpen, expandedSections } from '$lib/in/sidebarStore';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	// Import Lucide icons
	import {
		LayoutDashboard,
		Users,
		UserPlus,
		Inbox,
		Building2,
		Handshake,
		FolderKanban,
		FileText,
		Settings,
		MessageCircle,
		ScrollText,
		LogOut,
		X
	} from '@lucide/svelte';

	let {
		businessSlug = '',
		businessName = '',
		businessEmail = '',
		onAddLead = () => {},
		onAddBranch = () => {},
		onPostProject = () => {},
		onPolicy = () => {},
		onSupport = () => {}
	} = $props();

	let darkMode = $derived($isDarkMode);
	let currentPath = $derived($page.url.pathname);
	let expanded = $derived($isSidebarExpanded);
	let mobileOpen = $derived($isMobileMenuOpen);
	let sections = $derived($expandedSections);

	// Navigation items configuration - 6 logical groups
	const navSections = [
		// Group 1: Dashboard (standalone)
		{
			type: 'standalone',
			label: 'Dashboard',
			icon: LayoutDashboard,
			href: `/in/${businessSlug}`,
			itemType: 'link'
		},

		// Group 2: Leads (collapsible)
		{
			type: 'collapsible',
			id: 'leads',
			title: 'Leads',
			icon: Users,
			items: [
				{
					label: 'Add Lead',
					icon: UserPlus,
					action: 'addLead',
					type: 'modal'
				},
				{
					label: 'CRM',
					icon: Users,
					href: `/in/${businessSlug}/crm`,
					type: 'link'
				},
				{
					label: 'Open Inquiries',
					icon: Inbox,
					href: `/in/${businessSlug}/open-inquiries`,
					type: 'link'
				}
			]
		},

		// Group 3: Branches (collapsible)
		{
			type: 'collapsible',
			id: 'branches',
			title: 'Branches',
			icon: Building2,
			items: [
				{
					label: 'Manage Branches',
					icon: Building2,
					href: `/in/${businessSlug}/branch`,
					type: 'link'
				},
				{
					label: 'Referrers',
					icon: Handshake,
					href: `/in/${businessSlug}/referral`,
					type: 'link'
				}
			]
		},

		// Group 4: Projects (collapsible)
		{
			type: 'collapsible',
			id: 'projects',
			title: 'Projects',
			icon: FolderKanban,
			items: [
				{
					label: 'Manage Recent Projects',
					icon: FileText,
					href: `/in/${businessSlug}/recent-projects`,
					type: 'link'
				},
				{
					label: 'Project Management',
					icon: FolderKanban,
					href: `/in/${businessSlug}/project-management`,
					type: 'link'
				}
			]
		},

		// Group 5: Proposals (standalone)
		{
			type: 'standalone',
			label: 'Proposals',
			icon: FileText,
			href: `/in/${businessSlug}/proposal`,
			itemType: 'link'
		},

		// Group 6: Settings (collapsible)
		{
			type: 'collapsible',
			id: 'settings',
			title: 'Settings',
			icon: Settings,
			items: [
				{
					label: 'Support',
					icon: MessageCircle,
					action: 'support',
					type: 'modal'
				},
				{
					label: 'Policy',
					icon: ScrollText,
					action: 'policy',
					type: 'modal'
				}
			]
		}
	];

	function handleItemClick(item) {
		if (item.type === 'modal') {
			// Call the appropriate callback based on action
			const callbacks = {
				addLead: onAddLead,
				addBranch: onAddBranch,
				postProject: onPostProject,
				policy: onPolicy,
				support: onSupport
			};
			callbacks[item.action]?.();
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

	function toggleSection(sectionId) {
		expandedSections.toggle(sectionId);
	}

	// Auto-expand sections containing active routes
	onMount(() => {
		navSections.forEach((section) => {
			if (section.type === 'collapsible') {
				const hasActiveItem = section.items.some((item) => item.href && isActive(item.href));
				if (hasActiveItem && !sections[section.id]) {
					expandedSections.toggle(section.id);
				}
			}
		});
	});
</script>

<!-- Mobile Backdrop -->
{#if mobileOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 bg-black/50 z-[calc(var(--z-sidebar)-1)] md:hidden"
		onclick={closeMobileMenu}
	></div>
{/if}

<!-- Sidebar -->
<aside class={cn(
	"fixed top-0 left-0 h-screen flex flex-col z-sidebar overflow-x-hidden overflow-y-auto transition-all duration-300 ease-out",
	"bg-card border-r border-border shadow-md",
	expanded ? "w-[250px]" : "w-[60px]",
	"max-md:w-[280px] max-md:-translate-x-full max-md:transition-transform",
	mobileOpen && "max-md:translate-x-0"
)}>
	<!-- Brand Header -->
	<div class="p-4 flex items-center justify-between border-b border-border min-h-[70px]">
		<div class="flex flex-col items-center gap-2 overflow-hidden flex-1">
			{#if expanded}
				<div class="w-full text-center px-2">
					<p class="m-0 text-xs font-semibold truncate w-full">{businessName || 'Business Portal'}</p>
					{#if businessEmail}
						<p class="mt-1 mb-0 text-[0.65rem] opacity-70 truncate w-full font-normal">{businessEmail}</p>
					{/if}
				</div>
			{/if}
		</div>
		<Button
			variant="ghost"
			size="icon-sm"
			class="hidden md:flex shrink-0"
			onclick={toggleSidebar}
			aria-label="Toggle sidebar"
		>
			<span class="text-sm">{expanded ? '◀' : '▶'}</span>
		</Button>
		<Button
			variant="ghost"
			size="icon"
			class="flex md:hidden"
			onclick={closeMobileMenu}
			aria-label="Close menu"
		>
			<X size={24} strokeWidth={2} />
		</Button>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 overflow-y-auto overflow-x-hidden py-2">
		{#each navSections as section}
			{#if section.type === 'standalone'}
				<!-- Standalone Items (Dashboard, Proposals) -->
				<div class="mb-1">
					<ul class="list-none m-0 p-0">
						<li>
							{#if section.itemType === 'link'}
								<a
									href={section.href}
									class={cn(
										"flex items-center gap-3 py-3 px-4 mx-2 rounded-md no-underline transition-colors",
										"text-foreground hover:bg-muted",
										!expanded && "justify-center px-3",
										isActive(section.href) && "bg-accent/10 text-accent dark:bg-accent/20"
									)}
									title={expanded ? '' : section.label}
								>
									<svelte:component this={section.icon} class="shrink-0" size={20} strokeWidth={2} />
									{#if expanded}
										<span class="truncate">{section.label}</span>
									{/if}
								</a>
							{:else if section.itemType === 'modal'}
								<button
									class={cn(
										"flex items-center gap-3 py-3 px-4 mx-2 rounded-md transition-colors w-[calc(100%-1rem)] text-left",
										"text-foreground bg-transparent border-none cursor-pointer hover:bg-muted",
										!expanded && "justify-center px-3"
									)}
									onclick={() => handleItemClick(section)}
									title={expanded ? '' : section.label}
								>
									<svelte:component this={section.icon} class="shrink-0" size={20} strokeWidth={2} />
									{#if expanded}
										<span class="truncate">{section.label}</span>
									{/if}
								</button>
							{/if}
						</li>
					</ul>
				</div>
			{:else if section.type === 'collapsible'}
				<!-- Collapsible Groups (Leads, Branches, Projects, Settings) -->
				<div class="mb-1">
					<button
						class={cn(
							"flex items-center gap-3 py-3 px-4 mx-2 rounded-md transition-colors w-[calc(100%-1rem)] text-left",
							"text-foreground/80 bg-transparent border-none cursor-pointer hover:bg-muted text-sm font-medium",
							!expanded && "justify-center px-3",
							"disabled:cursor-default"
						)}
						onclick={() => toggleSection(section.id)}
						disabled={!expanded}
						aria-expanded={sections[section.id] ? 'true' : 'false'}
						title={expanded ? '' : section.title}
					>
						<svelte:component this={section.icon} class="shrink-0" size={20} strokeWidth={2} />
						{#if expanded}
							<span class="truncate">{section.title}</span>
							<span class={cn(
								"ml-auto text-[0.625rem] transition-transform duration-200",
								sections[section.id] ? "rotate-0" : "-rotate-90"
							)}>▼</span>
						{/if}
					</button>

					{#if expanded && sections[section.id]}
						<div class="overflow-hidden" transition:slide={{ duration: 200 }}>
							<ul class="list-none m-0 p-0">
								{#each section.items as item}
									<li>
										{#if item.type === 'link'}
											<a
												href={item.href}
												class={cn(
													"flex items-center gap-3 py-3 pr-4 pl-10 mx-2 rounded-md no-underline transition-colors text-sm opacity-90",
													"text-foreground hover:bg-muted",
													isActive(item.href) && "bg-accent/10 text-accent dark:bg-accent/20"
												)}
												title={item.label}
											>
												<svelte:component this={item.icon} class="shrink-0" size={18} strokeWidth={2} />
												<span class="truncate">{item.label}</span>
											</a>
										{:else if item.type === 'modal'}
											<button
												class={cn(
													"flex items-center gap-3 py-3 pr-4 pl-10 mx-2 rounded-md transition-colors w-[calc(100%-1rem)] text-left text-sm opacity-90",
													"text-foreground bg-transparent border-none cursor-pointer hover:bg-muted"
												)}
												onclick={() => handleItemClick(item)}
												title={item.label}
											>
												<svelte:component this={item.icon} class="shrink-0" size={18} strokeWidth={2} />
												<span class="truncate">{item.label}</span>
											</button>
										{/if}
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			{/if}
		{/each}
	</nav>

	<!-- Logout Button -->
	<div class="p-4 border-t border-border">
		<form method="POST" action={`/in/${businessSlug}/logout`} onsubmit={handleLogout} class="m-0">
			<button
				type="submit"
				class={cn(
					"flex items-center gap-3 py-3 px-4 rounded-md transition-colors w-full text-left",
					"text-foreground bg-transparent border-none cursor-pointer",
					"hover:bg-destructive-muted hover:text-destructive",
					!expanded && "justify-center px-3"
				)}
				title={expanded ? '' : 'Logout'}
			>
				<LogOut class="shrink-0" size={20} strokeWidth={2} />
				{#if expanded}
					<span class="truncate">Logout</span>
				{/if}
			</button>
		</form>
	</div>
</aside>

<style>
	/* Minimal custom scrollbar styling - Tailwind doesn't have built-in scrollbar utilities */
	aside::-webkit-scrollbar {
		width: 6px;
	}
	aside::-webkit-scrollbar-track {
		background: transparent;
	}
	aside::-webkit-scrollbar-thumb {
		background: var(--color-border);
		border-radius: 3px;
	}
	aside::-webkit-scrollbar-thumb:hover {
		background: var(--color-border-hover);
	}
</style>
