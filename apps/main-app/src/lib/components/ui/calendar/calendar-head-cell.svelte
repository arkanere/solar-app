<script lang="ts">
	import { Calendar as CalendarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CalendarPrimitive.HeadCellProps = $props();
</script>

<CalendarPrimitive.HeadCell
	bind:ref
	class={cn(
		"text-muted-foreground w-(--cell-size)",
		className
	)}
	style="font-size: var(--calendar-head-cell-text-size); font-weight: var(--calendar-head-cell-font-weight); border-radius: var(--calendar-head-cell-radius);"
	{...restProps}
/>
