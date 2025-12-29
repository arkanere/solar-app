<script lang="ts" module>
	import type { Combobox as ComboboxPrimitive } from 'bits-ui';

	export type ComboboxGroupProps = ComboboxPrimitive.GroupProps;
</script>

<script lang="ts">
	import { Combobox as ComboboxPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComboboxGroupProps = $props();
</script>

<ComboboxPrimitive.Group
	bind:ref
	data-slot="combobox-group"
	class={cn('overflow-hidden p-1', className)}
	{...restProps}
>
	{@render children?.()}
</ComboboxPrimitive.Group>
