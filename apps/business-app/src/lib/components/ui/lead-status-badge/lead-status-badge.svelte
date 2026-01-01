<script lang="ts">
	import { cn } from '$lib/utils';
	import { type LeadCategory, getCategoryLabel } from '$lib/constants/lead';

	let {
		category,
		class: className = ''
	}: {
		category: LeadCategory | null;
		class?: string;
	} = $props();

	// Normalize null to 3 (Exclusive) for styling
	let normalizedCategory = $derived(category ?? 3);
	let label = $derived(getCategoryLabel(category));
</script>

<span
	class={cn(
		'inline-flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-md whitespace-nowrap',
		normalizedCategory === 1 && 'bg-lead-available-muted text-lead-available border border-lead-available/30',
		normalizedCategory === 2 && 'bg-lead-claimed-muted text-lead-claimed border border-lead-claimed/30',
		normalizedCategory === 3 && 'bg-lead-exclusive-muted text-lead-exclusive border border-lead-exclusive/30',
		className
	)}
	data-slot="lead-status-badge"
>
	<span
		class={cn(
			'w-1.5 h-1.5 rounded-full',
			normalizedCategory === 1 && 'bg-lead-available',
			normalizedCategory === 2 && 'bg-lead-claimed',
			normalizedCategory === 3 && 'bg-lead-exclusive'
		)}
	></span>
	{label}
</span>
