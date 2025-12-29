<script lang="ts" module>
	import type { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	export type DropdownMenuLabelProps = DropdownMenuPrimitive.LabelProps & {
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
	}: DropdownMenuLabelProps = $props();
</script>

<DropdownMenuPrimitive.Label
	bind:ref
	data-slot="dropdown-menu-label"
	class={cn(
		'px-2 py-1.5 text-sm font-semibold text-foreground',
		inset && 'pl-8',
		className
	)}
	{...restProps}
/>
