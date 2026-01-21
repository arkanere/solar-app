<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLThAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLThAttributes> = $props();
</script>

<th
	bind:this={ref}
	data-slot="table-head"
	class={cn(
		"text-foreground bg-clip-padding text-start align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pe-0",
		className
	)}
		style="height: var(--table-head-height); padding-left: var(--table-head-padding-x); padding-right: var(--table-head-padding-x);"
	{...restProps}
>
	{@render children?.()}
</th>
