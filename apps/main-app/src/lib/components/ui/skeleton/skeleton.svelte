<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="skeleton"
	class={cn("bg-gradient-to-r from-card via-background to-card skeleton-shimmer", className)}
	style="border-radius: var(--skeleton-radius)"
	{...restProps}
></div>
