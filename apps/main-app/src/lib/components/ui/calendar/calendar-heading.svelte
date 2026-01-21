<script lang="ts">
	import { Calendar as CalendarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CalendarPrimitive.HeadingProps = $props();
</script>

<CalendarPrimitive.Heading
	bind:ref
	class={cn("px-(--cell-size)", className)}
	style="font-size: var(--calendar-heading-text-size); font-weight: var(--calendar-heading-font-weight);"
	{...restProps}
/>
