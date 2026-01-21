<script lang="ts">
	import { Calendar as CalendarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CalendarPrimitive.GridProps = $props();
</script>

<CalendarPrimitive.Grid
	bind:ref
	class={cn("flex w-full border-collapse flex-col", className)}
	style="margin-top: var(--calendar-grid-margin-top); gap: var(--calendar-grid-gap);"
	{...restProps}
/>
