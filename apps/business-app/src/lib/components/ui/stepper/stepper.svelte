<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type StepperProps = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		currentStep?: number;
		orientation?: 'horizontal' | 'vertical';
		ref?: HTMLDivElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { setContext } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		currentStep = 0,
		orientation = 'horizontal',
		children,
		...restProps
	}: StepperProps = $props();

	setContext('stepper', {
		get currentStep() {
			return currentStep;
		},
		get orientation() {
			return orientation;
		}
	});
</script>

<div
	bind:this={ref}
	data-slot="stepper"
	data-orientation={orientation}
	class={cn(
		'flex gap-2',
		orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
		className
	)}
	role="list"
	aria-label="Progress steps"
	{...restProps}
>
	{@render children?.()}
</div>
