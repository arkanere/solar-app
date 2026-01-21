<script lang="ts">
	import { Progress as ProgressPrimitive } from "bits-ui";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		max = 100,
		value,
		...restProps
	}: WithoutChildrenOrChild<ProgressPrimitive.RootProps> = $props();
</script>

<ProgressPrimitive.Root
	bind:ref
	data-slot="progress"
	class={cn("relative w-full overflow-hidden", className)}
	style="background-color: var(--progress-bg); height: var(--progress-height); border-radius: var(--progress-radius);"
	{value}
	{max}
	{...restProps}
>
	<div
		data-slot="progress-indicator"
		class="h-full w-full flex-1"
		style="background-color: var(--progress-indicator-bg); transform: translateX(-{100 - (100 * (value ?? 0)) / (max ?? 1)}%); transition: var(--progress-indicator-transition);"
	></div>
</ProgressPrimitive.Root>
