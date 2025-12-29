<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';

	export type StepperSeparatorProps = HTMLAttributes<HTMLDivElement> & {
		completed?: boolean;
		ref?: HTMLDivElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { getContext } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		completed = false,
		...restProps
	}: StepperSeparatorProps = $props();

	const context = getContext<{ orientation: 'horizontal' | 'vertical' }>('stepper');
	const isHorizontal = $derived(context?.orientation === 'horizontal');
</script>

<div
	bind:this={ref}
	data-slot="stepper-separator"
	class={cn(
		'transition-colors',
		isHorizontal ? 'h-0.5 flex-1' : 'ml-4 h-8 w-0.5',
		completed ? 'bg-primary' : 'bg-muted',
		className
	)}
	role="presentation"
	{...restProps}
></div>
