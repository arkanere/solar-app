<script lang="ts" module>
	import type { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	export type DropdownMenuTriggerProps = DropdownMenuPrimitive.TriggerProps;
</script>

<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	let {
		ref = $bindable(null),
		...restProps
	}: DropdownMenuTriggerProps = $props();
</script>

<DropdownMenuPrimitive.Trigger
	bind:ref
	data-slot="dropdown-menu-trigger"
	{...restProps}
/>
