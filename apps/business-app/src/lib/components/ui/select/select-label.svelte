<script lang="ts" module>
	import type { Select as SelectPrimitive } from 'bits-ui';

	export type SelectLabelProps = SelectPrimitive.GroupHeadingProps;
</script>

<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: SelectLabelProps = $props();
</script>

<SelectPrimitive.GroupHeading
	bind:ref
	data-slot="select-label"
	class={cn('px-2 py-1.5 text-xs font-semibold text-muted-foreground', className)}
	{...restProps}
/>
