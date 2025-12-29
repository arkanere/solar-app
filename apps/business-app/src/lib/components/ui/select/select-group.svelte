<script lang="ts" module>
	import type { Select as SelectPrimitive } from 'bits-ui';

	export type SelectGroupProps = SelectPrimitive.GroupProps;
</script>

<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: SelectGroupProps = $props();
</script>

<SelectPrimitive.Group
	bind:ref
	data-slot="select-group"
	class={cn('p-1', className)}
	{...restProps}
>
	{@render children?.()}
</SelectPrimitive.Group>
