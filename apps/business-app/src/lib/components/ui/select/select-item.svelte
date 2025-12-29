<script lang="ts" module>
	import type { Select as SelectPrimitive } from 'bits-ui';

	export type SelectItemProps = SelectPrimitive.ItemProps;
</script>

<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';
	import { Check } from '@lucide/svelte';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: SelectItemProps = $props();
</script>

<SelectPrimitive.Item
	bind:ref
	data-slot="select-item"
	class={cn(
		'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
		'focus:bg-accent focus:text-accent-foreground',
		'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		className
	)}
	{...restProps}
>
	<span class="absolute left-2 flex size-3.5 items-center justify-center">
		<SelectPrimitive.ItemIndicator>
			<Check class="size-4" />
		</SelectPrimitive.ItemIndicator>
	</span>
	{@render children?.()}
</SelectPrimitive.Item>
