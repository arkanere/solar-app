<script lang="ts" module>
	import type { Select as SelectPrimitive } from 'bits-ui';

	export type SelectSeparatorProps = SelectPrimitive.SeparatorProps;
</script>

<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: SelectSeparatorProps = $props();
</script>

<SelectPrimitive.Separator
	bind:ref
	data-slot="select-separator"
	class={cn('-mx-1 my-1 h-px bg-muted', className)}
	{...restProps}
/>
