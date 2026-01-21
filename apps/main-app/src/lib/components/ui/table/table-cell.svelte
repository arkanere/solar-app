<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLTdAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLTdAttributes> = $props();
</script>

<td
	bind:this={ref}
	data-slot="table-cell"
	class={cn(
		"bg-clip-padding align-middle whitespace-nowrap [&:has([role=checkbox])]:pe-0",
		className
	)}
		style="padding: var(--table-cell-padding);"
	{...restProps}
>
	{@render children?.()}
</td>
