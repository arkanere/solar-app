<script lang="ts">
	import { Checkbox as CheckboxPrimitive } from "bits-ui";
	import CheckIcon from "@lucide/svelte/icons/check";
	import MinusIcon from "@lucide/svelte/icons/minus";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		checked = $bindable(false),
		indeterminate = $bindable(false),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<CheckboxPrimitive.RootProps> = $props();
</script>

<CheckboxPrimitive.Root
	bind:ref
	data-slot="checkbox"
	class={cn(
		"border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive peer flex shrink-0 items-center justify-center border shadow-xs transition-all duration-100 outline-none disabled:cursor-not-allowed disabled:opacity-50",
		"size-[var(--checkbox-size)]",
		"rounded-[var(--checkbox-radius)]",
		"focus-visible:ring-[var(--checkbox-ring-width)]",
		className
	)}
	bind:checked
	bind:indeterminate
	{...restProps}
>
	{#snippet children({ checked, indeterminate }: { checked: boolean; indeterminate: boolean })}
		<div data-slot="checkbox-indicator" class="text-current transition-none">
			{#if checked}
				<CheckIcon class="size-[var(--checkbox-icon-size)]" />
			{:else if indeterminate}
				<MinusIcon class="size-[var(--checkbox-icon-size)]" />
			{/if}
		</div>
	{/snippet}
</CheckboxPrimitive.Root>
