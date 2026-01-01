<script lang="ts">
	import { cn } from '$lib/utils';

	type Priority = 'high' | 'medium' | 'low';

	let {
		priority,
		class: className = ''
	}: {
		priority: Priority;
		class?: string;
	} = $props();

	const priorityConfig: Record<Priority, { label: string; colorClass: string }> = {
		high: {
			label: 'High',
			colorClass: 'bg-priority-high text-white'
		},
		medium: {
			label: 'Medium',
			colorClass: 'bg-priority-medium text-white'
		},
		low: {
			label: 'Low',
			colorClass: 'bg-priority-low text-white'
		}
	};

	let config = $derived(priorityConfig[priority]);
</script>

<span
	class={cn(
		'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold',
		config.colorClass,
		className
	)}
	data-slot="priority-badge"
>
	{config.label}
</span>
