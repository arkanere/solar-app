<script lang="ts" module>
	import type { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	export type DropdownMenuSeparatorProps = DropdownMenuPrimitive.SeparatorProps;
</script>

<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: DropdownMenuSeparatorProps = $props();
</script>

<DropdownMenuPrimitive.Separator
	bind:ref
	data-slot="dropdown-menu-separator"
	class={cn('-mx-1 my-1 h-px bg-border', className)}
	{...restProps}
/>
