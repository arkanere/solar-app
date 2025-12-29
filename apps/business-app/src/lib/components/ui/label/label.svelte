<script lang="ts">
	import type { HTMLLabelAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { Snippet } from "svelte";

	type Props = WithElementRef<HTMLLabelAttributes> & {
		children: Snippet;
	};

	let {
		ref = $bindable(null),
		class: className,
		"data-slot": dataSlot = "label",
		children,
		...restProps
	}: Props = $props();
</script>

<label
	bind:this={ref}
	data-slot={dataSlot}
	class={cn(
		"text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
		className
	)}
	{...restProps}
>
	{@render children()}
</label>
