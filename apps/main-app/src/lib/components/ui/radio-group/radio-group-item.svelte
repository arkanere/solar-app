<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from "bits-ui";
	import CircleIcon from "@lucide/svelte/icons/circle";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps> = $props();
</script>

<RadioGroupPrimitive.Item
	bind:ref
	data-slot="radio-group-item"
	class={cn(
		"aspect-square size-[var(--radio-item-size)] shrink-0 rounded-[var(--radio-item-radius)] border border-input shadow-xs transition-[color,box-shadow] outline-none text-primary dark:bg-input/30 disabled:cursor-not-allowed disabled:opacity-50",
		"focus-visible:ring-2 ring-ring ring-offset-2",
		"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
		className
	)}
	{...restProps}
>
	{#snippet children({ checked }: any)}
		<div data-slot="radio-group-indicator" class="relative flex items-center justify-center">
			{#if checked}
				<CircleIcon
					class="fill-primary absolute start-1/2 top-1/2 size-[var(--radio-indicator-size)] -translate-x-1/2 -translate-y-1/2"
				/>
			{/if}
		</div>
	{/snippet}
</RadioGroupPrimitive.Item>
