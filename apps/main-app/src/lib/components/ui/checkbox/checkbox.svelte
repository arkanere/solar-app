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
		"peer flex shrink-0 items-center justify-center border border-input shadow-xs transition-all duration-100 outline-none data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary dark:bg-input/30 dark:data-[state=checked]:bg-primary disabled:cursor-not-allowed disabled:opacity-50",
		"size-[var(--checkbox-size)]",
		"rounded-[var(--checkbox-radius)]",
		"focus-visible:ring-2 ring-ring ring-offset-2",
		"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
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
