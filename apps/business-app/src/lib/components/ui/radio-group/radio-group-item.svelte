<script lang="ts" module>
	import type { RadioGroup as RadioGroupPrimitive } from 'bits-ui';

	export type RadioGroupItemProps = RadioGroupPrimitive.ItemProps;
</script>

<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';
	import { Circle } from '@lucide/svelte';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: RadioGroupItemProps = $props();
</script>

<RadioGroupPrimitive.Item
	bind:ref
	data-slot="radio-group-item"
	class={cn(
		'aspect-square size-4 rounded-full border border-input shadow-xs',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
		'disabled:cursor-not-allowed disabled:opacity-50',
		'data-[state=checked]:border-primary data-[state=checked]:text-primary',
		'transition-colors duration-150',
		className
	)}
	{...restProps}
>
	{#snippet children({ checked })}
		{#if checked}
			<span class="flex items-center justify-center">
				<Circle class="size-2 fill-current text-current" />
			</span>
		{/if}
	{/snippet}
</RadioGroupPrimitive.Item>
