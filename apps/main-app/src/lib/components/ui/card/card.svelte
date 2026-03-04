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
	data-slot="card"
	class={cn(
		"bg-card text-card-foreground flex flex-col gap-[var(--card-gap)] rounded-[var(--card-radius)] border py-[var(--card-padding-y)] shadow-[var(--card-shadow)]",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
