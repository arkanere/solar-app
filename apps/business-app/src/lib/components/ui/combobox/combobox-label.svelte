<script lang="ts" module>
	import type { Combobox as ComboboxPrimitive } from 'bits-ui';

	export type ComboboxLabelProps = ComboboxPrimitive.GroupHeadingProps;
</script>

<script lang="ts">
	import { Combobox as ComboboxPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: ComboboxLabelProps = $props();
</script>

<ComboboxPrimitive.GroupHeading
	bind:ref
	data-slot="combobox-label"
	class={cn('px-2 py-1.5 text-xs font-semibold text-muted-foreground', className)}
	{...restProps}
/>
