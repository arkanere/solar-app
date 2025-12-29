<script lang="ts" module>
	import type { Checkbox as CheckboxPrimitive } from 'bits-ui';

	export type CheckboxProps = CheckboxPrimitive.RootProps;
</script>

<script lang="ts">
	import { Checkbox as CheckboxPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';
	import { Check, Minus } from '@lucide/svelte';

	let {
		ref = $bindable(null),
		checked = $bindable(false),
		class: className,
		...restProps
	}: CheckboxProps = $props();
</script>

<CheckboxPrimitive.Root
	bind:ref
	bind:checked
	data-slot="checkbox"
	class={cn(
		'peer size-4 shrink-0 rounded border border-input shadow-xs',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
		'disabled:cursor-not-allowed disabled:opacity-50',
		'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground',
		'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground',
		'transition-colors duration-150',
		className
	)}
	{...restProps}
>
	{#snippet children({ checked, indeterminate })}
		<span class="flex items-center justify-center text-current">
			{#if indeterminate}
				<Minus class="size-3" />
			{:else if checked}
				<Check class="size-3" />
			{/if}
		</span>
	{/snippet}
</CheckboxPrimitive.Root>
