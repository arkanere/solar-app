<script lang="ts" module>
	import type { Select as SelectPrimitive } from 'bits-ui';

	export type SelectProps<T> = SelectPrimitive.RootProps<T>;
</script>

<script lang="ts" generics="T">
	import { Select as SelectPrimitive } from 'bits-ui';

	let {
		children,
		...restProps
	}: SelectProps<T> = $props();
</script>

<SelectPrimitive.Root data-slot="select" {...restProps}>
	{@render children?.()}
</SelectPrimitive.Root>
