<script lang="ts" module>
	import type { Combobox as ComboboxPrimitive } from 'bits-ui';

	export type ComboboxContentProps = ComboboxPrimitive.ContentProps;
</script>

<script lang="ts">
	import { Combobox as ComboboxPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 4,
		children,
		...restProps
	}: ComboboxContentProps = $props();
</script>

<ComboboxPrimitive.Portal>
	<ComboboxPrimitive.Content
		bind:ref
		data-slot="combobox-content"
		{sideOffset}
		class={cn(
			'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
			'data-[state=open]:animate-in data-[state=closed]:animate-out',
			'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
			'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
			'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
			'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
			className
		)}
		{...restProps}
	>
		<div class="w-full p-1">
			{@render children?.()}
		</div>
	</ComboboxPrimitive.Content>
</ComboboxPrimitive.Portal>
