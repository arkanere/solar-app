<script lang="ts" module>
	import type { Combobox as ComboboxPrimitive } from 'bits-ui';

	export type ComboboxTriggerProps = ComboboxPrimitive.TriggerProps;
</script>

<script lang="ts">
	import { Combobox as ComboboxPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';
	import { ChevronsUpDown } from '@lucide/svelte';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: ComboboxTriggerProps = $props();
</script>

<ComboboxPrimitive.Trigger
	bind:ref
	data-slot="combobox-trigger"
	class={cn(
		'absolute right-0 top-0 flex h-full items-center justify-center px-2',
		'text-muted-foreground hover:text-foreground',
		className
	)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		<ChevronsUpDown class="size-4 opacity-50" />
	{/if}
</ComboboxPrimitive.Trigger>
