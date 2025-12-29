<script lang="ts" module>
	import type { Select as SelectPrimitive } from 'bits-ui';

	export type SelectValueProps = SelectPrimitive.ValueProps;
</script>

<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		placeholder = 'Select an option',
		...restProps
	}: SelectValueProps = $props();
</script>

<SelectPrimitive.Value
	bind:ref
	data-slot="select-value"
	class={cn('data-[placeholder]:text-muted-foreground', className)}
	{placeholder}
	{...restProps}
/>
