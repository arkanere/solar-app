<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableRowElement>> = $props();
</script>

<style>
	tr {
		border-bottom: 1px solid hsl(var(--border));
		transition: var(--table-row-transition);
	}

	tr:hover {
		background-color: var(--table-row-hover-bg);
	}

	tr[data-state="selected"] {
		background-color: var(--table-row-selected-bg);
	}
</style>

<tr
	bind:this={ref}
	data-slot="table-row"
	class={cn("", className)}
	{...restProps}
>
	{@render children?.()}
</tr>
