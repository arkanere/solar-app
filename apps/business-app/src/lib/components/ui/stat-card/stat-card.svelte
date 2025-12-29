<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	export type StatCardVariant = 'default' | 'success';

	export type StatCardProps = HTMLAttributes<HTMLDivElement> & {
		label: string;
		value: string | number;
		variant?: StatCardVariant;
	};
</script>

<script lang="ts">
	let {
		label,
		value,
		variant = 'default',
		class: className,
		...restProps
	}: StatCardProps = $props();

	const valueClasses = {
		default: 'text-accent',
		success: 'text-success'
	};
</script>

<div
	data-slot="stat-card"
	class={cn(
		'bg-card p-6 rounded-lg border border-border shadow-card flex-1 min-w-[150px] flex flex-col items-center md:min-w-full',
		className
	)}
	{...restProps}
>
	<span class="text-sm text-foreground-muted mb-2">{label}</span>
	<span class={cn('text-3xl font-bold', valueClasses[variant])}>{value}</span>
</div>
