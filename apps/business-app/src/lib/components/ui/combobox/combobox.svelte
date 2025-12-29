<script lang="ts" module>
	import type { Combobox as ComboboxPrimitive } from 'bits-ui';

	export type ComboboxProps<T> = ComboboxPrimitive.RootProps<T>;
</script>

<script lang="ts" generics="T">
	import { Combobox as ComboboxPrimitive } from 'bits-ui';

	let { children, ...restProps }: ComboboxProps<T> = $props();
</script>

<ComboboxPrimitive.Root data-slot="combobox" {...restProps}>
	{@render children?.()}
</ComboboxPrimitive.Root>
