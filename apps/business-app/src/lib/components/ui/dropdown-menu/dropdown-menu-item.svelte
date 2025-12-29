<script lang="ts" module>
	import type { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	export type DropdownMenuItemProps = DropdownMenuPrimitive.ItemProps & {
		inset?: boolean;
	};
</script>

<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		inset = false,
		...restProps
	}: DropdownMenuItemProps = $props();
</script>

<DropdownMenuPrimitive.Item
	bind:ref
	data-slot="dropdown-menu-item"
	class={cn(
		'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
		'transition-colors duration-150',
		'focus:bg-accent focus:text-accent-foreground',
		'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		'[&>svg]:size-4 [&>svg]:shrink-0',
		inset && 'pl-8',
		className
	)}
	{...restProps}
/>
