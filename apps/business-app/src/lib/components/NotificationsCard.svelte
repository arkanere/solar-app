<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';
	import { Bell, ChevronDown } from '@lucide/svelte';

	type NotificationKind = 'task' | 'service';

	export type Notification = {
		id: string;
		kind: NotificationKind;
		title: string;
		description?: string;
		action: string | null;
		actionLabel: string;
		priority: number;
	};

	const kindLabels: Record<NotificationKind, string> = {
		task: 'Pending task',
		service: 'New service'
	};

	export type NotificationsCardProps = {
		business?: { phonenumber?: string; email?: string; description?: string; website?: string; google_maps_link?: string; brands?: number[] };
		businessSlug?: string;
		projectsCount?: number;
		claimedLeadsCount?: number;
		notifications?: Notification[];
		onOpenEditProfile?: () => void;
	};

	let {
		business = {},
		businessSlug = '',
		projectsCount = 0,
		claimedLeadsCount = 0,
		notifications = [],
		onOpenEditProfile = () => {}
	}: NotificationsCardProps = $props();

	let isExpanded = $state(true);

	function toggleExpanded() {
		isExpanded = !isExpanded;
	}

	let tasks = $derived([
		{
			id: 'add-contact',
			title: 'Add Phone & Email',
			description: 'Required to claim leads — customers use these to contact you',
			completed: !!business.phonenumber?.trim() && !!business.email?.trim(),
			action: 'openEditProfile',
			actionLabel: 'Add Contact',
			priority: 10
		},
		{
			id: 'add-brands',
			title: 'Add Brands You Work With',
			description: 'Let customers know which solar panel brands you install',
			completed: Array.isArray(business.brands) && business.brands.length > 0,
			action: 'openEditProfile',
			actionLabel: 'Add Brands',
			priority: 9
		},
		{
			id: 'add-maps-link',
			title: 'Add Google Maps Link',
			description: 'Help customers find your business location',
			completed: !!business.google_maps_link,
			action: 'openEditProfile',
			actionLabel: 'Add Maps Link',
			priority: 8
		},
		{
			id: 'add-description',
			title: 'Add Business Description',
			description: 'Tell customers what makes your business stand out',
			completed: !!business.description,
			action: 'openEditProfile',
			actionLabel: 'Add Description',
			priority: 7
		},
		{
			id: 'claim-lead',
			title: 'Claim Your First Lead',
			description: '',
			completed: claimedLeadsCount > 0,
			action: `/${businessSlug}/crm`,
			actionLabel: 'Go to CRM',
			priority: 6
		},
		{
			id: 'post-project',
			title: 'Post Your First Project',
			description: 'Showcase your work to attract customers',
			completed: projectsCount > 0,
			action: `/${businessSlug}/recent-projects`,
			actionLabel: 'Add Project',
			priority: 5
		}
	]);

	let taskNotifications = $derived<Notification[]>(
		tasks
			.filter((t) => !t.completed)
			.map(({ completed, ...t }) => ({ ...t, kind: 'task' }))
	);

	let allNotifications = $derived(
		[...taskNotifications, ...notifications].sort((a, b) => b.priority - a.priority)
	);

	function handleAction(notification: Notification) {
		if (!notification.action) return;

		if (notification.action === 'openEditProfile') {
			onOpenEditProfile();
		} else {
			window.location.href = notification.action;
		}
	}
</script>

{#if allNotifications.length > 0}
	<div class="rounded-lg border">
		<button
			type="button"
			class="flex w-full items-center gap-3 px-4 py-3 text-left"
			onclick={toggleExpanded}
			aria-expanded={isExpanded}
		>
			<Bell class="shrink-0 text-warning" size={18} strokeWidth={2} />
			<span class="flex-1 text-sm font-medium text-foreground">
				Notifications
				<span class="ml-1 text-muted-foreground">· {allNotifications.length}</span>
			</span>
			<ChevronDown
				size={16}
				class={cn(
					'shrink-0 text-muted-foreground transition-transform duration-200',
					isExpanded && 'rotate-180'
				)}
			/>
		</button>

		{#if isExpanded}
			<ul class="list-none p-0 m-0 border-t divide-y">
				{#each allNotifications as notification (notification.id)}
					<li
						class="flex justify-between items-center gap-4 px-4 py-3 max-sm:flex-col max-sm:items-stretch"
					>
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<Badge variant={notification.kind === 'service' ? 'default' : 'secondary'}>
									{kindLabels[notification.kind]}
								</Badge>
								<p class="m-0 text-sm font-medium text-foreground">{notification.title}</p>
							</div>
							{#if notification.description}
								<p class="m-0 mt-1 text-sm text-muted-foreground">{notification.description}</p>
							{/if}
						</div>
						{#if notification.action}
							<Button
								size="sm"
								variant="outline"
								class="shrink-0 max-sm:w-full"
								onclick={() => handleAction(notification)}
							>
								{notification.actionLabel}
							</Button>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
{/if}
