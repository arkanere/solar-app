<script lang="ts" module>
	import type { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	export type DropdownMenuProps = DropdownMenuPrimitive.RootProps;
</script>

<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	let { ...restProps }: DropdownMenuProps = $props();
</script>

<DropdownMenuPrimitive.Root {...restProps} />
