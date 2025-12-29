<script lang="ts" module>
	import type { Select as SelectPrimitive } from 'bits-ui';
	import { tv, type VariantProps } from 'tailwind-variants';

	const selectTriggerVariants = tv({
		base: [
			'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm',
			'placeholder:text-muted-foreground',
			'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
			'disabled:cursor-not-allowed disabled:opacity-50',
			'[&>span]:line-clamp-1'
		],
		variants: {
			size: {
				sm: 'h-8 text-xs px-2',
				md: 'h-9 text-sm px-3',
				lg: 'h-10 text-base px-4'
			}
		},
		defaultVariants: {
			size: 'md'
		}
	});

	export type SelectTriggerProps = SelectPrimitive.TriggerProps &
		VariantProps<typeof selectTriggerVariants>;
	export { selectTriggerVariants };
</script>

<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';
	import { ChevronDown } from '@lucide/svelte';

	let {
		ref = $bindable(null),
		class: className,
		size = 'md',
		children,
		...restProps
	}: SelectTriggerProps = $props();
</script>

<SelectPrimitive.Trigger
	bind:ref
	data-slot="select-trigger"
	class={cn(selectTriggerVariants({ size }), className)}
	{...restProps}
>
	{@render children?.()}
	<ChevronDown class="size-4 opacity-50" />
</SelectPrimitive.Trigger>
