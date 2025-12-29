<script lang="ts" module>
	import type { Combobox as ComboboxPrimitive } from 'bits-ui';

	export type ComboboxItemProps = ComboboxPrimitive.ItemProps;
</script>

<script lang="ts">
	import { Combobox as ComboboxPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';
	import { Check } from '@lucide/svelte';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComboboxItemProps = $props();
</script>

<ComboboxPrimitive.Item
	bind:ref
	data-slot="combobox-item"
	class={cn(
		'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
		'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
		'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		className
	)}
	{...restProps}
>
	<span class="absolute left-2 flex size-3.5 items-center justify-center">
		<ComboboxPrimitive.ItemIndicator>
			<Check class="size-4" />
		</ComboboxPrimitive.ItemIndicator>
	</span>
	{@render children?.()}
</ComboboxPrimitive.Item>
