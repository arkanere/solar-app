<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		inset,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		inset?: boolean;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="dropdown-menu-label"
	data-inset={inset}
	class={cn("px-[var(--dropdown-menu-label-padding-x)] py-[var(--dropdown-menu-label-padding-y)] text-sm font-semibold data-[inset]:ps-[var(--dropdown-menu-label-inset-padding)]", className)}
	{...restProps}
>
	{@render children?.()}
</div>
