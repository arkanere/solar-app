<script lang="ts" module>
	import type { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	export type DropdownMenuContentProps = DropdownMenuPrimitive.ContentProps;
</script>

<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 4,
		...restProps
	}: DropdownMenuContentProps = $props();
</script>

<DropdownMenuPrimitive.Portal>
	<DropdownMenuPrimitive.Content
		bind:ref
		data-slot="dropdown-menu-content"
		{sideOffset}
		class={cn(
			'z-dropdown min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
			'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
			'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
			className
		)}
		{...restProps}
	/>
</DropdownMenuPrimitive.Portal>
