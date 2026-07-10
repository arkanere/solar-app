<script lang="ts">
	import { page } from '$app/stores';
	import { isSidebarExpanded, isMobileMenuOpen, expandedSections } from '$lib/in/sidebarStore.svelte';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Separator } from '$lib/components/ui/separator';
	import { cn } from '$lib/utils';
	import {
		LayoutDashboard,
		Users,
		UserPlus,
		Building2,
		Settings,
		MessageCircle,
		Trash2,
		LogOut,
		X,
		ChevronDown
	} from '@lucide/svelte';

	export type SidebarProps = {
		businessSlug?: string;
		businessName?: string;
		businessEmail?: string;
		onAddLead?: () => void;
		onAddBranch?: () => void;
		onSupport?: () => void;
		onDeleteAccount?: () => void;
	};

	let {
		businessSlug = '',
		businessName = '',
		businessEmail = '',
		onAddLead = () => {},
		onAddBranch = () => {},
		onSupport = () => {},
		onDeleteAccount = () => {}
	}: SidebarProps = $props();

	let currentPath = $derived($page.url.pathname);
	let expanded = $derived(isSidebarExpanded.isExpanded);
	let mobileOpen = $derived(isMobileMenuOpen.isOpen);
	let sections = $derived(expandedSections.sections);

	type NavIcon = typeof Users;
	type NavAction = 'addLead' | 'addBranch' | 'support' | 'deleteAccount';

	type NavItem = {
		label: string;
		icon: NavIcon;
		type: 'link' | 'modal';
		href?: string;
		action?: NavAction;
	};

	type NavSection =
		| {
				type: 'standalone';
				label: string;
				icon: NavIcon;
				itemType: 'link' | 'modal';
				href?: string;
				action?: NavAction;
		  }
		| {
				type: 'collapsible';
				id: string;
				title: string;
				icon: NavIcon;
				items: NavItem[];
		  };

	let navSections: NavSection[] = $derived([
		{
			type: 'standalone',
			label: 'Dashboard',
			icon: LayoutDashboard,
			href: `/us/${businessSlug}`,
			itemType: 'link'
		},
		{
			type: 'collapsible',
			id: 'leads',
			title: 'Leads',
			icon: Users,
			items: [
				{ label: 'Add Lead', icon: UserPlus, action: 'addLead', type: 'modal' },
				{ label: 'CRM', icon: Users, href: `/us/${businessSlug}/crm`, type: 'link' }
			]
		},
		{
			type: 'collapsible',
			id: 'branches',
			title: 'Branches',
			icon: Building2,
			items: [
				{ label: 'Add Branch', icon: UserPlus, action: 'addBranch', type: 'modal' },
				{ label: 'Manage Branches', icon: Building2, href: `/us/${businessSlug}/branch`, type: 'link' }
			]
		},
		{
			type: 'collapsible',
			id: 'settings',
			title: 'Settings',
			icon: Settings,
			items: [
				{ label: 'Support', icon: MessageCircle, action: 'support', type: 'modal' },
				{ label: 'Delete Account', icon: Trash2, action: 'deleteAccount', type: 'modal' }
			]
		}
	]);

	function handleItemClick(item: { action?: NavAction }) {
		const callbacks = { addLead: onAddLead, addBranch: onAddBranch, support: onSupport, deleteAccount: onDeleteAccount };
		if (item.action) callbacks[item.action]?.();
		if (window.innerWidth < 768) isMobileMenuOpen.set(false);
	}

	function handleLogout() {
		if (window.innerWidth < 768) isMobileMenuOpen.set(false);
	}

	function toggleSidebar() {
		isSidebarExpanded.toggle();
	}

	function isActive(href?: string) {
		if (!href) return false;
		return currentPath === href || currentPath.startsWith(href + '/');
	}

	function toggleSection(sectionId: string) {
		expandedSections.toggle(sectionId);
	}

	onMount(() => {
		navSections.forEach((section) => {
			if (section.type === 'collapsible') {
				const hasActiveItem = section.items.some((item) => item.href && isActive(item.href));
				if (hasActiveItem && !sections[section.id]) expandedSections.toggle(section.id);
			}
		});
	});

	afterNavigate(() => {
		isMobileMenuOpen.set(false);
	});
</script>

<!-- Mobile Sheet -->
<Sheet.Root open={mobileOpen} onOpenChange={(open) => isMobileMenuOpen.set(open)}>
	<Sheet.Content side="left" class="w-[280px] !h-auto p-0" style="top: 0; bottom: 0;">
		<!-- Hide the default close button from sheet-content.svelte; Sidebar has its own -->
		<style>
			[data-slot="sheet-content"] > button:last-child { display: none; }
		</style>
		<div class="h-full flex flex-col bg-card overflow-hidden">
			<!-- Brand Header -->
			<div class="p-4 flex items-center justify-between min-h-[70px]">
				<div class="flex flex-col items-center gap-2 overflow-hidden flex-1">
					<div class="w-full text-center px-2">
						<p class="m-0 text-xs font-semibold truncate w-full">
							{businessName || 'Business Portal'}
						</p>
						{#if businessEmail}
							<p class="mt-1 mb-0 text-[0.65rem] opacity-70 truncate w-full font-normal">
								{businessEmail}
							</p>
						{/if}
					</div>
				</div>
				<Sheet.Close aria-label="Close menu" class="rounded-md p-2 opacity-70 hover:opacity-100 transition-opacity">
					<X size={24} strokeWidth={2} />
				</Sheet.Close>
			</div>

			<Separator />

			<!-- Navigation -->
			<nav class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-2">
				{#each navSections as section}
					{#if section.type === 'standalone'}
						<div class="mb-1">
							<ul class="list-none m-0 p-0">
								<li>
									{#if section.itemType === 'link'}
										<a
											href={section.href}
											class={cn(
												'flex items-center gap-3 py-3 px-4 mx-2 rounded-md no-underline transition-colors',
												'text-foreground hover:bg-muted',
												isActive(section.href) && 'bg-accent/10 text-accent dark:bg-accent/20'
											)}
										>
											<section.icon class="shrink-0" size={20} strokeWidth={2} />
											<span class="truncate">{section.label}</span>
										</a>
									{:else if section.itemType === 'modal'}
										<button
											class={cn(
												'flex items-center gap-3 py-3 px-4 mx-2 rounded-md transition-colors w-[calc(100%-1rem)] text-left',
												'text-foreground bg-transparent border-none cursor-pointer hover:bg-muted'
											)}
											onclick={() => handleItemClick(section)}
										>
											<section.icon class="shrink-0" size={20} strokeWidth={2} />
											<span class="truncate">{section.label}</span>
										</button>
									{/if}
								</li>
							</ul>
						</div>
					{:else if section.type === 'collapsible'}
						<div class="mb-1">
							<Collapsible.Root open={sections[section.id]} onOpenChange={() => toggleSection(section.id)}>
								<Collapsible.Trigger
									class={cn(
										'flex items-center gap-3 py-3 px-4 mx-2 rounded-md transition-colors w-[calc(100%-1rem)] text-left',
										'text-foreground/80 bg-transparent border-none cursor-pointer hover:bg-muted text-sm font-medium'
									)}
								>
									<section.icon class="shrink-0" size={20} strokeWidth={2} />
									<span class="truncate">{section.title}</span>
									<ChevronDown
										class={cn(
											'ml-auto h-4 w-4 transition-transform duration-200',
											sections[section.id] ? 'rotate-0' : '-rotate-90'
										)}
									/>
								</Collapsible.Trigger>

								<Collapsible.Content class="overflow-hidden">
									<ul class="list-none m-0 p-0">
										{#each section.items as item}
											<li>
												{#if item.type === 'link'}
													<a
														href={item.href}
														class={cn(
															'flex items-center gap-3 py-3 pr-4 pl-10 mx-2 rounded-md no-underline transition-colors text-sm opacity-90',
															'text-foreground hover:bg-muted',
															isActive(item.href) && 'bg-accent/10 text-accent dark:bg-accent/20'
														)}
													>
														<item.icon class="shrink-0" size={18} strokeWidth={2} />
														<span class="truncate">{item.label}</span>
													</a>
												{:else if item.type === 'modal'}
													<button
														class={cn(
															'flex items-center gap-3 py-3 pr-4 pl-10 mx-2 rounded-md transition-colors w-[calc(100%-1rem)] text-left text-sm opacity-90',
															'text-foreground bg-transparent border-none cursor-pointer hover:bg-muted'
														)}
														onclick={() => handleItemClick(item)}
													>
														<item.icon class="shrink-0" size={18} strokeWidth={2} />
														<span class="truncate">{item.label}</span>
													</button>
												{/if}
											</li>
										{/each}
									</ul>
								</Collapsible.Content>
							</Collapsible.Root>
						</div>
					{/if}
				{/each}
			</nav>

			<Separator />

			<!-- Logout -->
			<div class="shrink-0 p-4">
				<form method="POST" action={`/us/${businessSlug}/logout`} onsubmit={handleLogout} class="m-0">
					<button
						type="submit"
						class={cn(
							'flex items-center gap-3 py-3 px-4 rounded-md transition-colors w-full text-left',
							'text-foreground bg-transparent border-none cursor-pointer hover:bg-destructive-muted hover:text-destructive'
						)}
					>
						<LogOut class="shrink-0" size={20} strokeWidth={2} />
						<span class="truncate">Logout</span>
					</button>
				</form>
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>

<!-- Desktop Sidebar -->
<aside
	class={cn(
		'fixed left-0 flex flex-col z-sidebar overflow-x-hidden overflow-y-auto transition-all duration-300 ease-out',
		'bg-card border-r border-border shadow-md hidden md:flex',
		expanded ? 'w-[250px]' : 'w-[60px]'
	)}
	style="top: 0; height: 100vh;"
>
	<!-- Brand Header -->
	<div class="p-4 flex items-center justify-between min-h-[70px]">
		<div class="flex flex-col items-center gap-2 overflow-hidden flex-1">
			{#if expanded}
				<div class="w-full text-center px-2">
					<p class="m-0 text-xs font-semibold truncate w-full">
						{businessName || 'Business Portal'}
					</p>
					{#if businessEmail}
						<p class="mt-1 mb-0 text-[0.65rem] opacity-70 truncate w-full font-normal">
							{businessEmail}
						</p>
					{/if}
				</div>
			{/if}
		</div>
		<Button
			variant="ghost"
			size="icon-sm"
			class="shrink-0"
			onclick={toggleSidebar}
			aria-label="Toggle sidebar"
		>
			<span class="text-sm">{expanded ? '◀' : '▶'}</span>
		</Button>
	</div>

	<Separator />

	<!-- Navigation -->
	<nav class="flex-1 overflow-y-auto overflow-x-hidden py-2">
		{#each navSections as section}
			{#if section.type === 'standalone'}
				<div class="mb-1">
					<ul class="list-none m-0 p-0">
						<li>
							{#if section.itemType === 'link'}
								<a
									href={section.href}
									class={cn(
										'flex items-center gap-3 py-3 px-4 mx-2 rounded-md no-underline transition-colors',
										'text-foreground hover:bg-muted',
										!expanded && 'justify-center px-3',
										isActive(section.href) && 'bg-accent/10 text-accent dark:bg-accent/20'
									)}
									title={expanded ? '' : section.label}
								>
									<section.icon class="shrink-0" size={20} strokeWidth={2} />
									{#if expanded}
										<span class="truncate">{section.label}</span>
									{/if}
								</a>
							{:else if section.itemType === 'modal'}
								<button
									class={cn(
										'flex items-center gap-3 py-3 px-4 mx-2 rounded-md transition-colors w-[calc(100%-1rem)] text-left',
										'text-foreground bg-transparent border-none cursor-pointer hover:bg-muted',
										!expanded && 'justify-center px-3'
									)}
									onclick={() => handleItemClick(section)}
									title={expanded ? '' : section.label}
								>
									<section.icon class="shrink-0" size={20} strokeWidth={2} />
									{#if expanded}
										<span class="truncate">{section.label}</span>
									{/if}
								</button>
							{/if}
						</li>
					</ul>
				</div>
			{:else if section.type === 'collapsible'}
				<div class="mb-1">
					<Collapsible.Root open={expanded && sections[section.id]} onOpenChange={() => toggleSection(section.id)}>
						<Collapsible.Trigger
							class={cn(
								'flex items-center gap-3 py-3 px-4 mx-2 rounded-md transition-colors w-[calc(100%-1rem)] text-left',
								'text-foreground/80 bg-transparent border-none cursor-pointer hover:bg-muted text-sm font-medium',
								!expanded && 'justify-center px-3'
							)}
							disabled={!expanded}
							title={expanded ? '' : section.title}
						>
							<section.icon class="shrink-0" size={20} strokeWidth={2} />
							{#if expanded}
								<span class="truncate">{section.title}</span>
								<ChevronDown
									class={cn(
										'ml-auto h-4 w-4 transition-transform duration-200',
										sections[section.id] ? 'rotate-0' : '-rotate-90'
									)}
								/>
							{/if}
						</Collapsible.Trigger>

						<Collapsible.Content class="overflow-hidden">
							<ul class="list-none m-0 p-0">
								{#each section.items as item}
									<li>
										{#if item.type === 'link'}
											<a
												href={item.href}
												class={cn(
													'flex items-center gap-3 py-3 pr-4 pl-10 mx-2 rounded-md no-underline transition-colors text-sm opacity-90',
													'text-foreground hover:bg-muted',
													isActive(item.href) && 'bg-accent/10 text-accent dark:bg-accent/20'
												)}
												title={item.label}
											>
												<item.icon class="shrink-0" size={18} strokeWidth={2} />
												<span class="truncate">{item.label}</span>
											</a>
										{:else if item.type === 'modal'}
											<button
												class={cn(
													'flex items-center gap-3 py-3 pr-4 pl-10 mx-2 rounded-md transition-colors w-[calc(100%-1rem)] text-left text-sm opacity-90',
													'text-foreground bg-transparent border-none cursor-pointer hover:bg-muted'
												)}
												onclick={() => handleItemClick(item)}
												title={item.label}
											>
												<item.icon class="shrink-0" size={18} strokeWidth={2} />
												<span class="truncate">{item.label}</span>
											</button>
										{/if}
									</li>
								{/each}
							</ul>
						</Collapsible.Content>
					</Collapsible.Root>
				</div>
			{/if}
		{/each}
	</nav>

	<Separator />

	<!-- Logout -->
	<div class="p-4">
		<form method="POST" action={`/us/${businessSlug}/logout`} onsubmit={handleLogout} class="m-0">
			<button
				type="submit"
				class={cn(
					'flex items-center gap-3 py-3 px-4 rounded-md transition-colors w-full text-left',
					'text-foreground bg-transparent border-none cursor-pointer hover:bg-destructive-muted hover:text-destructive',
					!expanded && 'justify-center px-3'
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
