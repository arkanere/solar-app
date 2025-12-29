<script lang="ts" module>
	import type { Combobox as ComboboxPrimitive } from 'bits-ui';

	export type ComboboxInputProps = ComboboxPrimitive.InputProps;
</script>

<script lang="ts">
	import { Combobox as ComboboxPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: ComboboxInputProps = $props();
</script>

<div class="relative">
	<ComboboxPrimitive.Input
		bind:ref
		data-slot="combobox-input"
		class={cn(
			'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm',
			'placeholder:text-muted-foreground',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
			'disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		{...restProps}
	/>
</div>
