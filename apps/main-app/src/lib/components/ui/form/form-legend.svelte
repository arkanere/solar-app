<script lang="ts">
	import * as FormPrimitive from "formsnap";
	import { cn, type WithoutChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChild<FormPrimitive.LegendProps> = $props();
</script>

<FormPrimitive.Legend
	bind:ref
	class={cn("data-[fs-error]:text-destructive", className)}
	style="font-size: var(--form-legend-font-size); line-height: var(--form-legend-line-height); font-weight: var(--form-legend-font-weight);"
	{...restProps}
/>
