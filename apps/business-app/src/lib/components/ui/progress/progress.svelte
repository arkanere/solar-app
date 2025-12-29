<script lang="ts" module>
	import type { Progress as ProgressPrimitive } from 'bits-ui';
	import { tv, type VariantProps } from 'tailwind-variants';

	const progressVariants = tv({
		base: 'relative w-full overflow-hidden rounded-full bg-primary/20',
		variants: {
			size: {
				sm: 'h-1',
				md: 'h-2',
				lg: 'h-3',
				xl: 'h-4'
			}
		},
		defaultVariants: {
			size: 'md'
		}
	});

	const indicatorVariants = tv({
		base: 'h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out',
		variants: {
			variant: {
				default: 'bg-primary',
				success: 'bg-success',
				warning: 'bg-warning',
				destructive: 'bg-destructive',
				accent: 'bg-accent'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	export type ProgressProps = ProgressPrimitive.RootProps &
		VariantProps<typeof progressVariants> &
		VariantProps<typeof indicatorVariants>;
	export { progressVariants, indicatorVariants };
</script>

<script lang="ts">
	import { Progress as ProgressPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		value = 0,
		max = 100,
		size = 'md',
		variant = 'default',
		...restProps
	}: ProgressProps = $props();

	const percentage = $derived(value != null ? (value / max) * 100 : 0);
</script>

<ProgressPrimitive.Root
	bind:ref
	data-slot="progress"
	class={cn(progressVariants({ size }), className)}
	{value}
	{max}
	{...restProps}
>
	<div
		data-slot="progress-indicator"
		class={cn(indicatorVariants({ variant }))}
		style="transform: translateX(-{100 - percentage}%)"
	></div>
</ProgressPrimitive.Root>
