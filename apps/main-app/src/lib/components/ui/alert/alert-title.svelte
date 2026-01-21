<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="alert-title"
	class={cn("col-start-2 line-clamp-1 min-h-[var(--alert-title-min-height)] font-[var(--alert-title-font-weight)] tracking-[var(--alert-title-tracking)]", className)}
	{...restProps}
>
	{@render children?.()}
</div>
